import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCustomerContext } from "../context/CustomerContext";
import { useProductContext } from "../context/ProductContext";
import { useOrderContext } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { User, Phone, Home, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function OrderNew() {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const navigate = useNavigate();

  const { customers } = useCustomerContext();
  const { products } = useProductContext();
  const { addOrder } = useOrderContext();
  const { currentUser } = useAuth();

  const [customer, setCustomer] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  
  // State for the product selection input
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    if (!customerId) {
      toast.error("Thiếu thông tin khách hàng!");
      navigate("/customers");
      return;
    }
    const found = customers.find(c => c.id === customerId);
    if (found) {
      setCustomer(found);
    } else {
      toast.error("Không tìm thấy khách hàng!");
      navigate("/customers");
    }
  }, [customerId, customers, navigate]);

  if (!customer) return <div style={{ padding: "2rem" }}>Đang tải...</div>;

  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    // Check if already in list, if so just increase quantity
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
          price: product.price, // Default price from catalog
          quantity: 1,
          isFree: false
        }
      ]);
    }
    setSelectedProductId(""); // Reset selection
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const totalPrice = orderItems.reduce((sum, item) => {
    if (item.isFree) return sum;
    return sum + (item.price * item.quantity);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm!");
      return;
    }

    addOrder({
      customerId: customer.id,
      items: orderItems,
      totalPrice: totalPrice,
      creatorId: currentUser?.uid,
      creatorName: currentUser?.fullName || "admin"
    });

    toast.success("Tạo đơn hàng thành công!");
    navigate(`/customers/${customer.id}`);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out", maxWidth: "1000px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate("/customers")}>Khách hàng</span>
          <span>/</span>
          <span style={{ cursor: "pointer", color: "var(--color-secondary)" }} onClick={() => navigate(`/customers/${customer.id}`)}>Chi tiết</span>
          <span>/</span>
          <span>Tạo đơn hàng mới</span>
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Lên đơn hàng</h1>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* LÊN TRÁI: THÔNG TIN KHÁCH HÀNG & SẢN PHẨM */}
        <div style={{ flex: "2", minWidth: "500px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="card">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--color-text-primary)" }}>Thông tin người mua</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", backgroundColor: "#F8FAFC", borderRadius: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, color: "var(--color-secondary)" }}><User size={16} /> {customer.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-secondary)" }}><Phone size={16} /> {customer.phone}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-secondary)" }}><Home size={16} /> {customer.address || "Chưa có địa chỉ"}, {customer.province}</div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--color-text-primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Chi tiết sản phẩm
            </h2>
            
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <select 
                className="input" 
                value={selectedProductId} 
                onChange={e => setSelectedProductId(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">-- Chọn sản phẩm từ danh mục --</option>
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
                          style={{ width: "16px", height: "16px", cursor: "pointer" }}
                        />
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600, color: item.isFree ? "var(--color-danger)" : "var(--color-text-primary)" }}>
                        {item.isFree ? "0" : formatCurrency(item.price * item.quantity)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button type="button" style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer" }} onClick={() => handleRemoveItem(idx)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* LÊN PHẢI: TỔNG KẾT & XÁC NHẬN */}
        <div className="card" style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--color-text-primary)", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}>Thanh toán</h2>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.875rem" }}>
            <span style={{ color: "var(--color-text-secondary)" }}>Tổng số lượng:</span>
            <span style={{ fontWeight: 600 }}>{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", fontSize: "1.125rem", padding: "1rem", backgroundColor: "#FEF2F2", borderRadius: "8px" }}>
            <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Tổng tiền:</span>
            <span style={{ fontWeight: 700, color: "var(--color-danger)" }}>{formatCurrency(totalPrice)} đ</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button className="btn btn-dark" style={{ width: "100%", padding: "0.75rem" }} onClick={handleSubmit}>
              Xác nhận tạo đơn
            </button>
            <button className="btn btn-outline" style={{ width: "100%", padding: "0.75rem" }} onClick={() => navigate(`/customers/${customer.id}`)}>
              Huỷ bỏ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
