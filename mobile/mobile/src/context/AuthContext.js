import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking for a saved session

  // Runs once when the app starts: restore the saved session, if any
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = await SecureStore.getItemAsync("token");
        const savedUser = await SecureStore.getItemAsync("user");
        if (savedToken) {
          setToken(savedToken);
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(null); // corrupted value: treat as no user details
          }
        }
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(newToken, newUser) {
    await SecureStore.setItemAsync("token", newToken);
    await SecureStore.setItemAsync("user", JSON.stringify(newUser ?? null));
    setToken(newToken);
    setUser(newUser ?? null);
  }

  async function logout() {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, loading, isLoggedIn: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}