import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Safely read the saved user. If the stored text is missing or corrupted,
// return null instead of crashing the whole app.
function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(readSavedUser());

  function login(newToken, newUser) {
    // newUser ?? null guarantees we never store the text "undefined"
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser ?? null));
    setToken(newToken);
    setUser(newUser ?? null);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, isLoggedIn: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}