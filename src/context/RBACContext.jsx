import { createContext, useContext, useEffect, useState } from "react";

const RBACContext = createContext();

export const useRBACContext = () => useContext(RBACContext);

const initialPermissions = [
  { id: "1", code: "order:list", name: "Xem danh sách đơn hàng", group: "ĐƠN HÀNG" },
  { id: "2", code: "order:create", name: "Tạo đơn hàng", group: "ĐƠN HÀNG" },
  { id: "3", code: "order:cancel", name: "Huỷ đơn hàng", group: "ĐƠN HÀNG" },
  { id: "4", code: "customer:list", name: "Xem danh sách khách hàng", group: "KHÁCH HÀNG" },
  { id: "5", code: "customer:create", name: "Tạo khách hàng", group: "KHÁCH HÀNG" },
  { id: "6", code: "customer:import", name: "Import khách hàng", group: "KHÁCH HÀNG" },
  { id: "7", code: "product:list", name: "Xem danh sách sản phẩm", group: "SẢN PHẨM" },
  { id: "8", code: "product:create", name: "Tạo sản phẩm", group: "SẢN PHẨM" },
  { id: "9", code: "product:import", name: "Import sản phẩm", group: "SẢN PHẨM" },
  { id: "10", code: "receipt:list", name: "Xem danh sách phiếu thu", group: "PHIẾU THU" },
  { id: "11", code: "receipt:create", name: "Tạo phiếu thu", group: "PHIẾU THU" },
  { id: "12", code: "receipt:approve", name: "Duyệt phiếu thu", group: "PHIẾU THU" },
  { id: "13", code: "payment:list", name: "Xem danh sách phiếu chi", group: "PHIẾU CHI" },
  { id: "14", code: "payment:create", name: "Tạo phiếu chi", group: "PHIẾU CHI" },
  { id: "15", code: "payment:approve", name: "Duyệt phiếu chi", group: "PHIẾU CHI" },
  { id: "16", code: "staff:list", name: "Xem danh sách nhân viên", group: "NHÂN VIÊN" },
  { id: "17", code: "staff:manage", name: "Quản lý nhân viên", group: "NHÂN VIÊN" },
  { id: "18", code: "role:list", name: "Xem danh sách vai trò", group: "VAI TRÒ" },
  { id: "19", code: "role:manage", name: "Quản lý vai trò", group: "VAI TRÒ" }
];

const initialRoles = [
  { id: "r1", code: "ADMIN", name: "Quản trị viên", createdAt: "2024-01-01", permissions: ["order:list", "order:cancel", "customer:list", "product:list", "product:create", "receipt:approve", "payment:approve", "staff:manage"] },
  { id: "r2", code: "SALES", name: "Nhân viên kinh doanh", createdAt: "2024-01-01", permissions: ["order:list", "order:create", "customer:list", "customer:create", "product:list"] },
  { id: "r3", code: "WAREHOUSE", name: "Nhân viên kho", createdAt: "2024-01-01", permissions: ["product:list", "product:create"] },
  { id: "r4", code: "ACCOUNTANT", name: "Kế toán", createdAt: "2024-01-01", permissions: ["receipt:approve", "payment:approve"] }
];

const getStoredRBAC = (key, initialValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  } catch {
    return initialValue;
  }
};

export const RBACProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(() => getStoredRBAC("crm_permissions", initialPermissions));
  const [roles, setRoles] = useState(() => getStoredRBAC("crm_roles", initialRoles));

  useEffect(() => {
    try {
      localStorage.setItem("crm_permissions", JSON.stringify(permissions));
    } catch (error) {
      console.error("Lỗi lưu permissions vào localStorage:", error);
    }
  }, [permissions]);

  useEffect(() => {
    try {
      localStorage.setItem("crm_roles", JSON.stringify(roles));
    } catch (error) {
      console.error("Lỗi lưu roles vào localStorage:", error);
    }
  }, [roles]);

  // Permission methods
  const addPermission = (perm) => {
    setPermissions([{ ...perm, id: Date.now().toString() }, ...permissions]);
  };

  const updatePermission = (id, updatedData) => {
    setPermissions(permissions.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  // Role methods
  const addRole = (role) => {
    setRoles([{ ...role, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0], permissions: [] }, ...roles]);
  };

  const updateRole = (id, updatedData) => {
    setRoles(roles.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const value = {
    permissions,
    roles,
    addPermission,
    updatePermission,
    addRole,
    updateRole
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};
