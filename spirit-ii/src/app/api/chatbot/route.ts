import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the incoming request
    const body = await req.json();
    const { message } = body;
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Process the message and generate response
    try {
      const response = await generateChatbotResponse(message);
      return NextResponse.json({ response });
    } catch (error) {
      console.error('Error generating chatbot response:', error);
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    // Handle JSON parse errors specifically
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to generate chatbot responses
async function generateChatbotResponse(message: string): Promise<string> {
  // Simple response logic for now
  if (message.toLowerCase().includes('help')) {
    return "I can help you with information about players, team recommendations, and cricket rules.";
  }
  
  if (message.toLowerCase().includes('player')) {
    return "You can view detailed player information in the Players tab. I cannot share specific player points as per the rules.";
  }
  
  // Default response
  return "Hello! I'm Spiriter, your fantasy cricket assistant. How can I help you today?";
}