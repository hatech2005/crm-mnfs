import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useOrderContext } from "../context/OrderContext";
import { useCustomerContext } from "../context/CustomerContext";
import { useProductContext } from "../context/ProductContext";
import { ArrowLeft, Trash2, Save } from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrder, deleteOrder } = useOrderContext();
  const { customers } = useCustomerContext();
  const { products } = useProductContext();

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const ORDER_STATUSES = ["Mới", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã huỷ"];

  useEffect(() => {
    const found = orders.find(o => o.id === id);
    if (found) {
      setOrder(found);
      setOrderItems(found.items || []);
    } else {
      toast.error("Không tìm thấy đơn hàng!");
      navigate("/orders");
    }
  }, [id, orders, navigate]);

  if (!order) return <div style={{ padding: "2rem" }}>Đang tải...</div>;

  const customer = customers.find(c => c.id === order.customerId);

  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingItemIndex = orderItems.findIndex(item => item.productId === product.id);
    if (existingItemIndex >= 0) {
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          isFree: false
        }
      ]);
    }
    setSelectedProductId("");
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };

  const handleStatusChange = (newStatus) => {
    updateOrder(id, { status: newStatus, items: orderItems });
    toast.success("Cập nhật trạng thái đơn hàng thành công!");
  };

  const handleSave = () => {
    if (orderItems.length === 0) {
      toast.error("Vui lòng có ít nhất một sản phẩm!");
      return;
    }

    const totalPrice = orderItems.reduce((sum, item) => {
      if (item.isFree) return sum;
      return sum + (item.price * item.quantity);
    }, 0);

    updateOrder(id, { items: orderItems, totalPrice });
    toast.success("Cập nhật đơn hàng thành công!");
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      deleteOrder(id);
      toast.success("Đã xóa đơn hàng!");
      navigate("/orders");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const totalPrice = orderItems.reduce((sum, item) => {
    if (item.isFree) return sum;
    return sum + (item.price * item.quantity);
  }, 0);

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/orders")}>Đơn hàng</span>
          <span>/</span>
          <span>Chi tiết</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button className="btn btn-outline" style={{ padding: "0.5rem" }} onClick={() => navigate("/orders")}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Đơn hàng #{order.code}</h1>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* LÊN TRÁI: THÔNG TIN KHÁCH HÀNG */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <div className="card">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--color-text-primary)" }}>Thông tin người mua</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Khách hàng</span>
                <p style={{ fontWeight: 600, color: "var(--color-primary)", marginTop: "0.25rem" }}>{customer?.name || "N/A"}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Điện thoại</span>
                <p style={{ color: "var(--color-text-primary)", marginTop: "0.25rem" }}>{customer?.phone || "N/A"}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Địa chỉ</span>
                <p style={{ color: "var(--color-text-primary)", marginTop: "0.25rem" }}>{customer?.address || "Chưa có"}, {customer?.province || "N/A"}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Ngày tạo</span>
                <p style={{ color: "var(--color-text-primary)", marginTop: "0.25rem" }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Trạng thái</span>
                <select 
                  className="input"
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{ marginTop: "0.25rem", width: "100%" }}
                >
                  {ORDER_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* LÊN PHẢI: CHI TIẾT SẢN PHẨM */}
        <div style={{ flex: "2", minWidth: "500px" }}>
          <div className="card">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--color-text-primary)" }}>Chi tiết sản phẩm</h2>
            
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <select 
                className="input" 
                value={selectedProductId} 
                onChange={e => setSelectedProductId(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.code} - {p.name} ({formatCurrency(p.price)}đ)</option>
                ))}
              </select>
              <button type="button" className="btn btn-dark" onClick={handleAddProduct}>Thêm</button>
            </div>

            <div className="table-container">
              <table className="table" style={{ fontSize: "0.875rem" }}>
                <thead>
                  <tr>
                    <th style={{ paddingLeft: "1rem" }}>Sản phẩm</th>
                    <th style={{ width: "120px" }}>Đơn giá (VND)</th>
                    <th style={{ width: "80px", textAlign: "center" }}>SL</th>
                    <th style={{ width: "100px", textAlign: "center" }}>Miễn phí</th>
                    <th style={{ width: "120px", textAlign: "right" }}>Thành tiền</th>
                    <th style={{ width: "50px", textAlign: "center" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary)" }}>
                        Chưa có sản phẩm nào trong đơn hàng.
                      </td>
                    </tr>
                  )}
                  {orderItems.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ paddingLeft: "1rem", fontWeight: 500 }}>{item.name}</td>
                      <td>
                        <input 
                          type="number" 
                          className="input" 
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }} 
                          value={item.price} 
                          onChange={e => handleUpdateItem(idx, 'price', Number(e.target.value))}
                          disabled={item.isFree}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="input" 
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem", textAlign: "center" }} 
                          value={item.quantity} 
                          min="1"
                          onChange={e => handleUpdateItem(idx, 'quantity', Number(e.target.value))}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input 
                          type="checkbox" 
                          checked={item.isFree}
                          onChange={e => handleUpdateItem(idx, 'isFree', e.target.checked)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600, color: "var(--color-primary)" }}>
                        {item.isFree ? "Miễn phí" : `${formatCurrency(item.price * item.quantity)}đ`}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button 
                          style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer" }}
                          onClick={() => handleRemoveItem(idx)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Tổng tiền:</span>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>
                    {formatCurrency(totalPrice)}đ
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button 
                  className="btn btn-outline" 
                  style={{ color: "var(--color-danger)" }}
                  onClick={handleDelete}
                >
                  <Trash2 size={16} /> Xóa đơn
                </button>
                <button 
                  className="btn btn-dark"
                  onClick={handleSave}
                >
                  <Save size={16} /> Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
