import { useState } from "react";
import { Plus, Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useOrderContext } from "../context/OrderContext";
import { useCustomerContext } from "../context/CustomerContext";

export default function Orders() {
  const { orders, updateOrder } = useOrderContext();
  const { customers } = useCustomerContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const ORDER_STATUSES = ["Mới", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã huỷ"];
  
  const getCustomerName = (customerId) => {
    const c = customers.find(c => c.id === customerId);
    return c ? c.name : "Khách vãng lai";
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        getCustomerName(o.customerId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "Tất cả" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
    toast.success(`Đã cập nhật trạng thái đơn hàng thành: ${newStatus}`);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Quản lý Đơn hàng</h1>
        </div>
        <button className="btn btn-primary" onClick={() => toast("Vui lòng vào trang Chi tiết khách hàng để tạo đơn hàng")}>
          <Plus size={16} /> Tạo đơn hàng
        </button>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "250px", maxWidth: "400px" }}>
            <Search size={20} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)" }} />
            <input
              type="text" placeholder="Tìm theo mã đơn hoặc tên khách..." className="input" style={{ paddingLeft: "2.5rem", width: "100%" }}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ minWidth: "200px" }}>
            <select 
              className="input" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              {ORDER_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: "var(--color-secondary)" }}>#{order.code}</td>
                  <td style={{ fontWeight: 500 }}>{getCustomerName(order.customerId)}</td>
                  <td>
                    <div style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {order.items?.map(i => i.name).join(", ")}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                    {Number(order.totalPrice).toLocaleString('vi-VN')}đ
                  </td>
                  <td style={{ fontSize: "0.875rem" }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <select 
                      className={`badge ${order.status === 'Hoàn thành' ? 'badge-success' : order.status === 'Đang giao' ? 'badge-info' : order.status === 'Mới' ? 'badge-secondary' : 'badge-warning'}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ cursor: "pointer", border: "none", outline: "none", appearance: "none", paddingRight: "1rem" }}
                    >
                      {ORDER_STATUSES.map(status => (
                        <option key={status} value={status} style={{ color: "initial", backgroundColor: "white" }}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: "0.35rem" }} onClick={() => navigate(`/orders/${order.id}`)}><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
