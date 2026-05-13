import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, CreditCard, Eye } from "lucide-react";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import { usePaymentContext } from "../context/PaymentContext";

export default function Payments() {
  const { payments, addPayment } = usePaymentContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ reason: "", amount: "", method: "Chuyển khoản" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.reason) {
      toast.error("Vui lòng điền đủ lý do và số tiền");
      return;
    }
    addPayment({
      ...formData,
      amount: Number(formData.amount)
    });
    toast.success("Tạo phiếu chi thành công!");
    setIsModalOpen(false);
    setFormData({ reason: "", amount: "", method: "Chuyển khoản" });
  };

  const filtered = payments.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Phiếu chi</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>Quản lý chi phí vận hành và mua hàng</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Tạo Phiếu chi
        </button>
      </div>

      <div className="card">
        <div style={{ position: "relative", maxWidth: "400px", marginBottom: "1.5rem" }}>
          <Search size={20} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)" }} />
          <input 
            type="text" className="input" placeholder="Tìm mã phiếu hoặc lý do..." 
            style={{ paddingLeft: "2.5rem" }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Lý do chi</th>
                <th>Số tiền</th>
                <th>Ngày chi</th>
                <th>Hình thức</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: "var(--color-secondary)" }}>{p.id}</td>
                  <td>{p.reason}</td>
                  <td style={{ fontWeight: 600, color: "var(--color-danger)" }}>- {Number(p.amount).toLocaleString('vi-VN')}đ</td>
                  <td style={{ fontSize: "0.875rem" }}>{p.date}</td>
                  <td>{p.method}</td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: "0.35rem" }} onClick={() => navigate(`/payments/${p.id}`)}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tạo Phiếu chi mới">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Lý do chi *</label>
            <input type="text" className="input" placeholder="VD: Mua văn phòng phẩm..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Số tiền *</label>
              <input type="number" className="input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Hình thức</label>
              <select className="input" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Tiền mặt">Tiền mặt</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn btn-danger" style={{ backgroundColor: "var(--color-danger)", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Lưu phiếu chi</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
