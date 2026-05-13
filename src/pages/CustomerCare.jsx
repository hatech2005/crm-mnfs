import { useState } from "react";
import { useCustomerContext } from "../context/CustomerContext";
import { useAuth } from "../context/AuthContext";
import { Phone, Mail, MapPin, Users } from "lucide-react";
import styles from "./CustomerDetail.module.css";

export default function CustomerCare() {
  const { customers } = useCustomerContext();
  const { userRole, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("new");

  // Khách mới - chưa có care history
  const newCustomers = customers.filter(c => {
    const hasCarHistory = c.careHistory && c.careHistory.length > 0;
    const matchRole = userRole === "sale" ? c.assigneeId === currentUser.uid : true;
    return !hasCarHistory && matchRole;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Nhu cầu mới - khách cũ nhưng có demand
  const demandsCustomers = customers.filter(c => {
    const hasCarHistory = c.careHistory && c.careHistory.length > 0;
    const latestDemand = c.demands?.[0];
    const hasNewDemand = latestDemand && new Date(latestDemand.date) >= new Date(Date.now() - 24 * 60 * 60 * 1000);
    const matchRole = userRole === "sale" ? c.assigneeId === currentUser.uid : true;
    return hasCarHistory && hasNewDemand && matchRole;
  }).sort((a, b) => new Date(b.demands[0]?.date) - new Date(a.demands[0]?.date));

  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>
          Chăm sóc khách hàng
        </h1>
      </div>

      {/* TABS */}
      <div className="card" style={{ padding: "0", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-secondary)" }}>
          <button
            onClick={() => setActiveTab("new")}
            style={{
              padding: "1rem 1.5rem",
              borderBottom: activeTab === "new" ? "3px solid var(--color-secondary)" : "none",
              color: activeTab === "new" ? "var(--color-secondary)" : "var(--color-text-secondary)",
              fontWeight: activeTab === "new" ? 600 : 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            <Users size={18} style={{ display: "inline", marginRight: "0.5rem", verticalAlign: "middle" }} />
            Khách mới
            <span style={{ backgroundColor: "#FEE2E2", color: "#B91C1C", padding: "0.25rem 0.5rem", borderRadius: "4px", marginLeft: "0.5rem", fontWeight: 700, fontSize: "0.875rem" }}>
              {newCustomers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("demand")}
            style={{
              padding: "1rem 1.5rem",
              borderBottom: activeTab === "demand" ? "3px solid var(--color-secondary)" : "none",
              color: activeTab === "demand" ? "var(--color-secondary)" : "var(--color-text-secondary)",
              fontWeight: activeTab === "demand" ? 600 : 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Nhu cầu mới
            <span style={{ backgroundColor: "#FEE2E2", color: "#B91C1C", padding: "0.25rem 0.5rem", borderRadius: "4px", marginLeft: "0.5rem", fontWeight: 700, fontSize: "0.875rem" }}>
              {demandsCustomers.length}
            </span>
          </button>
        </div>

        {/* KHÁCH MỚI TAB */}
        {activeTab === "new" && (
          <div style={{ padding: "1.5rem" }}>
            {newCustomers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-secondary)" }}>
                Không có khách hàng mới.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {newCustomers.map(customer => (
                  <div
                    key={customer.id}
                    className="card"
                    style={{
                      padding: "1.5rem",
                      backgroundColor: "#F0F9FF",
                      borderLeft: "4px solid #0284C7"
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
                      {/* Thông tin khách hàng */}
                      <div>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", color: "var(--color-primary)" }}>
                          {customer.name}
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Phone size={16} />
                            <strong>{customer.phone}</strong>
                          </div>
                          
                          {customer.address && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                              <MapPin size={16} style={{ marginTop: "2px" }} />
                              <span>{customer.address}{customer.province ? `, ${customer.province}` : ""}</span>
                            </div>
                          )}

                          {customer.source && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <strong>Nguồn:</strong> <span>{customer.source}</span>
                            </div>
                          )}

                          {customer.category && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <strong>Hạng mục:</strong> <span>{customer.category}</span>
                            </div>
                          )}

                          {customer.demand && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                              <strong>Nhu cầu:</strong> <span>{customer.demand}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Thông tin phân công */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "flex-start" }}>
                        <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>
                            Phụ trách:
                          </div>
                          <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                            {customer.assigneeName || customer.saleName || '-'}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                            Phân số: {formatDateTime(customer.createdAt)}
                          </div>
                        </div>
                        
                        <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>
                            Người tạo:
                          </div>
                          <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                            {customer.creatorName}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                            {formatDateDDMMYYYY(customer.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NHU CẦU MỚI TAB */}
        {activeTab === "demand" && (
          <div style={{ padding: "1.5rem" }}>
            {demandsCustomers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-secondary)" }}>
                Không có nhu cầu mới.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {demandsCustomers.map(customer => (
                  <div
                    key={customer.id}
                    className="card"
                    style={{
                      padding: "1.5rem",
                      backgroundColor: "#FEF3C7",
                      borderLeft: "4px solid #FBBF24"
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
                      {/* Thông tin khách hàng */}
                      <div>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", color: "var(--color-primary)" }}>
                          {customer.name}
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Phone size={16} />
                            <strong>{customer.phone}</strong>
                          </div>
                          
                          {customer.address && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                              <MapPin size={16} style={{ marginTop: "2px" }} />
                              <span>{customer.address}{customer.province ? `, ${customer.province}` : ""}</span>
                            </div>
                          )}

                          {/* Nhu cầu mới */}
                          <div style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "white", borderRadius: "6px", borderLeft: "3px solid #FBBF24" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "0.25rem" }}>
                              Nhu cầu mới:
                            </div>
                            <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                              {customer.demands?.[0]?.description || '-'}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
                              {formatDateTime(customer.demands?.[0]?.date)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin phân công */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "flex-start" }}>
                        <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>
                            Phụ trách:
                          </div>
                          <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                            {customer.assigneeName || customer.saleName || '-'}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                            Phân số: {formatDateTime(customer.createdAt)}
                          </div>
                        </div>

                        {/* Trạng thái chăm sóc gần nhất */}
                        {customer.careHistory && customer.careHistory.length > 0 && (
                          <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>
                              Trạng thái cuối:
                            </div>
                            <div style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
                              {customer.careHistory[0].status}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                              {formatDateTime(customer.careHistory[0].date)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
