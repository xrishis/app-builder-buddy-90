import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AssignCoolieRequest {
  booking_id: string;
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

    const { booking_id }: AssignCoolieRequest = await req.json()

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select(`
        id,
        status,
        passenger_id,
        passengers (
          user_id,
          users:profiles!passengers_user_id_fkey (
            phone
          )
        )
      `)
      .eq('id', booking_id)
      .single()

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (booking.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: 'Booking is not in pending status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find an available coolie (for now, just get the first available one)
    // In a real system, you'd consider location, ratings, etc.
    const { data: availableCoolie, error: coolieError } = await supabaseClient
      .from('coolies')
      .select('id')
      .eq('is_available', true)
      .eq('kyc_verified', true)
      .limit(1)
      .single()

    if (coolieError || !availableCoolie) {
      return new Response(
        JSON.stringify({ error: 'No available coolies found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate a 3-digit completion PIN
    const completionPin = Math.floor(100 + Math.random() * 900).toString()

    // Assign coolie to booking and generate PIN
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        coolie_id: availableCoolie.id,
        status: 'accepted',
        completion_pin: completionPin
      })
      .eq('id', booking_id)

    if (updateError) {
      console.error('Update booking error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to assign coolie' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark coolie as unavailable
    await supabaseClient
      .from('coolies')
      .update({ is_available: false })
      .eq('id', availableCoolie.id)

    return new Response(
      JSON.stringify({ 
        message: 'Coolie assigned successfully',
        coolie_id: availableCoolie.id,
        completion_pin: completionPin
      }),
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