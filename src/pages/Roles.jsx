import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useRBACContext } from "../context/RBACContext";

export default function Roles() {
  const navigate = useNavigate();
  const { roles } = useRBACContext();

  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Danh sách vai trò</h1>
        </div>
        <button className="btn btn-dark" onClick={() => navigate("/roles/new")}>
          <Plus size={16} /> Tạo mới
        </button>
      </div>

      <div className="card" style={{ padding: "0" }}>
        <div className="table-container">
          <table className="table" style={{ fontSize: "0.875rem" }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: "1.5rem" }}>Tên vai trò</th>
                <th>Mã vai trò</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/roles/${role.id}`)}>
                  <td style={{ paddingLeft: "1.5rem", fontWeight: 500, color: "var(--color-secondary)" }}>
                    {role.name}
                  </td>
                  <td style={{ fontFamily: "monospace", color: "var(--color-text-secondary)" }}>{role.code}</td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{formatDateDDMMYYYY(role.createdAt)}</td>
                </tr>
              ))}
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
