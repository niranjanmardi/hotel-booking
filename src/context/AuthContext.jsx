import { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);
const authStorage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storage = authStorage();
      return JSON.parse(storage?.getItem("staywise-user") || "null");
    } catch {
      return null;
    }
  });
  const login = async (email, password) => {
    if (!email || !password) throw new Error("Email and password are required");
    if (!/^\S+@\S+\.\S+$/.test(email))
      throw new Error("Please enter a valid email");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters");
    const next = {
      email,
      name: email.split("@")[0],
      token: `demo-token-${Date.now()}`,
    };
    try {
      authStorage()?.setItem("staywise-user", JSON.stringify(next));
    } catch {}
    setUser(next);
    return next;
  };
  const logout = () => {
    try {
      authStorage()?.removeItem("staywise-user");
    } catch {}
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
