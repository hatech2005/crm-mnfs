import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEmployeeContext } from "../context/EmployeeContext";

export default function EmployeeNew() {
  const navigate = useNavigate();
  const { addEmployee } = useEmployeeContext();

  const [formData, setFormData] = useState({ fullName: "", username: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    addEmployee({
      fullName: formData.fullName,
      username: formData.username,
      password: formData.password
    });
    
    toast.success("Tạo nhân viên thành công!");
    navigate("/employees");
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out", maxWidth: "600px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/employees")}>Nhân viên</span>
          <span>/</span>
          <span>Tạo mới</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--color-primary)" }}>Tạo nhân viên</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Họ và tên *</label>
            <input type="text" className="input" placeholder="Nhập họ và tên" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tên đăng nhập *</label>
            <input type="text" className="input" placeholder="Nhập tên đăng nhập" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Mật khẩu *</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} className="input" placeholder="Nhập mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Xác nhận mật khẩu *</label>
            <div style={{ position: "relative" }}>
              <input type={showConfirm ? "text" : "password"} className="input" placeholder="Nhập lại mật khẩu" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer" }}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
            <button type="submit" className="btn btn-dark" style={{ padding: "0.5rem 1.5rem" }}>Tạo mới</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/employees")}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
}
