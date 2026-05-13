import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRBACContext } from "../context/RBACContext";

export default function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roles, permissions, updateRole } = useRBACContext();
  
  const [role, setRole] = useState(null);
  const [infoForm, setInfoForm] = useState({ code: "", name: "" });
  const [selectedPerms, setSelectedPerms] = useState([]);

  useEffect(() => {
    const found = roles.find(r => r.id === id);
    if (found) {
      setRole(found);
      setInfoForm({ code: found.code, name: found.name });
      setSelectedPerms(found.permissions || []);
    } else {
      toast.error("Không tìm thấy vai trò!");
      navigate("/roles");
    }
  }, [id, roles, navigate]);

  if (!role) return <div style={{ padding: "2rem" }}>Đang tải...</div>;

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    updateRole(id, infoForm);
    toast.success("Cập nhật thông tin vai trò thành công!");
  };

  const handleUpdatePermissions = () => {
    updateRole(id, { permissions: selectedPerms });
    toast.success("Cập nhật quyền hạn thành công!");
  };

  const togglePermission = (permCode) => {
    if (selectedPerms.includes(permCode)) {
      setSelectedPerms(selectedPerms.filter(p => p !== permCode));
    } else {
      setSelectedPerms([...selectedPerms, permCode]);
    }
  };

  // Group permissions by 'group' field
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.group]) {
      acc[perm.group] = [];
    }
    acc[perm.group].push(perm);
    return acc;
  }, {});

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/roles")}>Vai trò</span>
          <span>/</span>
          <span>Chi tiết</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* LÊN TRÁI: THÔNG TIN VAI TRÒ */}
        <div style={{ flex: "1", minWidth: "300px", maxWidth: "400px" }}>
          <div className="card">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--color-text-primary)" }}>Thông tin vai trò</h2>
            <form onSubmit={handleUpdateInfo} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Mã vai trò *</label>
                <input 
                  type="text" 
                  className="input" 
                  value={infoForm.code} 
                  onChange={e => setInfoForm({...infoForm, code: e.target.value.toUpperCase()})} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tên vai trò *</label>
                <input 
                  type="text" 
                  className="input" 
                  value={infoForm.name} 
                  onChange={e => setInfoForm({...infoForm, name: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-dark">Lưu thay đổi</button>
                <button type="button" className="btn btn-outline" onClick={() => navigate("/roles")}>Quay lại</button>
              </div>
            </form>
          </div>
        </div>

        {/* LÊN PHẢI: QUYỀN HẠN */}
        <div className="card" style={{ flex: "2", minWidth: "400px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--color-text-primary)", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}>Quyền hạn</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
            {Object.keys(groupedPermissions).map(groupName => (
              <div key={groupName}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: "0.75rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: "16px", height: "16px", border: "1px solid var(--color-border)", display: "inline-block", borderRadius: "2px" }}></span>
                  {groupName}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.5rem" }}>
                  {groupedPermissions[groupName].map(perm => (
                    <label key={perm.code} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        style={{ width: "16px", height: "16px", cursor: "pointer" }} 
                        checked={selectedPerms.includes(perm.code)}
                        onChange={() => togglePermission(perm.code)}
                      />
                      <span style={{ fontSize: "0.875rem", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {perm.name}
                        <span style={{ fontSize: "0.65rem", color: "var(--color-text-secondary)", fontFamily: "monospace" }}>{perm.code}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-dark" onClick={handleUpdatePermissions}>Lưu quyền hạn</button>
        </div>

      </div>
    </div>
  );
}
