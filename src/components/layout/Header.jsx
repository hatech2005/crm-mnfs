import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

export default function Header({ setIsSidebarOpen }) {
  const { currentUser, userRole } = useAuth();

  return (
    <header className={styles.header}>
      <button 
        className={styles.menuBtn} 
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      <div className={styles.spacer}></div>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {currentUser?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className={styles.details}>
          <span className={styles.name}>{currentUser?.email}</span>
          <span className={styles.role}>
            {userRole === "admin" ? "Quản trị viên" : "Nhân viên Sale"}
          </span>
        </div>
      </div>
    </header>
  );
}
