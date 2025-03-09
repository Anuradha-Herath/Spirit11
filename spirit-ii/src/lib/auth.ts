import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Implement your logic to check if the user is authenticated
    // For example, you can check the token in localStorage or make an API call
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data with the token
      setUser({ name: 'John Doe' }); // Replace with actual user data
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
