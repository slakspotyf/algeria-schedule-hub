
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
    console.log('Verification request received:', { verificationId, action })
    
    // Create Supabase client with admin privileges to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get verification from database
    const { data: verification, error: fetchError } = await supabase
      .from('payment_verifications')
      .select('*')
      .eq('id', verificationId)
      .single()
    
    if (fetchError || !verification) {
      console.error('Verification not found:', fetchError)
      throw new Error('Verification not found')
    }

    console.log('Verification found:', verification)

    // Update verification status
    const status = action === 'approve' ? 'approved' : 'rejected'
    const { error: updateError } = await supabase
      .from('payment_verifications')
      .update({ status })
      .eq('id', verificationId)

    if (updateError) {
      console.error('Failed to update verification:', updateError)
      throw new Error(`Failed to update verification: ${updateError.message}`)
    }

    console.log(`Verification status updated to: ${status}`)

    // If approved, create a subscription for the user
    if (action === 'approve') {
      // First get user by email - using a query instead of admin.getUserByEmail
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', verification.user_email)
        .single()

      if (userError || !userData) {
        // Fallback to try using from auth directly
        const { data: authData, error: authError } = await supabase
          .rpc('get_user_id_by_email', { user_email: verification.user_email })
        
        if (authError || !authData) {
          console.error('Error fetching user:', userError || authError)
          throw new Error(`User not found: ${verification.user_email}`)
        }
        
        // Create subscription with the user ID we got
        await createSubscription(supabase, authData, verification)
      } else {
        // Create subscription with the user ID we got
        await createSubscription(supabase, userData.id, verification)
      }
      
      // Send notification via Telegram to confirm subscription activation
      await sendTelegramNotification(verification)
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

// Helper function to create subscription
async function createSubscription(supabase, userId, verification) {
  console.log('Creating subscription for user:', userId)
  
  // Calculate subscription period (30 days)
  const currentDate = new Date()
  const expiryDate = new Date(currentDate)
  expiryDate.setDate(currentDate.getDate() + 30)
  
  // Create subscription
  const { error: subError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: verification.plan_id,
      status: 'active',
      current_period_start: currentDate.toISOString(),
      current_period_end: expiryDate.toISOString(),
      cancel_at_period_end: false
    })

  if (subError) {
    console.error('Failed to create subscription:', subError)
    throw new Error(`Failed to create subscription: ${subError.message}`)
  }
  
  console.log('Subscription created successfully')
}

// Helper function to send Telegram notification
async function sendTelegramNotification(verification) {
  const telegramApiKey = Deno.env.get('TELEGRAM_API_KEY')
  const chatId = '1349542277' // Same as notify function
  
  if (!telegramApiKey) {
    console.error('Telegram API key not set')
    return
  }
  
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)
  
  const message = `
✅ *Subscription Activated*

*User:* ${verification.user_email}
*Plan:* ${verification.plan_id === 'standard' ? 'Standard ($9.99)' : 'Premium ($19.99)'}
*Valid until:* ${expiryDate.toISOString().split('T')[0]}

Payment verification #${verification.id} has been approved and subscription activated.
`

  try {
    const telegramResponse = await fetch(
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
    
    if (!telegramResponse.ok) {
      console.error('Telegram notification failed')
    } else {
      console.log('Telegram notification sent successfully')
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
  }
}
