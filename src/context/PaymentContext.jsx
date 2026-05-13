import { createContext, useContext, useEffect, useState } from "react";

const PaymentContext = createContext();
export const usePaymentContext = () => useContext(PaymentContext);

const initialPayments = [
  { id: "PC001", reason: "Nhập hàng", amount: 5000000, date: "01/05/2026", method: "Chuyển khoản", status: "Đã chi" },
  { id: "PC002", reason: "Phí vận chuyển", amount: 150000, date: "02/05/2026", method: "Tiền mặt", status: "Đã chi" }
];

const getInitialPayments = () => {
  try {
    const stored = localStorage.getItem("crm_payments");
    return stored ? JSON.parse(stored) : initialPayments;
  } catch {
    return initialPayments;
  }
};

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState(getInitialPayments);

  useEffect(() => {
    try {
      localStorage.setItem("crm_payments", JSON.stringify(payments));
    } catch (error) {
      console.error("Lỗi lưu payments vào localStorage:", error);
    }
  }, [payments]);

  const addPayment = (payment) => {
    setPayments([{ ...payment, id: `PC${Date.now()}`, date: new Date().toLocaleDateString('vi-VN'), status: payment.status || "Đã chi" }, ...payments]);
  };

  const updatePayment = (id, updatedData) => {
    setPayments(payments.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePayment = (id) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  return (
    <PaymentContext.Provider value={{ payments, addPayment, updatePayment, deletePayment }}>
      {children}
    </PaymentContext.Provider>
  );
};
