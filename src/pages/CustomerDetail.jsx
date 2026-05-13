import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomerContext } from "../context/CustomerContext";
import { useEmployeeContext } from "../context/EmployeeContext";
import { useAuth } from "../context/AuthContext";
import { useOrderContext } from "../context/OrderContext";
import { useSettingsContext } from "../context/SettingsContext";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import { User, Phone, Mail, Home, Plus } from "lucide-react";
import styles from "./CustomerDetail.module.css";

const PROVINCES = [
  "An Giang", "Bà Rịa-Vũng Tàu", "Bạc Liêu", "Bắc Kạn", "Bắc Giang", "Bắc Ninh", "Bến Tre", "Bình Dương", 
  "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", 
  "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", 
  "Hà Tây", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hòa Bình", "Hồ Chí Minh", "Hậu Giang", "Hưng Yên", 
  "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lào Cai", "Lạng Sơn", "Lâm Đồng", "Long An", 
  "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", 
  "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", 
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, updateCustomer, addCareEvent, addDemand } = useCustomerContext();
  const { employees } = useEmployeeContext();
  const { orders, updateOrder } = useOrderContext();
  const { sources, categories, statuses } = useSettingsContext();

  const salesEmployees = employees.filter(emp => emp.roles.includes("SALES"));
  const { userRole, currentUser } = useAuth();
  
  const ORDER_STATUSES = ["Mới", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã huỷ"];
  
  const [customer, setCustomer] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  // Form states
  const [formData, setFormData] = useState({});
  const [eventData, setEventData] = useState({ status: "Chọn trạng thái", note: "" });
  const [demandText, setDemandText] = useState("");

  useEffect(() => {
    const found = customers.find(c => c.id === id);
    if (found) {
      setCustomer(found);
      setFormData({
        name: found.name || "",
        phone: found.phone || "",
        province: found.province || "",
        address: found.address || "",
        dob: found.dob || "",
        birthTime: found.birthTime || "",
        gender: found.gender || "Nam",
        source: found.source || "",
        category: found.category || "",
        assigneeId: found.assigneeId || "",
        assigneeName: found.assigneeName || ""
      });
    } else {
      toast.error("Không tìm thấy khách hàng!");
      navigate("/customers");
    }
  }, [id, customers, navigate]);

  if (!customer) return <div style={{ padding: "2rem" }}>Đang tải...</div>;

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    updateCustomer(id, {
      name: formData.name,
      phone: formData.phone,
      province: formData.province,
      address: formData.address,
      dob: formData.dob,
      birthTime: formData.birthTime,
      gender: formData.gender,
      source: formData.source,
      category: formData.category
    });
    toast.success("Đã cập nhật thông tin thành công!");
  };

  const handleUpdateAssignee = () => {
    const selected = employees.find(emp => emp.id === formData.assigneeId);
    updateCustomer(id, {
      assigneeId: formData.assigneeId,
      assigneeName: selected?.fullName || ""
    });
    toast.success("Đã cập nhật người phụ trách!");
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (eventData.status === "Chọn trạng thái") {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }
    addCareEvent(id, {
      status: eventData.status,
      note: eventData.note
    });
    toast.success("Thêm sự kiện chăm sóc thành công!");
    setIsEventModalOpen(false);
    setEventData({ status: "Chọn trạng thái", note: "" });
  };

  const handleAddDemand = (e) => {
    e.preventDefault();
    if (!demandText.trim()) {
      toast.error("Vui lòng nhập nhu cầu");
      return;
    }
    addDemand(id, demandText);
    toast.success("Thêm nhu cầu thành công!");
    setIsDemandModalOpen(false);
    setDemandText("");
  };

  const customerOrders = orders.filter(o => o.customerId === id);
  const totalRevenue = customerOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
    toast.success(`Đã cập nhật trạng thái đơn hàng thành: ${newStatus}`);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/customers")}>Khách hàng</span>
          <span>/</span>
          <span>Chi tiết khách hàng</span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* LÊN TRÁI: CHI TIẾT KHÁCH HÀNG */}
        <div className="card" style={{ flex: "2", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--color-primary)" }}>Chi tiết khách hàng</h2>
          
          <form onSubmit={handleUpdateInfo} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
            <div>
              <label className={styles.label}>Họ và tên *</label>
              <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>

            <div className={styles.grid3}>
              <div>
                <label className={styles.label}>Số điện thoại *</label>
                <input type="text" className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div>
                <label className={styles.label}>Giới tính</label>
                <div className="flex gap-4" style={{ marginTop: "0.25rem" }}>
                  <label className="flex items-center gap-2"><input type="radio" name="gender" value="Nam" checked={formData.gender === "Nam"} onChange={e => setFormData({...formData, gender: e.target.value})}/> Nam</label>
                  <label className="flex items-center gap-2"><input type="radio" name="gender" value="Nữ" checked={formData.gender === "Nữ"} onChange={e => setFormData({...formData, gender: e.target.value})}/> Nữ</label>
                </div>
              </div>
            </div>

            <div className={styles.grid3}>
              <div>
                <label className={styles.label}>Tỉnh/Thành phố</label>
                <input type="text" className="input" list="provinces-list" placeholder="Chọn hoặc gõ tên tỉnh..." value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />
                <datalist id="provinces-list">
                  {PROVINCES.map(p => <option key={p} value={p} />)}
                </datalist>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className={styles.label}>Địa chỉ</label>
                <input type="text" className="input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>

            <div className={styles.grid3}>
              <div>
                <label className={styles.label}>Ngày sinh</label>
                <input type="date" className="input" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div>
                <label className={styles.label}>Giờ sinh</label>
                <input type="time" className="input" value={formData.birthTime} onChange={e => setFormData({...formData, birthTime: e.target.value})} />
              </div>
            </div>

            <div className={styles.grid3}>
              <div>
                <label className={styles.label}>Nguồn khách hàng</label>
                <select className="input" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                  <option value="">-- Chọn nguồn --</option>
                  {sources.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className={styles.label}>Hạng mục (Dịch vụ)</label>
                <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">-- Chọn hạng mục --</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
              <button type="submit" className="btn btn-dark" style={{ padding: "0.5rem 1.5rem" }}>Cập nhật</button>
            </div>
          </form>
        </div>

        {/* CỘT PHẢI: PHỤ TRÁCH & LỊCH SỬ CHĂM SÓC */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* PHỤ TRÁCH */}
          <div className="card">
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", color: "var(--color-primary)" }}>Phụ trách</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>
              Người phân bổ: {customer.creatorName} lúc {customer.createdAt}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <select
                className="input"
                value={formData.assigneeId}
                onChange={e => {
                  const selected = salesEmployees.find(emp => emp.id === e.target.value);
                  setFormData({
                    ...formData,
                    assigneeId: selected?.id || "",
                    assigneeName: selected?.fullName || ""
                  });
                }}
                disabled={userRole === "sale"}
              >
                <option value="">Chọn người phụ trách</option>
                {salesEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                ))}
              </select>
              <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                Người phụ trách hiện tại: {customer.assigneeName || customer.saleName || '-'}
              </div>
              {userRole === "admin" && (
                <button className="btn btn-dark" onClick={handleUpdateAssignee}>Cập nhật</button>
              )}
            </div>
          </div>

          {/* LỊCH SỬ CHĂM SÓC */}
          <div className="card" style={{ flex: 1 }}>
            <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-primary)", margin: 0 }}>Lịch sử chăm sóc</h2>
              <button className="btn btn-outline" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }} onClick={() => setIsEventModalOpen(true)}>
                + Tạo mới
              </button>
            </div>

            <div className={styles.timeline}>
              {(!customer.careHistory || customer.careHistory.length === 0) && (
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", textAlign: "center", padding: "1rem 0" }}>Chưa có sự kiện nào.</p>
              )}
              {customer.careHistory?.map(event => (
                <div key={event.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "0.25rem" }}>
                      {new Date(event.date).toLocaleString('vi-VN')} - {event.creatorName}
                    </div>
                    <div style={{ marginBottom: "0.25rem" }}>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        backgroundColor: "#F1F5F9", 
                        padding: "0.15rem 0.4rem", 
                        borderRadius: "4px",
                        color: event.status === 'Đã chốt' ? 'var(--color-success)' : '#475569'
                      }}>
                        {event.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                      {event.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LỊCH SỬ NHU CẦU KHÁCH HÀNG */}
          <div className="card" style={{ flex: 1 }}>
            <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-primary)", margin: 0 }}>Lịch sử nhu cầu khách hàng</h2>
              <button className="btn btn-outline" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }} onClick={() => setIsDemandModalOpen(true)}>
                + Tạo mới
              </button>
            </div>

            <div className={styles.timeline}>
              {(!customer.demands || customer.demands.length === 0) && (
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", textAlign: "center", padding: "1rem 0" }}>Chưa có nhu cầu nào.</p>
              )}
              {customer.demands?.map(demand => (
                <div key={demand.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "0.25rem" }}>
                      {new Date(demand.date).toLocaleString('vi-VN')} - {demand.creatorName}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                      {demand.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* TABS LỊCH SỬ ĐƠN HÀNG */}
      <div className="card" style={{ marginTop: "1.5rem", padding: "0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", padding: "0 1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1px" }}>
            <button style={{ padding: "1rem 0.5rem", borderBottom: "2px solid var(--color-secondary)", color: "var(--color-secondary)", fontWeight: 600, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer", whiteSpace: "nowrap" }}>Danh sách đơn hàng</button>
            <button style={{ padding: "1rem 0.5rem", color: "var(--color-text-secondary)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>Sản phẩm đã mua</button>
            <button style={{ padding: "1rem 0.5rem", color: "var(--color-text-secondary)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>Lịch sử nhu cầu mới</button>
            <button style={{ padding: "1rem 0.5rem", color: "var(--color-text-secondary)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>Lịch sử báo phí</button>
            <button style={{ padding: "1rem 0.5rem", color: "var(--color-text-secondary)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>Lịch sử chi tiêu (cũ)</button>
          </div>
          <button className="btn btn-dark" style={{ padding: "0.4rem 1rem", fontSize: "0.875rem" }} onClick={() => navigate(`/orders/new?customerId=${id}`)}>
            <Plus size={16} style={{ display: "inline-block", marginRight: "0.25rem", verticalAlign: "text-bottom" }} /> Tạo đơn hàng
          </button>
        </div>

        <div style={{ padding: "1.5rem 0 0 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", padding: "0 1.5rem" }}>
            <div style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Tổng tiền: <span style={{ color: "var(--color-danger)" }}>{formatCurrency(totalRevenue)}</span></div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Tổng số bản ghi {customerOrders.length}</div>
          </div>
          
          <div className="table-container">
            <table className="table" style={{ fontSize: "0.875rem" }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.5rem" }}>Khách hàng</th>
                  <th>Người nhận</th>
                  <th>Mã đơn hàng</th>
                  <th>Sản phẩm & Dịch vụ</th>
                  <th>Tổng tiền</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {customerOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary)" }}>
                      Khách hàng này chưa có đơn hàng nào.
                    </td>
                  </tr>
                )}
                {customerOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ paddingLeft: "1.5rem", verticalAlign: "top" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <span style={{ color: "var(--color-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}><User size={14} color="var(--color-secondary)" /> {customer.name}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-text-secondary)" }}><Phone size={14} color="var(--color-text-secondary)" /> {customer.phone}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-text-secondary)" }}><Home size={14} color="var(--color-text-secondary)" /> {customer.province}</span>
                      </div>
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <span style={{ color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}><User size={14} color="var(--color-text-secondary)" /> {customer.name}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-text-secondary)" }}><Phone size={14} color="var(--color-text-secondary)" /> {customer.phone}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--color-secondary)", fontWeight: 600, cursor: "pointer", verticalAlign: "top" }} onClick={() => toast("Chuyển tới trang chi tiết đơn hàng: " + order.code)}>{order.code}</td>
                    <td style={{ verticalAlign: "top" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", color: "var(--color-text-primary)" }}>
                        {order.items.map((item, idx) => (
                          <span key={idx}>
                            {item.name} x {item.quantity}
                            {item.isFree && <span style={{ color: "var(--color-danger)", marginLeft: "0.25rem" }}>(Miễn phí)</span>}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ color: "var(--color-danger)", fontWeight: 600, verticalAlign: "top" }}>{formatCurrency(order.totalPrice)}</td>
                    <td style={{ color: "var(--color-text-primary)", verticalAlign: "top" }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ verticalAlign: "top" }}>
                      <select 
                        className={`badge ${order.status === 'Hoàn thành' ? 'badge-success' : order.status === 'Đang giao' ? 'badge-info' : order.status === 'Mới' ? 'badge-secondary' : 'badge-warning'}`}
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        style={{ cursor: "pointer", border: "none", outline: "none", appearance: "none", paddingRight: "1rem" }}
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status} style={{ color: "initial", backgroundColor: "white" }}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "flex-end" }}>
            <div className="flex gap-1">
              <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>&lt;</button>
              <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderColor: "var(--color-secondary)", color: "var(--color-secondary)" }}>1</button>
              <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>&gt;</button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Tạo sự kiện chăm sóc khách hàng">
        <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-danger)" }}>Trạng thái *</label>
            <select 
              className="input" 
              value={eventData.status} 
              onChange={e => setEventData({...eventData, status: e.target.value})}
              style={{ backgroundColor: eventData.status === 'Chọn trạng thái' ? 'transparent' : 'var(--color-secondary)', color: eventData.status === 'Chọn trạng thái' ? 'inherit' : 'white' }}
            >
              <option value="Chọn trạng thái" style={{ color: "initial" }}>Chọn trạng thái</option>
              {statuses
                .filter(s => !s.name.toLowerCase().includes('nhu cầu'))
                .map(s => (
                  <option key={s.id} value={s.name} style={{ color: "initial" }}>{s.name}</option>
                ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Nội dung chăm sóc *</label>
            <textarea 
              className="input" 
              placeholder="Nhập nội dung tương tác với khách hàng..." 
              required
              value={eventData.note} 
              onChange={e => setEventData({...eventData, note: e.target.value})}
              style={{ minHeight: "100px", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsEventModalOpen(false)}>Đóng</button>
            <button type="submit" className="btn btn-dark">Cập nhật</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDemandModalOpen} onClose={() => setIsDemandModalOpen(false)} title="Thêm nhu cầu khách hàng">
        <form onSubmit={handleAddDemand} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Nhu cầu của khách hàng *</label>
            <textarea 
              className="input" 
              placeholder="Nhập nhu cầu của khách hàng..." 
              required
              value={demandText} 
              onChange={e => setDemandText(e.target.value)}
              style={{ minHeight: "100px", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsDemandModalOpen(false)}>Đóng</button>
            <button type="submit" className="btn btn-dark">Lưu nhu cầu</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
