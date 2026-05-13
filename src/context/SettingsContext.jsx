import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

const initialSources = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Form" },
  { id: "3", name: "Hotline" },
  { id: "4", name: "Khách liên hệ thầy" },
  { id: "5", name: "Tiktok" }
];

const initialCategories = [
  { id: "1", name: "Đặt tên" },
  { id: "2", name: "Xem mệnh lý" },
  { id: "3", name: "Kích đất" },
  { id: "4", name: "Ngày giờ" },
  { id: "5", name: "Động thổ" },
  { id: "6", name: "PTN" }
];

const initialStatuses = [
  { id: "1", name: "Mới tiếp cận" },
  { id: "2", name: "Đang quan tâm" },
  { id: "3", name: "Chờ phản hồi" },
  { id: "4", name: "Đã chốt" },
  { id: "5", name: "Không quan tâm" }
];

const initialProductCategories = [
  { id: "1", name: "Vòng gỗ" },
  { id: "2", name: "Đá phong thủy" },
  { id: "3", name: "Vật phẩm bày trí" },
  { id: "4", name: "Trang sức" },
  { id: "5", name: "Đồ thờ cúng" },
  { id: "6", name: "Vật tư" },
  { id: "7", name: "Hương liệu" }
];

const getStoredValue = (key, initialValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  } catch {
    return initialValue;
  }
};

export const SettingsProvider = ({ children }) => {
  const [sources, setSources] = useState(() => getStoredValue("crm_sources", initialSources));
  const [categories, setCategories] = useState(() => getStoredValue("crm_categories", initialCategories));
  const [statuses, setStatuses] = useState(() => getStoredValue("crm_statuses", initialStatuses));
  const [productCategories, setProductCategories] = useState(() => getStoredValue("crm_product_categories", initialProductCategories));

  useEffect(() => {
    try {
      localStorage.setItem("crm_sources", JSON.stringify(sources));
    } catch (error) {
      console.error("Lỗi lưu sources vào localStorage:", error);
    }
  }, [sources]);

  useEffect(() => {
    try {
      localStorage.setItem("crm_categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Lỗi lưu categories vào localStorage:", error);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem("crm_statuses", JSON.stringify(statuses));
    } catch (error) {
      console.error("Lỗi lưu statuses vào localStorage:", error);
    }
  }, [statuses]);

  useEffect(() => {
    try {
      localStorage.setItem("crm_product_categories", JSON.stringify(productCategories));
    } catch (error) {
      console.error("Lỗi lưu productCategories vào localStorage:", error);
    }
  }, [productCategories]);

  // --- SOURCES ---
  const addSource = (name) => {
    setSources([...sources, { id: Date.now().toString(), name }]);
  };

  const updateSource = (id, newName) => {
    setSources(sources.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const deleteSource = (id) => {
    setSources(sources.filter(s => s.id !== id));
  };

  // --- CATEGORIES ---
  const addCategory = (name) => {
    setCategories([...categories, { id: Date.now().toString(), name }]);
  };

  const updateCategory = (id, newName) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  // --- STATUSES ---
  const addStatus = (name) => {
    setStatuses([...statuses, { id: Date.now().toString(), name }]);
  };

  const updateStatus = (id, newName) => {
    setStatuses(statuses.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const deleteStatus = (id) => {
    setStatuses(statuses.filter(s => s.id !== id));
  };

  // --- PRODUCT CATEGORIES ---
  const addProductCategory = (name) => {
    setProductCategories([...productCategories, { id: Date.now().toString(), name }]);
  };

  const updateProductCategory = (id, newName) => {
    setProductCategories(productCategories.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const deleteProductCategory = (id) => {
    setProductCategories(productCategories.filter(c => c.id !== id));
  };

  const value = {
    sources, addSource, updateSource, deleteSource,
    categories, addCategory, updateCategory, deleteCategory,
    statuses, addStatus, updateStatus, deleteStatus,
    productCategories, addProductCategory, updateProductCategory, deleteProductCategory
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
