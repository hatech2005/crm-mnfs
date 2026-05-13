import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, FileText, Eye } from "lucide-react";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import { useReceiptContext } from "../context/ReceiptContext";

export default function Receipts() {
  const { receipts, addReceipt } = useReceiptContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ orderId: "", amount: "", method: "Chuyển khoản", note: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount) {
      toast.error("Vui lòng nhập số tiền");
      return;
    }
    addReceipt({
      ...formData,
      amount: Number(formData.amount)
    });
    toast.success("Tạo phiếu thu thành công!");
    setIsModalOpen(false);
    setFormData({ orderId: "", amount: "", method: "Chuyển khoản", note: "" });
  };

  const filtered = receipts.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Phiếu thu</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>Quản lý các khoản tiền thu vào</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Tạo Phiếu thu
        </button>
      </div>

      <div className="card">
        <div style={{ position: "relative", maxWidth: "400px", marginBottom: "1.5rem" }}>
          <Search size={20} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)" }} />
          <input 
            type="text" className="input" placeholder="Tìm mã phiếu hoặc nội dung..." 
            style={{ paddingLeft: "2.5rem" }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Tham chiếu (Mã ĐH)</th>
                <th>Số tiền</th>
                <th>Ngày thu</th>
                <th>Hình thức</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: "var(--color-secondary)" }}>{r.id}</td>
                  <td>{r.orderId || '-'}</td>
                  <td style={{ fontWeight: 600, color: "var(--color-success)" }}>+ {Number(r.amount).toLocaleString('vi-VN')}đ</td>
                  <td style={{ fontSize: "0.875rem" }}>{r.date}</td>
                  <td>{r.method}</td>
                  <td style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>{r.note}</td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: "0.35rem" }} onClick={() => navigate(`/receipts/${r.id}`)}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tạo Phiếu thu mới">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Số tiền *</label>
            <input type="number" className="input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tham chiếu Đơn hàng (Nếu có)</label>
              <input type="text" className="input" placeholder="VD: DH001" value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Hình thức</label>
              <select className="input" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Quẹt thẻ">Quẹt thẻ</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Ghi chú</label>
            <input type="text" className="input" placeholder="Nội dung thu..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary">Lưu phiếu thu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
