import { Link } from "react-router-dom";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart2, 
  FileText, 
  CreditCard, 
  Shield, 
  Settings 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { userRole } = useAuth();

  const menuItems = [
    { name: "Nhân viên", path: "/employees", icon: Users, color: "#F59E0B", bg: "#FEF3C7", roles: ["admin"] },
    { name: "Đơn hàng", path: "/orders", icon: ShoppingCart, color: "#3B82F6", bg: "#DBEAFE", roles: ["admin", "sale"] },
    { name: "Khách hàng", path: "/customers", icon: Users, color: "#10B981", bg: "#D1FAE5", roles: ["admin", "sale"] },
    { name: "Phiếu thu", path: "/receipts", icon: FileText, color: "#8B5CF6", bg: "#EDE9FE", roles: ["admin", "sale"] },
    { name: "Phiếu chi", path: "/payments", icon: CreditCard, color: "#EF4444", bg: "#FEE2E2", roles: ["admin"] },
    { name: "Vai trò", path: "/roles", icon: Shield, color: "#6366F1", bg: "#E0E7FF", roles: ["admin"] },
    { name: "Quyền", path: "/permissions", icon: Settings, color: "#EC4899", bg: "#FCE7F3", roles: ["admin"] },
    { name: "Báo cáo", path: "/reports", icon: BarChart2, color: "#14B8A6", bg: "#CCFBF1", roles: ["admin", "sale"] },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>
          Trang chủ
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Chào mừng đến với hệ thống CRM Phong Thủy Minh Nhật.
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
        gap: "1rem" 
      }}>
        {menuItems
          .filter(item => item.roles.includes(userRole))
          .map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link key={idx} to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "1rem",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: "1px solid var(--color-border)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                >
                  <div style={{ 
                    backgroundColor: item.bg, 
                    color: item.color, 
                    padding: "0.75rem", 
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Icon size={24} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: "1rem" }}>{item.name}</span>
                </div>
              </Link>
            );
        })}
      </div>
    </div>
  );
}
