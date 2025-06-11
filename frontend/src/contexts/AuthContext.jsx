import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For checking initial auth status

  // Placeholder: Check for existing token or session on mount
  useEffect(() => {
    // In a real app, you'd verify a token with the backend here
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // setUser({ name: 'Mock User', token: storedToken }); // Example: Decode token or fetch user profile
      // setIsAuthenticated(true);
      console.log('AuthContext: Found token, would verify and set user.');
    }
    setIsLoading(false);
  }, []);

  // Placeholder login function
  const login = async (credentials) => {
    console.log('AuthContext: Attempting login with', credentials);
    // Replace with actual API call
    // Simulating API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'user@example.com' && credentials.password === 'password') {
          const mockUser = { id: '1', name: 'Test User', email: 'user@example.com' };
          const mockToken = 'fake-jwt-token';
          localStorage.setItem('authToken', mockToken);
          setUser(mockUser);
          setIsAuthenticated(true);
          console.log('AuthContext: Login successful');
          resolve(mockUser);
        } else {
          console.log('AuthContext: Login failed');
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  // Placeholder logout function
  const logout = () => {
    console.log('AuthContext: Logging out');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
