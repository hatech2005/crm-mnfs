import { createContext, useContext, useEffect, useState } from "react";

const ReceiptContext = createContext();
export const useReceiptContext = () => useContext(ReceiptContext);

const initialReceipts = [
  { id: "PT001", orderId: "DH001", amount: 1500000, date: "06/05/2026", method: "Chuyển khoản", status: "Đã thu", note: "Thu tiền khách Nguyễn Văn A" },
  { id: "PT002", orderId: "DH002", amount: 2000000, date: "05/05/2026", method: "Tiền mặt", status: "Đã thu", note: "Thu một phần tiền tượng" }
];

const getInitialReceipts = () => {
  try {
    const stored = localStorage.getItem("crm_receipts");
    return stored ? JSON.parse(stored) : initialReceipts;
  } catch {
    return initialReceipts;
  }
};

export const ReceiptProvider = ({ children }) => {
  const [receipts, setReceipts] = useState(getInitialReceipts);

  useEffect(() => {
    try {
      localStorage.setItem("crm_receipts", JSON.stringify(receipts));
    } catch (error) {
      console.error("Lỗi lưu receipts vào localStorage:", error);
    }
  }, [receipts]);

  const addReceipt = (receipt) => {
    setReceipts([{ ...receipt, id: `PT${Date.now()}`, date: new Date().toLocaleDateString('vi-VN'), status: receipt.status || "Đã thu" }, ...receipts]);
  };

  const updateReceipt = (id, updatedData) => {
    setReceipts(receipts.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteReceipt = (id) => {
    setReceipts(receipts.filter(r => r.id !== id));
  };

  return (
    <ReceiptContext.Provider value={{ receipts, addReceipt, updateReceipt, deleteReceipt }}>
      {children}
    </ReceiptContext.Provider>
  );
};
