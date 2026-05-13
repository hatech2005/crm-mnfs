import { createContext, useContext, useEffect, useState } from "react";

const EmployeeContext = createContext();

export const useEmployeeContext = () => useContext(EmployeeContext);

const initialEmployees = [
  {
    id: "1",
    fullName: "Nguyễn Quản Trị",
    username: "admin",
    roles: ["ADMIN"],
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    fullName: "Trần Thị Bình",
    username: "staff01",
    roles: ["SALES"],
    createdAt: "2024-02-15"
  },
  {
    id: "3",
    fullName: "Lê Văn Cường",
    username: "staff02",
    roles: ["WAREHOUSE"],
    createdAt: "2024-02-20"
  },
  {
    id: "4",
    fullName: "Phạm Thị Dung",
    username: "staff03",
    roles: ["SALES"],
    createdAt: "2024-03-01"
  },
  {
    id: "5",
    fullName: "Hoàng Văn Em",
    username: "staff04",
    roles: ["WAREHOUSE"],
    createdAt: "2024-03-10"
  }
];

const getInitialEmployees = () => {
  try {
    const stored = localStorage.getItem("crm_employees");
    return stored ? JSON.parse(stored) : initialEmployees;
  } catch {
    return initialEmployees;
  }
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(getInitialEmployees);

  useEffect(() => {
    try {
      localStorage.setItem("crm_employees", JSON.stringify(employees));
    } catch (error) {
      console.error("Lỗi lưu employees vào localStorage:", error);
    }
  }, [employees]);

  const addEmployee = (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: Date.now().toString(),
      roles: employeeData.roles || ["SALES"], // Default role
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEmployees([newEmployee, ...employees]);
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, ...updatedData } : e));
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const value = {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};
