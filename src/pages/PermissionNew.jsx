import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRBACContext } from "../context/RBACContext";

export default function PermissionNew() {
  const navigate = useNavigate();
  const { addPermission } = useRBACContext();

  const [formData, setFormData] = useState({ code: "", name: "", group: "KHÁC" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPermission(formData);
    toast.success("Tạo quyền hạn thành công!");
    navigate("/permissions");
  };

  const AVAILABLE_GROUPS = [
    "ĐƠN HÀNG", "KHÁCH HÀNG", "SẢN PHẨM", "PHIẾU THU", "PHIẾU CHI", "NHÂN VIÊN", "VAI TRÒ", "KHÁC"
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out", maxWidth: "600px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/permissions")}>Quyền hạn</span>
          <span>/</span>
          <span>Tạo mới</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--color-primary)" }}>Tạo quyền hạn</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Mã quyền *</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Ví dụ: order:create, customer:list..." 
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tên quyền *</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Nhập tên quyền hạn" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Nhóm quyền *</label>
            <select 
              className="input" 
              value={formData.group} 
              onChange={e => setFormData({...formData, group: e.target.value})}
              required
            >
              {AVAILABLE_GROUPS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
              Nhóm quyền giúp gom cụm các quyền lại với nhau khi phân quyền cho vai trò.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
            <button type="submit" className="btn btn-dark" style={{ padding: "0.5rem 1.5rem" }}>Tạo mới</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/permissions")}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
}
