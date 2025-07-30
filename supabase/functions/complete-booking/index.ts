import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CompleteBookingRequest {
  booking_id: string;
  pin: string;
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

    const { booking_id, pin }: CompleteBookingRequest = await req.json()

    // Get booking details with coolie info
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select(`
        id,
        status,
        completion_pin,
        fare,
        coolie_id,
        coolies (
          user_id,
          earnings
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

    if (booking.status !== 'accepted') {
      return new Response(
        JSON.stringify({ error: 'Booking is not in accepted status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify PIN
    if (booking.completion_pin !== pin) {
      return new Response(
        JSON.stringify({ error: 'Invalid PIN' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is either the passenger or coolie involved in this booking
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let canComplete = false
    if (userProfile.role === 'passenger') {
      const { data: passenger } = await supabaseClient
        .from('passengers')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      const { data: bookingPassenger } = await supabaseClient
        .from('bookings')
        .select('passenger_id')
        .eq('id', booking_id)
        .single()
      
      canComplete = passenger?.id === bookingPassenger?.passenger_id
    } else if (userProfile.role === 'coolie' && booking.coolie_id) {
      const { data: coolie } = await supabaseClient
        .from('coolies')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      canComplete = coolie?.id === booking.coolie_id
    }

    if (!canComplete) {
      return new Response(
        JSON.stringify({ error: 'You are not authorized to complete this booking' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Complete the booking
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        status: 'completed',
        is_paid: true
      })
      .eq('id', booking_id)

    if (updateError) {
      console.error('Update booking error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to complete booking' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update coolie earnings and availability
    if (booking.coolie_id && booking.coolies) {
      const newEarnings = booking.coolies.earnings + booking.fare
      await supabaseClient
        .from('coolies')
        .update({ 
          earnings: newEarnings,
          is_available: true 
        })
        .eq('id', booking.coolie_id)
    }

    return new Response(
      JSON.stringify({ message: 'Booking completed successfully' }),
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