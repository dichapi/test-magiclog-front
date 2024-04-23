import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase";

// Crea el contexto
const AuthContext = React.createContext();

export function useAuth(){
  return useContext(AuthContext);
}

// Crea el proveedor del contexto
export function AuthProvider(props) {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setToken(user.getIdToken());
        setCurrentUser(user);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [])

  const value = {
    token,
    setToken,
    currentUser, 
    setCurrentUser,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext };