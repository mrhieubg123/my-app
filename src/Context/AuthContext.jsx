import React, { createContext, useState, useContext } from 'react';

// Tạo AuthContext
const AuthContext = createContext();

// Provider để bao bọc ứng dụng
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để truy cập AuthContext
export const useAuth = () => useContext(AuthContext);
