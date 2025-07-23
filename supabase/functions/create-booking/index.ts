import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingRequest {
  train_number: string;
  platform_number: number;
  luggage_type: string;
  weight: number;
  station_code?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user profile to ensure they're a passenger
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profileError || profile?.role !== 'passenger') {
      return new Response(
        JSON.stringify({ error: 'Only passengers can create bookings' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const bookingData: BookingRequest = await req.json()

    // Get passenger record
    const { data: passenger, error: passengerError } = await supabaseClient
      .from('passengers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (passengerError || !passenger) {
      return new Response(
        JSON.stringify({ error: 'Passenger profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate fare based on weight and luggage type
    const fare = calculateFare(bookingData.weight, bookingData.luggage_type)

    // Create booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        passenger_id: passenger.id,
        train_number: bookingData.train_number,
        platform_number: bookingData.platform_number,
        luggage_type: bookingData.luggage_type,
        weight: bookingData.weight,
        fare: fare,
        status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking creation error:', bookingError)
      return new Response(
        JSON.stringify({ error: 'Failed to create booking' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ booking_id: booking.id, fare: fare }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function calculateFare(weight: number, luggageType: string): number {
  const baseRate = luggageType === 'heavy' ? 50 : luggageType === 'medium' ? 30 : 20
  return Math.max(baseRate, weight * 5)
}