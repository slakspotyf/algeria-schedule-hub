import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize the Supabase client with service role key from environment variable
// This ensures the key is not exposed in your code
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const N8N_WEBHOOK_URL = 'https://achraf40.app.n8n.cloud/webhook/91b1d56c-b9a2-49db-9671-d7e4260765de';

// Deno web server setup
Deno.serve(async (req) => {
  // Set up CORS headers for browser requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Log the start of the function for debugging
    console.log('Starting subscription-webhook function');

    // Initialize the subscription channel
    console.log('Setting up the realtime channel for subscriptions table');
    
    const channel = supabase
      .channel('subscription-webhook')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'subscriptions' 
        }, 
        async (payload) => {
          console.log('Received new subscription:', payload.new);

          try {
            // Send to n8n webhook
            const response = await fetch(N8N_WEBHOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                subscription_data: payload.new,
                timestamp: new Date().toISOString(),
                event: 'new_subscription'
              }),
            });

            const responseText = await response.text();
            console.log('n8n webhook response:', response.status, responseText);
          } catch (error) {
            console.error('Error sending to n8n webhook:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Keep the function running to maintain the subscription
    // In a real deployment, this will stay active until the function is stopped
    
    // Return a success response
    return new Response(JSON.stringify({ 
      status: 'listening',
      message: 'Subscription webhook is now listening for new subscriptions' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error in subscription-webhook function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});
