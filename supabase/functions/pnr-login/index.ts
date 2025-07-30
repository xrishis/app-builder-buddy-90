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

    console.log(`Processing PNR: ${pnr} with demo data`);
    
    // Generate dummy passenger data
    const passengerData: PNRData = {
      pnr: pnr,
      name: `Passenger ${pnr.slice(-4)}`,
      coach: `S${Math.floor(Math.random() * 10) + 1}`,
      seat: `${Math.floor(Math.random() * 80) + 1}`,
      train_number: `${Math.floor(Math.random() * 90000) + 10000}`
    };

    // Create a simple success response without complex auth
    console.log('PNR validation successful for demo:', pnr);

    return new Response(
      JSON.stringify({
        success: true,
        passenger: passengerData,
        message: 'PNR validated successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('PNR Login Error:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid PNR format' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});