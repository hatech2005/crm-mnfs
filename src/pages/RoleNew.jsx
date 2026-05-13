import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRBACContext } from "../context/RBACContext";

export default function RoleNew() {
  const navigate = useNavigate();
  const { addRole } = useRBACContext();

  const [formData, setFormData] = useState({ code: "", name: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addRole(formData);
    toast.success("Tạo vai trò thành công!");
    navigate("/roles");
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out", maxWidth: "600px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/roles")}>Vai trò</span>
          <span>/</span>
          <span>Tạo mới</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--color-primary)" }}>Tạo vai trò</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Mã vai trò *</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Ví dụ: ADMIN, SALES..." 
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tên vai trò *</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Nhập tên vai trò" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
            <button type="submit" className="btn btn-dark" style={{ padding: "0.5rem 1.5rem" }}>Tạo mới</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/roles")}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
}
