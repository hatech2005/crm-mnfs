import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";
import { useRBACContext } from "../context/RBACContext";

export default function Employees() {
  const navigate = useNavigate();
  const { employees } = useEmployeeContext();
  const { roles } = useRBACContext();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = employees.filter(e => 
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const translateRole = (roleCode) => {
    const found = roles.find(r => r.code === roleCode);
    return found ? found.name : roleCode;
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Danh sách nhân viên</h1>
        </div>
        <button className="btn btn-dark" onClick={() => navigate("/employees/new")}>
          <Plus size={16} /> Tạo mới
        </button>
      </div>

      <div className="card" style={{ padding: "0" }}>
        <div style={{ padding: "1.5rem 1rem", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ position: "relative", maxWidth: "300px" }}>
            <Search size={18} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)" }} />
            <input 
              type="text" className="input" placeholder="Tìm kiếm nhân viên..." 
              style={{ paddingLeft: "2.5rem" }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table" style={{ fontSize: "0.875rem" }}>
            <thead>
              <tr>
                <th style={{ width: "80px", paddingLeft: "1.5rem" }}></th>
                <th>Họ tên</th>
                <th>Tên đăng nhập</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/employees/${emp.id}`)}>
                  <td style={{ paddingLeft: "1.5rem" }}>
                    <div style={{ 
                      width: "36px", height: "36px", borderRadius: "50%", 
                      backgroundColor: "#F1F5F9", color: "var(--color-secondary)", 
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 600, fontSize: "0.875rem"
                    }}>
                      {getInitials(emp.fullName)}
                    </div>
                  </td>
                  <td style={{ fontWeight: 500, color: "var(--color-secondary)" }}>{emp.fullName}</td>
                  <td>{emp.username}</td>
                  <td>
                    {emp.roles.map((r, i) => (
                      <span key={i} style={{ marginRight: "0.5rem" }}>
                        {translateRole(r)}{i < emp.roles.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{formatDateDDMMYYYY(emp.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "flex-end" }}>
          <div className="flex gap-1">
            <button className="btn btn-dark" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>1</button>
            <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>2</button>
          </div>
        </div>
      </div>
    </div>
  );
}
