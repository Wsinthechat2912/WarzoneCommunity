import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  login: (username) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username) => {
    setUser({ username });
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
