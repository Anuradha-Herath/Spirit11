import React from 'react';

interface ChatMessageProps {
  message: string;
  isUserMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUserMessage }) => {
  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`p-2 rounded-lg ${isUserMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;