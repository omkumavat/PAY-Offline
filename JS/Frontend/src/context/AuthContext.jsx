import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:4000"; // change if needed

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user on app load
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     setLoading(false);
  //     return;
  //   }

  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch(`${API_URL}/server/user/signup`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!res.ok) throw new Error("Unauthorized");

  //       const data = await res.json();
  //       setUser(data);
  //     } catch (err) {
  //       localStorage.removeItem("token");
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // SIGNUP
  const signup = async (email, password, username) => {
    try {
      setError(null);

      const res = await fetch(`${API_URL}/server/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      setError(null);

      const res = await fetch(`${API_URL}/server/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // console.log(data.token);
      // console.log(data.user);
      
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: localStorage.getItem("user"),
        loading,
        error,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
