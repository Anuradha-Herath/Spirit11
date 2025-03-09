"use client";

import { useState, useRef } from 'react';
import { handleAsk } from '@/lib/chatClient';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: "Hi, I'm Spiriter. How can I help you with fantasy cricket?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage = { id: userMessageId, text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      
      // Get AI response with improved error handling
      const response = await handleAsk(input);
      
      // Add AI response
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          text: response.response,
          isUser: false 
        }
      ]);
    } catch (error) {
      console.error('Failed to get response:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          text: "Sorry, I couldn't process your request right now.",
          isUser: false 
        }
      ]);
    } finally {
      setIsLoading(false);
      // Scroll to bottom again after response
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`mb-3 ${message.isUser ? 'text-right' : ''}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center">
            <div className="ml-2 text-sm text-gray-500">Thinking...</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-2">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask something about fantasy cricket..."
            className="flex-1 p-2 border rounded-l"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r disabled:bg-blue-300"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
