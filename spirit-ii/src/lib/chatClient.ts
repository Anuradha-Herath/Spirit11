/**
 * Client utility for making chatbot API requests with proper error handling
 */

interface ChatResponse {
  response: string;
  error?: string;
}

/**
 * Sends a message to the chatbot API and handles possible errors
 */
export async function handleAsk(message: string): Promise<ChatResponse> {
  try {
    // Input validation
    if (!message || typeof message !== 'string') {
      return { response: "Please provide a valid question.", error: "Invalid input" };
    }

    // Make the API request
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    // Handle non-200 responses
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Use text() first to inspect what we're getting back
    const rawText = await response.text();
    
    // Check if we have content to parse
    if (!rawText || rawText.trim() === '') {
      throw new Error('Empty response from server');
    }
    
    // Try to parse the JSON safely
    try {
      const data = JSON.parse(rawText);
      return { 
        response: data.response || "I don't know how to answer that."
      };
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw response:', rawText);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('Chat request failed:', error);
    return {
      response: "I'm having trouble processing your request right now. Please try again later.",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
