import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

const initialProducts = [
  { id: "p1", code: "SP01", name: "Bộ bốc bát hương", price: 1310000, category: "Đồ thờ cúng", unit: "Bộ" },
  { id: "p2", code: "SP02", name: "Tro Nếp", price: 50000, category: "Vật tư", unit: "Gói" },
  { id: "p3", code: "SP03", name: "Hộp khăn bao sái Bảo Linh", price: 150000, category: "Vật tư", unit: "Hộp" },
  { id: "p4", code: "SP04", name: "Thất bảo", price: 200000, category: "Đồ thờ cúng", unit: "Bộ" },
  { id: "p5", code: "SP05", name: "Trầm hương xông nhà", price: 850000, category: "Hương liệu", unit: "Hộp" }
];

const getInitialProducts = () => {
  try {
    const stored = localStorage.getItem("crm_products");
    return stored ? JSON.parse(stored) : initialProducts;
  } catch {
    return initialProducts;
  }
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(getInitialProducts);

  useEffect(() => {
    try {
      localStorage.setItem("crm_products", JSON.stringify(products));
    } catch (error) {
      console.error("Lỗi lưu products vào localStorage:", error);
    }
  }, [products]);

  const addProduct = (product) => {
    setProducts([{ ...product, id: Date.now().toString() }, ...products]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
