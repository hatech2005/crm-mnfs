import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRBACContext } from "../context/RBACContext";

export default function PermissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { permissions, roles, updatePermission, updateRole } = useRBACContext();
  
  const [permission, setPermission] = useState(null);
  const [infoForm, setInfoForm] = useState({ code: "", name: "", group: "KHÁC" });
  
  // Track which roles currently have this permission
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);

  const AVAILABLE_GROUPS = [
    "ĐƠN HÀNG", "KHÁCH HÀNG", "SẢN PHẨM", "PHIẾU THU", "PHIẾU CHI", "NHÂN VIÊN", "VAI TRÒ", "KHÁC"
  ];

  useEffect(() => {
    const foundPerm = permissions.find(p => p.id === id);
    if (foundPerm) {
      setPermission(foundPerm);
      setInfoForm({ code: foundPerm.code, name: foundPerm.name, group: foundPerm.group || "KHÁC" });

      // Find which roles have this permission
      const roleIdsWithPerm = roles.filter(r => r.permissions && r.permissions.includes(foundPerm.code)).map(r => r.id);
      setSelectedRoleIds(roleIdsWithPerm);
    } else {
      toast.error("Không tìm thấy quyền hạn!");
      navigate("/permissions");
    }
  }, [id, permissions, roles, navigate]);

  if (!permission) return <div style={{ padding: "2rem" }}>Đang tải...</div>;

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    updatePermission(id, infoForm);
    toast.success("Cập nhật thông tin quyền hạn thành công!");
    
    // If the code changed, we'd theoretically need to update all roles that had the old code. 
    // For now, in this mock UI, we just update the permission object. 
    // In a real app, changing a permission code is rare or handled by the backend cascade.
  };

  const handleUpdateRoles = () => {
    // For each role in the system, we need to add or remove this permission code
    roles.forEach(role => {
      const hasPerm = role.permissions?.includes(permission.code);
      const shouldHavePerm = selectedRoleIds.includes(role.id);
      
      if (shouldHavePerm && !hasPerm) {
        updateRole(role.id, { permissions: [...(role.permissions || []), permission.code] });
      } else if (!shouldHavePerm && hasPerm) {
        updateRole(role.id, { permissions: role.permissions.filter(p => p !== permission.code) });
      }
    });
    
    toast.success("Đã phân vai trò cho quyền hạn này!");
  };

  const toggleRole = (roleId) => {
    if (selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds(selectedRoleIds.filter(id => id !== roleId));
    } else {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/permissions")}>Quyền hạn</span>
          <span>/</span>
          <span>Chi tiết</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* LÊN TRÁI: THÔNG TIN QUYỀN HẠN */}
        <div style={{ flex: "2", minWidth: "400px" }}>
          <div className="card">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--color-text-primary)" }}>Thông tin quyền hạn</h2>
            <form onSubmit={handleUpdateInfo} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Mã quyền *</label>
                <input 
                  type="text" 
                  className="input" 
                  value={infoForm.code} 
                  onChange={e => setInfoForm({...infoForm, code: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tên quyền *</label>
                <input 
                  type="text" 
                  className="input" 
                  value={infoForm.name} 
                  onChange={e => setInfoForm({...infoForm, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Nhóm quyền *</label>
                <select 
                  className="input" 
                  value={infoForm.group} 
                  onChange={e => setInfoForm({...infoForm, group: e.target.value})}
                  required
                >
                  {AVAILABLE_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-dark">Lưu thay đổi</button>
                <button type="button" className="btn btn-outline" onClick={() => navigate("/permissions")}>Quay lại</button>
              </div>
            </form>
          </div>
        </div>

        {/* LÊN PHẢI: VAI TRÒ SỞ HỮU QUYỀN */}
        <div className="card" style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--color-text-primary)", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}>Vai trò có quyền này</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            {roles.map(role => (
              <label key={role.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  style={{ width: "16px", height: "16px", cursor: "pointer" }} 
                  checked={selectedRoleIds.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                />
                <span style={{ fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                  {role.name} <span style={{ fontSize: "0.65rem", color: "var(--color-text-secondary)", fontFamily: "monospace", textTransform: "uppercase" }}>({role.code})</span>
                </span>
              </label>
            ))}
            {roles.length === 0 && (
              <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", fontStyle: "italic" }}>Chưa có vai trò nào trong hệ thống.</span>
            )}
          </div>

          <button className="btn btn-dark" onClick={handleUpdateRoles}>Lưu vai trò</button>
        </div>

      </div>
    </div>
  );
}
