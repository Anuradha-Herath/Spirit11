import React from 'react';
import { useAuth } from '@/lib/auth'; // Assuming you have an auth hook
import ChatbotButton from './ChatbotButton';

const Header = () => {
  const { user } = useAuth();

  return (
    <header>
      {/* ...existing code... */}
      {user && <ChatbotButton />}
      {/* ...existing code... */}
    </header>
  );
};

export default Header;