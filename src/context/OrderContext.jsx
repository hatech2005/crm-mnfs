import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext();

export const useOrderContext = () => useContext(OrderContext);

const initialOrders = [
  { 
    id: "o1", 
    code: "VP052600111", 
    customerId: "1", // Tương ứng Khách hàng 1 (Nguyễn Văn An)
    items: [
      { productId: "p1", name: "Bộ bốc bát hương", price: 1310000, quantity: 3, isFree: false },
      { productId: "p2", name: "Tro Nếp", price: 0, quantity: 18, isFree: true }, // Changed to free to match image
      { productId: "p3", name: "Hộp khăn bao sái Bảo Linh", price: 0, quantity: 1, isFree: true }
    ],
    totalPrice: 3930000,
    status: "Hoàn thành",
    createdAt: "2026-05-05"
  }
];

export const OrderProvider = ({ children }) => {
  const getInitialOrders = () => {
    try {
      const stored = localStorage.getItem("crm_orders");
      return stored ? JSON.parse(stored) : initialOrders;
    } catch {
      return initialOrders;
    }
  };

  const [orders, setOrders] = useState(getInitialOrders);

  useEffect(() => {
    try {
      localStorage.setItem("crm_orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Lỗi lưu orders vào localStorage:", error);
    }
  }, [orders]);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      code: `VP${Math.floor(Math.random() * 1000000000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: "Mới"
    };
    setOrders([newOrder, ...orders]);
  };

  const updateOrder = (id, updatedData) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updatedData } : o));
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const value = {
    orders,
    addOrder,
    updateOrder,
    deleteOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
