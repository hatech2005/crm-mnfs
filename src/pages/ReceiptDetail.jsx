import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useReceiptContext } from "../context/ReceiptContext";

export default function ReceiptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { receipts, updateReceipt, deleteReceipt } = useReceiptContext();
  const [receipt, setReceipt] = useState(null);
  const [formData, setFormData] = useState({ orderId: "", amount: "", method: "Chuyển khoản", note: "", status: "Đã thu", date: "" });

  useEffect(() => {
    const found = receipts.find(r => r.id === id);
    if (!found) {
      toast.error("Không tìm thấy phiếu thu");
      navigate("/receipts");
      return;
    }
    setReceipt(found);
    setFormData({
      orderId: found.orderId || "",
      amount: found.amount || "",
      method: found.method || "Chuyển khoản",
      note: found.note || "",
      status: found.status || "Đã thu",
      date: found.date || new Date().toLocaleDateString('vi-VN')
    });
  }, [id, receipts, navigate]);

  if (!receipt) return <div style={{ padding: "2rem" }}>Đang tải...</div>;

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.amount) {
      toast.error("Số tiền không được để trống");
      return;
    }
    updateReceipt(id, {
      orderId: formData.orderId,
      amount: Number(formData.amount),
      method: formData.method,
      note: formData.note,
      status: formData.status,
      date: formData.date
    });
    toast.success("Cập nhật phiếu thu thành công");
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phiếu thu này?")) {
      deleteReceipt(id);
      toast.success("Đã xóa phiếu thu");
      navigate("/receipts");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/receipts")}>Phiếu thu</span>
          <span>/</span>
          <span>Chi tiết</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button className="btn btn-outline" style={{ padding: "0.5rem" }} onClick={() => navigate("/receipts")}> <ArrowLeft size={18} /> </button>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Phiếu thu {receipt.id}</h1>
        </div>
      </div>

      <div className="card" style={{ maxWidth: "700px" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="label">Mã phiếu</label>
              <input className="input" value={receipt.id} disabled />
            </div>
            <div>
              <label className="label">Ngày thu</label>
              <input className="input" type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="label">Mã đơn hàng tham chiếu</label>
            <input className="input" value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="label">Số tiền</label>
              <input className="input" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div>
              <label className="label">Hình thức</label>
              <select className="input" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Quẹt thẻ">Quẹt thẻ</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Ghi chú</label>
            <textarea className="input" rows="3" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-outline" onClick={handleDelete} style={{ color: "var(--color-danger)" }}><Trash2 size={16} /> Xóa</button>
            <button type="submit" className="btn btn-dark"><Save size={16} /> Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
