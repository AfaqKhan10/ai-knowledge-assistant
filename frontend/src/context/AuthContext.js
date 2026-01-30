import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    // Redirect to dashboard section with hash
    window.location.href = '/dashboard';
  };

  const logout = () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('userName');
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;