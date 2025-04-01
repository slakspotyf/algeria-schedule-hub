
/**
 * Utility functions for n8n webhook integration
 */

/**
 * Trigger an n8n workflow via webhook
 * @param webhookUrl The n8n webhook URL
 * @param data The data to send to the webhook
 * @returns Promise with the result
 */
export const triggerN8nWebhook = async (webhookUrl: string, data: any = {}) => {
  try {
    // Prepare the data to send
    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      source: window.location.origin
    };
    
    console.log("Triggering n8n webhook:", webhookUrl);
    console.log("Payload:", payload);
    
    // Send the request to the n8n webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // Required for cross-origin requests to webhooks
      body: JSON.stringify(payload),
    });
    
    // Since we're using no-cors, we won't get response details
    // Just return success if no exception was thrown
    return { success: true };
  } catch (error) {
    console.error("Error triggering n8n webhook:", error);
    throw error;
  }
};
