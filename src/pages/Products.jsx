import { useState } from "react";
import { useProductContext } from "../context/ProductContext";
import { useSettingsContext } from "../context/SettingsContext";
import { Package, Plus, Search, Edit2, Trash2 } from "lucide-react";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductContext();
  const { productCategories } = useSettingsContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  
  const defaultCategory = productCategories.length > 0 ? productCategories[0].name : "Vòng gỗ";
  const [formData, setFormData] = useState({ name: "", price: "", category: defaultCategory, stock: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock || 0),
      status: Number(formData.stock || 0) > 0 ? "Còn hàng" : "Hết hàng"
    };

    if (editProductId) {
      updateProduct(editProductId, productData);
      toast.success("Cập nhật sản phẩm thành công!");
    } else {
      addProduct(productData);
      toast.success("Thêm sản phẩm thành công!");
    }

    setIsModalOpen(false);defaultCategory
    setEditProductId(null);
    setFormData({ name: "", price: "", category: "Vòng gỗ", stock: "" });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Danh mục Sản phẩm</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      <div className="card">
        <div style={{ position: "relative", maxWidth: "400px", marginBottom: "1.5rem" }}>
          <Search size={20} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)" }} />
          <input
            type="text" placeholder="Tìm kiếm tên sản phẩm..." className="input" style={{ paddingLeft: "2.5rem" }}
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Phân loại</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div style={{ width: "40px", height: "40px", backgroundColor: "#F1F5F9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-secondary)" }}>
                        <Package size={20} />
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{product.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ backgroundColor: "#F1F5F9", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", color: "#475569" }}>
                      {product.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                    {Number(product.price).toLocaleString('vi-VN')}đ
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`badge ${product.status === 'Còn hàng' ? 'badge-success' : 'badge-danger'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline" style={{ padding: "0.35rem" }} onClick={() => {
                        setEditProductId(product.id);
                        setFormData({ name: product.name, price: product.price, category: product.category, stock: product.stock });
                        setIsModalOpen(true);
                      }}><Edit2 size={16} /></button>
                      <button className="btn btn-outline" style={{ padding: "0.35rem", color: "var(--color-danger)" }} onClick={() => { deleteProduct(product.id); toast.success("Đã xóa!"); }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditProductId(null); setFormData({ name: "", price: "", category: defaultCategory, stock: "" }); }} title={editProductId ? "Chỉnh sửa sản phẩm" : "Thêm Sản phẩm mới"}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tên sản phẩm *</label>
            <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Giá bán *</label>
              <input type="number" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tồn kho</label>
              <input type="number" className="input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Phân loại</label>
            <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              {productCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => { setIsModalOpen(false); setEditProductId(null); setFormData({ name: "", price: "", category: "Vòng gỗ", stock: "" }); }}>Hủy</button>
            <button type="submit" className="btn btn-primary">Lưu sản phẩm</button>defaultCategory
          </div>
        </form>
      </Modal>
    </div>
  );
}
