import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'sale'
  const [loading, setLoading] = useState(true);

  // Load user session from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("crm_currentUser");
    const savedRole = localStorage.getItem("crm_userRole");
    if (savedUser && savedRole) {
      setCurrentUser(JSON.parse(savedUser));
      setUserRole(savedRole);
    }
    setLoading(false);
  }, []);

  // MOCK LOGIN FOR UI TESTING
  const login = async (username, password) => {
    setLoading(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (username === "admin" && password === "ha123456") {
      const user = { username: "admin", uid: "admin-1", fullName: "Nguyễn Quản Trị" };
      setCurrentUser(user);
      setUserRole("admin");
      localStorage.setItem("crm_currentUser", JSON.stringify(user));
      localStorage.setItem("crm_userRole", "admin");
      setLoading(false);
      return;
    } else if (username === "staff01") {
      const user = { username: "staff01", uid: "sale-1", fullName: "Trần Thị Bình" };
      setCurrentUser(user);
      setUserRole("sale");
      localStorage.setItem("crm_currentUser", JSON.stringify(user));
      localStorage.setItem("crm_userRole", "sale");
      setLoading(false);
      return;
    }

    setLoading(false);
    throw new Error("Invalid credentials");
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem("crm_currentUser");
    localStorage.removeItem("crm_userRole");
  };

  const value = {
    currentUser,
    userRole,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
