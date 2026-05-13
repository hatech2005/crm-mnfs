import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart2, 
  LogOut,
  Menu,
  Settings
} from "lucide-react";

import styles from "./Sidebar.module.css";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { userRole, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    { name: "Trang chủ", path: "/dashboard", icon: BarChart2, roles: ["admin", "sale"] },
    { name: "Khách hàng", path: "/customers", icon: Users, roles: ["admin", "sale"] },
    { name: "Sản phẩm", path: "/products", icon: Package, roles: ["admin", "sale"] },
    { name: "Đơn hàng", path: "/orders", icon: ShoppingCart, roles: ["admin", "sale"] },
    { name: "Nhân viên", path: "/employees", icon: Users, roles: ["admin"] },
    { name: "Vai trò", path: "/roles", icon: Users, roles: ["admin"] },
    { name: "Quyền hạn", path: "/permissions", icon: Users, roles: ["admin"] },
    { name: "Phiếu thu", path: "/receipts", icon: Package, roles: ["admin", "sale"] },
    { name: "Phiếu chi", path: "/payments", icon: ShoppingCart, roles: ["admin"] },
    { name: "Báo cáo", path: "/reports", icon: BarChart2, roles: ["admin", "sale"] },
    { name: "Cấu hình", path: "/settings", icon: Settings, roles: ["admin"] },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="" className={styles.logoImg} />
        </div>

        <nav className={styles.nav}>
          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </nav>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
