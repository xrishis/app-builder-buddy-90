import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PNRData {
  pnr: string;
  name?: string;
  coach?: string;
  seat?: string;
  train_number?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pnr } = await req.json();

    if (!pnr || pnr.length !== 10) {
      return new Response(
        JSON.stringify({ error: 'Invalid PNR. Must be 10 digits.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use dummy data for PNR validation (no real API call)
    console.log(`Processing PNR: ${pnr} with dummy data`);
    
    // Generate dummy passenger data
    const passengerData: PNRData = {
      pnr: pnr,
      name: `Passenger ${pnr.slice(-4)}`,
      coach: `S${Math.floor(Math.random() * 10) + 1}`,
      seat: `${Math.floor(Math.random() * 80) + 1}`,
      train_number: `${Math.floor(Math.random() * 90000) + 10000}`
    };

      // Initialize Supabase with service role key for admin operations
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Check if passenger already exists
      const { data: existingPassenger } = await supabase
        .from('passengers')
        .select('*')
        .eq('pnr', pnr)
        .single();

      let passengerId;

      if (existingPassenger) {
        // Update existing passenger
        const { data: updatedPassenger, error: updateError } = await supabase
          .from('passengers')
          .update(passengerData)
          .eq('pnr', pnr)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating passenger:', updateError);
          throw updateError;
        }
        passengerId = updatedPassenger.id;
      } else {
        // Insert new passenger
        const { data: newPassenger, error: insertError } = await supabase
          .from('passengers')
          .insert(passengerData)
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting passenger:', insertError);
          throw insertError;
        }
        passengerId = newPassenger.id;
      }

      // Create anonymous session for passenger
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      
      if (authError) {
        console.error('Error creating anonymous session:', authError);
        throw authError;
      }

      // Create or update profile with passenger role
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          role: 'passenger'
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }

      // Link passenger to the authenticated user
      const { error: linkError } = await supabase
        .from('passengers')
        .update({ user_id: authData.user.id })
        .eq('id', passengerId);

      if (linkError) {
        console.error('Error linking passenger to user:', linkError);
        throw linkError;
      }

      console.log('Passenger login successful:', { passengerId, userId: authData.user.id });

      return new Response(
        JSON.stringify({
          success: true,
          passenger: passengerData,
          session: authData.session,
          user: authData.user
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

  } catch (error) {
    console.error('PNR Login Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});