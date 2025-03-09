import React, { useState } from 'react';
import { ChatMessage } from './ChatMessage';

const Spiriter: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    // Call the chatbot API
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: input }),
    });

    const data = await response.json();
    const botMessage = { text: data.response, isUser: false };
    setMessages((prev) => [...prev, botMessage]);
    setInput('');
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about players..."
          className="input-field"
        />
        <button onClick={handleSend} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default Spiriter;