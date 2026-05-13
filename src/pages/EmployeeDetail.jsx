import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useEmployeeContext } from "../context/EmployeeContext";
import { useRBACContext } from "../context/RBACContext";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, updateEmployee } = useEmployeeContext();
  const { roles: rbacRoles } = useRBACContext();
  
  const [employee, setEmployee] = useState(null);
  
  // Forms state
  const [infoForm, setInfoForm] = useState({ fullName: "", username: "" });
  const [pwdForm, setPwdForm] = useState({ password: "", confirmPassword: "" });
  const [roles, setRoles] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const found = employees.find(e => e.id === id);
    if (found) {
      setEmployee(found);
      setInfoForm({ fullName: found.fullName, username: found.username });
      setRoles(found.roles || []);
    } else {
      toast.error("Không tìm thấy nhân viên!");
      navigate("/employees");
    }
  }, [id, employees, navigate]);

  if (!employee) return <div style={{ padding: "2rem" }}>Đang tải...</div>;

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    updateEmployee(id, infoForm);
    toast.success("Cập nhật thông tin thành công!");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (pwdForm.password !== pwdForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    updateEmployee(id, { password: pwdForm.password });
    toast.success("Cập nhật mật khẩu thành công!");
    setPwdForm({ password: "", confirmPassword: "" });
  };

  const handleUpdateRoles = () => {
    updateEmployee(id, { roles });
    toast.success("Cập nhật vai trò thành công!");
  };

  const toggleRole = (roleValue) => {
    if (roles.includes(roleValue)) {
      setRoles(roles.filter(r => r !== roleValue));
    } else {
      setRoles([...roles, roleValue]);
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/employees")}>Nhân viên</span>
          <span>/</span>
          <span>Chi tiết</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* LÊN TRÁI: THÔNG TIN & ĐỔI MẬT KHẨU */}
        <div style={{ flex: "2", minWidth: "400px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="card">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--color-text-primary)" }}>Thông tin nhân viên</h2>
            <form onSubmit={handleUpdateInfo} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Họ và tên *</label>
                <input type="text" className="input" value={infoForm.fullName} onChange={e => setInfoForm({...infoForm, fullName: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tên đăng nhập</label>
                <input type="text" className="input" value={infoForm.username} onChange={e => setInfoForm({...infoForm, username: e.target.value})} />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-dark">Lưu thay đổi</button>
                <button type="button" className="btn btn-outline" onClick={() => navigate("/employees")}>Quay lại</button>
              </div>
            </form>
          </div>

          <div className="card">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--color-text-primary)", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}>Đổi mật khẩu</h2>
            <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Mật khẩu mới *</label>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} className="input" placeholder="Nhập mật khẩu mới" value={pwdForm.password} onChange={e => setPwdForm({...pwdForm, password: e.target.value})} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer" }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Xác nhận mật khẩu *</label>
                <div style={{ position: "relative" }}>
                  <input type={showConfirm ? "text" : "password"} className="input" placeholder="Nhập lại mật khẩu" value={pwdForm.confirmPassword} onChange={e => setPwdForm({...pwdForm, confirmPassword: e.target.value})} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer" }}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-dark">Cập nhật mật khẩu</button>
              </div>
            </form>
          </div>

        </div>

        {/* LÊN PHẢI: PHÂN QUYỀN VAI TRÒ */}
        <div className="card" style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--color-text-primary)", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}>Phân quyền vai trò</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            {rbacRoles.map(role => (
              <label key={role.code} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  style={{ width: "16px", height: "16px", cursor: "pointer" }} 
                  checked={roles.includes(role.code)}
                  onChange={() => toggleRole(role.code)}
                />
                <span style={{ fontSize: "0.875rem", color: "var(--color-text-primary)" }}>{role.name} ({role.code})</span>
              </label>
            ))}
          </div>

          <button className="btn btn-dark" onClick={handleUpdateRoles}>Lưu vai trò</button>
        </div>

      </div>
    </div>
  );
}
