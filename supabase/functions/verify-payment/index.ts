
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
        .from('users')
        .select('id')
        .eq('email', verification.user_email)
        .single()

      if (userError) {
        console.error('Error fetching user:', userError)
        
        // Try to get user from auth schema instead
        const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserByEmail(
          verification.user_email
        )
        
        if (authUserError || !authUser?.user) {
          throw new Error(`User not found: ${verification.user_email}`)
        }
        
        // Calculate subscription period (30 days)
        const currentDate = new Date()
        const expiryDate = new Date(currentDate)
        expiryDate.setDate(currentDate.getDate() + 30)
        
        // Create subscription
        const { error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: authUser.user.id,
            plan_id: verification.plan_id,
            status: 'active',
            current_period_start: currentDate.toISOString(),
            current_period_end: expiryDate.toISOString(),
            cancel_at_period_end: false
          })

        if (subError) {
          throw new Error(`Failed to create subscription: ${subError.message}`)
        }
        
        // Send notification via Telegram to confirm subscription activation
        const telegramApiKey = Deno.env.get('TELEGRAM_API_KEY')
        const chatId = '1349542277' // Same as notify function
        
        if (telegramApiKey) {
          const message = `
✅ *Subscription Activated*

*User:* ${verification.user_email}
*Plan:* ${verification.plan_id === 'standard' ? 'Standard ($9.99)' : 'Premium ($19.99)'}
*Valid until:* ${expiryDate.toISOString().split('T')[0]}

Payment verification #${verification.id} has been approved and subscription activated.
`

          await fetch(
            `https://api.telegram.org/bot${telegramApiKey}/sendMessage`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
              }),
            }
          )
        }
      }
    }

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
