import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { usePaymentContext } from "../context/PaymentContext";

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { payments, updatePayment, deletePayment } = usePaymentContext();
  const [payment, setPayment] = useState(null);
  const [formData, setFormData] = useState({ reason: "", amount: "", method: "Chuyển khoản", status: "Đã chi", date: "" });

  useEffect(() => {
    const found = payments.find(p => p.id === id);
    if (!found) {
      toast.error("Không tìm thấy phiếu chi");
      navigate("/payments");
      return;
    }
    setPayment(found);
    setFormData({
      reason: found.reason || "",
      amount: found.amount || "",
      method: found.method || "Chuyển khoản",
      status: found.status || "Đã chi",
      date: found.date || new Date().toLocaleDateString('vi-VN')
    });
  }, [id, payments, navigate]);

  if (!payment) return <div style={{ padding: "2rem" }}>Đang tải...</div>;

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.reason || !formData.amount) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    updatePayment(id, {
      reason: formData.reason,
      amount: Number(formData.amount),
      method: formData.method,
      status: formData.status,
      date: formData.date
    });
    toast.success("Cập nhật phiếu chi thành công");
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phiếu chi này?")) {
      deletePayment(id);
      toast.success("Đã xóa phiếu chi");
      navigate("/payments");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/payments")}>Phiếu chi</span>
          <span>/</span>
          <span>Chi tiết</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button className="btn btn-outline" style={{ padding: "0.5rem" }} onClick={() => navigate("/payments")}> <ArrowLeft size={18} /> </button>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Phiếu chi {payment.id}</h1>
        </div>
      </div>

      <div className="card" style={{ maxWidth: "700px" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="label">Mã phiếu</label>
              <input className="input" value={payment.id} disabled />
            </div>
            <div>
              <label className="label">Ngày chi</label>
              <input className="input" type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="label">Lý do chi</label>
            <input className="input" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
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
              </select>
            </div>
          </div>
          <div>
            <label className="label">Trạng thái</label>
            <select className="input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="Đã chi">Đã chi</option>
              <option value="Chờ chi">Chờ chi</option>
            </select>
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
