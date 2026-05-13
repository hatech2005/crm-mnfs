import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CustomerContext = createContext();

export const useCustomerContext = () => useContext(CustomerContext);

// Dữ liệu mẫu (Mock Data) bám sát cấu trúc mới
const initialCustomers = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    gender: "Nam",
    phone: "0912345678",
    dob: "1990-05-15",
    birthTime: "08:30",
    province: "Hà Nội",
    address: "123 Lê Lợi",
    source: "Facebook",
    category: "Đặt tên",
    status: "Tiềm năng",
    creatorId: "admin",
    creatorName: "admin",
    assigneeId: "sale-1",
    assigneeName: "Trần Thị Bình",
    createdAt: "2024-03-01",
    careHistory: [
      { id: 1, date: "2024-03-10T14:30", creatorName: "admin", status: "Đang quan tâm", note: "Khách hỏi về sản phẩm, hứa sẽ xem xét tuần tới." },
      { id: 2, date: "2024-03-05T10:00", creatorName: "staff01", status: "Chờ phản hồi", note: "Đã gửi email giới thiệu sản phẩm mới." },
      { id: 3, date: "2024-03-01T09:00", creatorName: "admin", status: "Mới tiếp cận", note: "Khách hàng được phân công từ chiến dịch tháng 3." },
    ],
    demands: [
      { id: 1, date: "2024-03-01T08:00", creatorName: "admin", description: "Cần xem tử vi toàn diện" },
      { id: 2, date: "2024-03-10T14:30", creatorName: "admin", description: "Hỏi về giải pháp phong thủy nhà" },
    ]
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    gender: "Nữ",
    phone: "0987654321",
    dob: "1988-11-20",
    birthTime: "14:00",
    province: "TP.HCM",
    address: "45 Nguyễn Huệ",
    source: "Hotline",
    category: "Xem mệnh lý",
    status: "Mới",
    creatorId: "staff01",
    creatorName: "staff01",
    assigneeId: "sale-2",
    assigneeName: "Lê Văn Cường",
    createdAt: "2024-03-05",
    careHistory: [
      { id: 1, date: "2024-03-06T10:00", creatorName: "staff01", status: "Chờ phản hồi", note: "Chưa nghe máy." },
    ],
    demands: [
      { id: 1, date: "2024-03-05T09:00", creatorName: "staff01", description: "Xem mệnh lý chi tiết" },
    ]
  },
  {
    id: "3",
    name: "Lê Văn Cường",
    gender: "Nam",
    phone: "0978123456",
    dob: "1995-07-08",
    birthTime: "20:15",
    province: "Đà Nẵng",
    address: "78 Trần Phú",
    source: "Form",
    category: "Ngày giờ",
    status: "Đã mua",
    creatorId: "admin",
    creatorName: "admin",
    assigneeId: "admin-1",
    assigneeName: "admin",
    createdAt: "2024-03-08",
    careHistory: [
      { id: 1, date: "2024-03-15T10:00", creatorName: "admin", status: "Đã chốt", note: "Chốt đơn hàng vòng phong thủy." },
    ],
    demands: [
      { id: 1, date: "2024-03-08T10:00", creatorName: "admin", description: "Chọn vòng phong thủy" },
      { id: 2, date: "2024-03-15T14:00", creatorName: "admin", description: "Đặt vòng tạy 24k" },
    ]
  }
];

const getInitialCustomers = () => {
  try {
    const stored = localStorage.getItem("crm_customers");
    let customers = stored ? JSON.parse(stored) : initialCustomers;
    
    // Migration: Ensure all customer IDs are unique
    const seenIds = new Set();
    let needsMigration = false;
    
    customers = customers.map((c, index) => {
      if (seenIds.has(c.id)) {
        // Generate new unique ID if duplicate found
        needsMigration = true;
        let newId = Date.now() + index;
        while (seenIds.has(newId.toString())) {
          newId++;
        }
        c.id = newId.toString();
      }
      seenIds.add(c.id);
      return c;
    });
    
    // Save migrated data back if needed
    if (needsMigration) {
      localStorage.setItem("crm_customers", JSON.stringify(customers));
    }
    
    return customers;
  } catch {
    return initialCustomers;
  }
};

const getMaxCustomerId = (customers) => {
  let maxId = Date.now();
  customers.forEach(c => {
    const numId = parseInt(c.id, 10);
    if (!isNaN(numId) && numId > maxId) {
      maxId = numId;
    }
  });
  return maxId;
};

let customerIdCounter = 0;

const initializeIdCounter = (customers) => {
  customerIdCounter = getMaxCustomerId(customers) + 1;
};

const generateUniqueCustomerId = () => {
  customerIdCounter += 1;
  return customerIdCounter.toString();
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState(getInitialCustomers);
  const { userRole, currentUser } = useAuth();

  useEffect(() => {
    // Initialize ID counter on mount
    if (customerIdCounter === 0) {
      initializeIdCounter(customers);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("crm_customers", JSON.stringify(customers));
    } catch (error) {
      console.error("Lỗi lưu customers vào localStorage:", error);
    }
  }, [customers]);

  const addCustomer = (customerData) => {
    const demands = [];
    if (customerData.demand && customerData.demand.trim()) {
      demands.push({
        id: generateUniqueCustomerId(),
        date: new Date().toISOString(),
        creatorName: currentUser.fullName || currentUser.username,
        description: customerData.demand
      });
    }
    
    const newCustomer = {
      ...customerData,
      id: generateUniqueCustomerId(),
      creatorId: currentUser.uid,
      creatorName: currentUser.fullName || currentUser.username,
      assigneeId: customerData.assigneeId ?? (userRole === "sale" ? currentUser.uid : null),
      assigneeName: customerData.assigneeName || customerData.saleName || (userRole === "sale" ? (currentUser.fullName || currentUser.username) : ""),
      createdAt: new Date().toISOString().split('T')[0],
      source: customerData.source || "",
      category: customerData.category || "",
      saleName: customerData.saleName || "",
      consultStatus: customerData.consultStatus || "",
      consultContent: customerData.consultContent || "",
      careHistory: customerData.careHistory || [],
      demands: demands,
      status: customerData.status || "Mới"
    };
    setCustomers(prevCustomers => [newCustomer, ...prevCustomers]);
  };

  const updateCustomer = (id, updatedData) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const addCareEvent = (customerId, eventData) => {
    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        const newEvent = {
          id: generateUniqueCustomerId(),
          date: new Date().toISOString(),
          creatorName: currentUser.fullName || currentUser.username,
          ...eventData
        };
        return {
          ...c,
          status: eventData.status, // Update customer status based on latest event
          careHistory: [newEvent, ...c.careHistory]
        };
      }
      return c;
    }));
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const deleteCustomers = (ids) => {
    setCustomers(customers.filter(c => !ids.includes(c.id)));
  };

  const addDemand = (customerId, demandText) => {
    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        const newDemand = {
          id: generateUniqueCustomerId(),
          date: new Date().toISOString(),
          creatorName: currentUser.fullName || currentUser.username,
          description: demandText
        };
        return {
          ...c,
          demands: [newDemand, ...(c.demands || [])]
        };
      }
      return c;
    }));
  };

  const value = {
    customers,
    addCustomer,
    updateCustomer,
    addCareEvent,
    deleteCustomer,
    deleteCustomers,
    addDemand
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};
