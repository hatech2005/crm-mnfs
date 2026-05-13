import { useState } from "react";
import { useSettingsContext } from "../context/SettingsContext";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const SettingsList = ({ title, items, onAdd, onUpdate, onDelete }) => {
  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAdd(newItemName.trim());
    setNewItemName("");
    toast.success(`Đã thêm ${newItemName}`);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = (id) => {
    if (!editName.trim()) {
      toast.error("Tên không được để trống");
      return;
    }
    onUpdate(id, editName.trim());
    setEditingId(null);
    toast.success("Cập nhật thành công");
  };

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", color: "var(--color-primary)" }}>{title}</h2>
      
      <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <input 
          type="text" 
          className="input" 
          placeholder={`Thêm ${title.toLowerCase()} mới...`} 
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-dark">
          <Plus size={16} /> Thêm
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.length === 0 && <p style={{ color: "var(--color-text-secondary)", textAlign: "center" }}>Chưa có dữ liệu</p>}
        {items.map(item => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
            {editingId === item.id ? (
              <div style={{ display: "flex", gap: "0.5rem", flex: 1, marginRight: "1rem" }}>
                <input 
                  type="text" 
                  className="input" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ flex: 1, padding: "0.25rem 0.5rem" }}
                  autoFocus
                />
                <button className="btn" style={{ padding: "0.25rem 0.5rem", backgroundColor: "var(--color-success)", color: "white" }} onClick={() => handleUpdate(item.id)}>
                  <Save size={16} />
                </button>
                <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem" }} onClick={cancelEdit}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{item.name}</span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button style={{ background: "none", border: "none", color: "var(--color-secondary)", cursor: "pointer" }} onClick={() => startEdit(item)}>
                    <Edit2 size={16} />
                  </button>
                  <button style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer" }} onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
                      onDelete(item.id);
                      toast.success("Đã xóa thành công");
                    }
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("sources");
  const { 
    sources, addSource, updateSource, deleteSource,
    categories, addCategory, updateCategory, deleteCategory,
    statuses, addStatus, updateStatus, deleteStatus,
    productCategories, addProductCategory, updateProductCategory, deleteProductCategory
  } = useSettingsContext();

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Cấu hình hệ thống</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>Quản lý các danh mục và dữ liệu chung của hệ thống</p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem" }}>
        <button 
          className={`btn ${activeTab === 'sources' ? 'btn-dark' : 'btn-outline'}`}
          onClick={() => setActiveTab("sources")}
        >
          Nguồn khách
        </button>
        <button 
          className={`btn ${activeTab === 'categories' ? 'btn-dark' : 'btn-outline'}`}
          onClick={() => setActiveTab("categories")}
        >
          Hạng mục
        </button>
        <button 
          className={`btn ${activeTab === 'statuses' ? 'btn-dark' : 'btn-outline'}`}
          onClick={() => setActiveTab("statuses")}
        >
          Trạng thái chăm sóc
        </button>
        <button 
          className={`btn ${activeTab === 'productCategories' ? 'btn-dark' : 'btn-outline'}`}
          onClick={() => setActiveTab("productCategories")}
        >
          Phân loại sản phẩm
        </button>
      </div>

      {activeTab === "sources" && (
        <SettingsList 
          title="Nguồn khách hàng" 
          items={sources} 
          onAdd={addSource} 
          onUpdate={updateSource} 
          onDelete={deleteSource} 
        />
      )}

      {activeTab === "categories" && (
        <SettingsList 
          title="Hạng mục (Dịch vụ)" 
          items={categories} 
          onAdd={addCategory} 
          onUpdate={updateCategory} 
          onDelete={deleteCategory} 
        />
      )}

      {activeTab === "statuses" && (
        <SettingsList 
          title="Trạng thái chăm sóc" 
          items={statuses} 
          onAdd={addStatus} 
          onUpdate={updateStatus} 
          onDelete={deleteStatus} 
        />
      )}

      {activeTab === "productCategories" && (
        <SettingsList 
          title="Phân loại sản phẩm" 
          items={productCategories} 
          onAdd={addProductCategory} 
          onUpdate={updateProductCategory} 
          onDelete={deleteProductCategory} 
        />
      )}
    </div>
  );
}
