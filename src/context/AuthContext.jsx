// ============================================================================
// UNIT 3 - EXPERIMENT 4b: AuthContext using Context API for Authentication Status
// UNIT 4 - EXPERIMENT 4a, 4b, 4e: User Login, Registration, Token Storage & Logout
// ============================================================================

import { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);

const authStorage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const getRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("staywise-registered-users") || "[]");
  } catch {
    return [];
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

  // [UNIT 4 - EXP 4a]: Register new user account
  const register = async (name, email, password) => {
    if (!name || !email || !password) throw new Error("Name, email, and password are required");
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Please enter a valid email address");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    const users = getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists. Please sign in instead.");
    }

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      token: `user-token-${Date.now()}`
    };

    users.push(newUser);
    try {
      localStorage.setItem("staywise-registered-users", JSON.stringify(users));
    } catch {}

    const sessionUser = {
      name: newUser.name,
      email: newUser.email,
      token: newUser.token
    };

    try {
      authStorage()?.setItem("staywise-user", JSON.stringify(sessionUser));
    } catch {}

    setUser(sessionUser);
    console.log("%c[AUTH: REGISTER SUCCESS] User registered & logged in:", "color: #16a34a; font-weight: bold;", sessionUser);
    return sessionUser;
  };

  // [UNIT 4 - EXP 4a]: Login with registered user or demo credentials
  const login = async (email, password) => {
    if (!email || !password) throw new Error("Email and password are required");
    if (!/^\S+@\S+\.\S+$/.test(email))
      throw new Error("Please enter a valid email address");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters");

    const users = getRegisteredUsers();
    const registered = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (registered && registered.password !== password) {
      throw new Error("Incorrect password for this account.");
    }

    const next = {
      email,
      name: registered?.name || email.split("@")[0],
      token: registered?.token || `demo-token-${Date.now()}`,
    };

    try {
      authStorage()?.setItem("staywise-user", JSON.stringify(next));
    } catch {}

    setUser(next);
    console.log("%c[AUTH: LOGIN SUCCESS] Logged in as:", "color: #0f766e; font-weight: bold;", next);
    return next;
  };

  // [UNIT 4 - EXP 4e]: Logout functionality
  const logout = () => {
    try {
      authStorage()?.removeItem("staywise-user");
    } catch {}
    setUser(null);
    console.log("%c[AUTH: LOGOUT] User signed out.", "color: #dc2626; font-weight: bold;");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
