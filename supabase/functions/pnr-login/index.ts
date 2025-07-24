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

    // Fetch PNR details from public API
    console.log(`Fetching PNR details for: ${pnr}`);
    
    try {
      const pnrResponse = await fetch(`http://pnrapi.dfth.in/pnr/${pnr}`);
      const pnrData = await pnrResponse.json();
      
      if (!pnrResponse.ok || !pnrData) {
        throw new Error('PNR not found or invalid');
      }

      console.log('PNR API Response:', pnrData);

      // Extract passenger details (adjust based on actual API response structure)
      const passengerData: PNRData = {
        pnr: pnr,
        name: pnrData.passenger_name || pnrData.name || '',
        coach: pnrData.coach || '',
        seat: pnrData.seat || '',
        train_number: pnrData.train_number || pnrData.train || ''
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

    } catch (apiError) {
      console.error('PNR API Error:', apiError);
      
      // Fallback: allow manual entry if API fails
      return new Response(
        JSON.stringify({ 
          error: 'PNR API unavailable. Please try again later.',
          fallback: true 
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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