import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  email?: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fix: Changed JSX syntax to React.createElement calls
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return React.createElement(
    AuthContext.Provider, 
    { value: { user, setUser } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
