
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentVerificationRequest {
  email: string;
  userEmail: string;
  planId: string;
  transactionId: string;
  amount: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, userEmail, planId, transactionId, amount }: PaymentVerificationRequest = await req.json()
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Get Telegram API key from environment variables
    const telegramApiKey = Deno.env.get('TELEGRAM_API_KEY')
    const chatId = '1349542277' // As provided by user
    
    if (!telegramApiKey) {
      throw new Error('Telegram API key not set')
    }

    // Store the pending payment request in the database
    const { data, error } = await supabase
      .from('payment_verifications')
      .insert({
        user_email: userEmail,
        binance_email: email,
        plan_id: planId,
        transaction_id: transactionId,
        amount: amount,
        status: 'pending'
      })
      .select('id')
      .single()
    
    if (error) throw error

    // Format message for Telegram
    const verificationUrl = `${req.headers.get('origin') || 'https://localhost:3000'}/admin/verify?id=${data.id}`
    
    const message = `
🔔 *New Payment Verification Request*

*Plan:* ${planId === 'standard' ? 'Standard ($9.99)' : 'Premium ($19.99)'}
*User Email:* ${userEmail}
*Binance Email:* ${email}
*Transaction ID:* ${transactionId}
*Amount:* ${amount}

[Approve or Reject](${verificationUrl})
`

    // Send notification to Telegram
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
      const errorData = await telegramResponse.json()
      throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verification request submitted',
        verificationId: data.id
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in notify-payment function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    )
  }
})
