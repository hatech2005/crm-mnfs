import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useRBACContext } from "../context/RBACContext";

export default function Permissions() {
  const navigate = useNavigate();
  const { permissions, roles } = useRBACContext();

  const getRolesForPermission = (permCode) => {
    return roles.filter(r => r.permissions && r.permissions.includes(permCode)).map(r => r.name);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Danh sách quyền hạn</h1>
        </div>
        <button className="btn btn-dark" onClick={() => navigate("/permissions/new")}>
          <Plus size={16} /> Tạo mới
        </button>
      </div>

      <div className="card" style={{ padding: "0" }}>
        <div className="table-container">
          <table className="table" style={{ fontSize: "0.875rem" }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: "1.5rem" }}>Tên quyền</th>
                <th>Mã quyền</th>
                <th>Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map(perm => {
                const associatedRoles = getRolesForPermission(perm.code);
                return (
                  <tr key={perm.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/permissions/${perm.id}`)}>
                    <td style={{ paddingLeft: "1.5rem", fontWeight: 500, color: "var(--color-secondary)" }}>
                      {perm.name}
                    </td>
                    <td style={{ fontFamily: "monospace", color: "var(--color-text-secondary)" }}>{perm.code}</td>
                    <td>
                      <div className="flex gap-2 flex-wrap">
                        {associatedRoles.length === 0 ? (
                          <span style={{ color: "var(--color-text-secondary)", fontStyle: "italic", fontSize: "0.75rem" }}>Chưa gán</span>
                        ) : (
                          associatedRoles.map((roleName, idx) => (
                            <span key={idx} style={{ 
                              padding: "0.25rem 0.5rem", 
                              backgroundColor: "#F1F5F9", 
                              border: "1px solid var(--color-border)",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              color: "var(--color-text-primary)"
                            }}>
                              {roleName}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "flex-end" }}>
          <div className="flex gap-1">
            <button className="btn btn-dark" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>1</button>
          </div>
        </div>
      </div>
    </div>
  );
}
