
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { verificationId, action } = await req.json()
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get verification from database
    const { data: verification, error: fetchError } = await supabase
      .from('payment_verifications')
      .select('*')
      .eq('id', verificationId)
      .single()
    
    if (fetchError || !verification) {
      throw new Error('Verification not found')
    }

    // Update verification status
    const status = action === 'approve' ? 'approved' : 'rejected'
    const { error: updateError } = await supabase
      .from('payment_verifications')
      .update({ status })
      .eq('id', verificationId)

    if (updateError) {
      throw new Error(`Failed to update verification: ${updateError.message}`)
    }

    // If approved, create a subscription for the user
    if (action === 'approve') {
      // First get the user id from their email
      const { data: userData, error: userError } = await supabase
        .from('auth')
        .select('id')
        .eq('email', verification.user_email)
        .single()

      if (userError) {
        console.error('Error fetching user:', userError)
      } else {
        // Create subscription
        const { error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userData.id,
            plan_id: verification.plan_id,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancel_at_period_end: false
          })

        if (subError) {
          console.error('Error creating subscription:', subError)
        }
      }
    }

    // Send notification to user about their verification status
    // (This would be implemented in a real system)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Payment verification ${status}` 
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in verify-payment function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    )
  }
})
