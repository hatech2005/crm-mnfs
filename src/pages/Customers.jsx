import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCustomerContext } from "../context/CustomerContext";
import { useEmployeeContext } from "../context/EmployeeContext";
import { Search, Plus, Upload, Filter } from "lucide-react";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSettingsContext } from "../context/SettingsContext";
import * as XLSX from "xlsx";

const PROVINCES = [
  "An Giang", "Bà Rịa-Vũng Tàu", "Bạc Liêu", "Bắc Kạn", "Bắc Giang", "Bắc Ninh", "Bến Tre", "Bình Dương", 
  "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", 
  "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", 
  "Hà Tây", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hòa Bình", "Hồ Chí Minh", "Hậu Giang", "Hưng Yên", 
  "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lào Cai", "Lạng Sơn", "Lâm Đồng", "Long An", 
  "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", 
  "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", 
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];


export default function Customers() {
  const { userRole, currentUser } = useAuth();
  const { customers, addCustomer, deleteCustomer, deleteCustomers } = useCustomerContext();
  const { employees } = useEmployeeContext();
  const { sources, categories } = useSettingsContext();
  const navigate = useNavigate();

  const salesEmployees = employees.filter(emp => emp.roles.includes("SALES"));

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "", phone: "", dob: "", birthTime: "", province: "", address: "", gender: "Nam", source: "", category: "", demand: "", assigneeId: "", assigneeName: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Vui lòng nhập tên và số điện thoại");
      return;
    }
    
    // Kiểm tra trùng lặp số điện thoại
    const isDuplicate = customers.some(c => c.phone === formData.phone);
    if (isDuplicate) {
      toast.error("Khách hàng đã tồn tại (Trùng số điện thoại)!");
      return;
    }

    addCustomer({
      ...formData,
      assigneeId: formData.assigneeId || (userRole === "sale" ? currentUser.uid : null),
      assigneeName: formData.assigneeName || (userRole === "sale" ? (currentUser.fullName || currentUser.username) : "")
    });
    toast.success("Đã thêm khách hàng thành công!");
    setIsModalOpen(false);
    setFormData({ name: "", phone: "", dob: "", birthTime: "", province: "", address: "", gender: "Nam", source: "", category: "", demand: "", assigneeId: "", assigneeName: "" });
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setStatusFilter("");
  };

  const statusOptions = ["", ...Array.from(new Set(customers.map(c => {
    // Display only care status or customer status
    if (c.careHistory && c.careHistory.length > 0) {
      return c.careHistory[0].status;
    }
    return c.status;
  }).filter(Boolean))).sort()];

  const handleExportCustomers = () => {
    if (filteredCustomers.length === 0) {
      toast.error("Không có khách hàng để xuất file.");
      return;
    }

    const exportData = filteredCustomers.map((customer) => ({
      name: customer.name,
      phone: customer.phone,
      gender: customer.gender,
      dob: customer.dob,
      province: customer.province,
      address: customer.address,
      source: customer.source,
      category: customer.category,
      status: customer.status,
      creator: customer.creatorName,
      assignee: customer.assigneeName || customer.saleName || "",
      createdAt: customer.createdAt,
      latestDemand: customer.demands?.[0]?.description || "",
      demandDate: customer.demands?.[0]?.date || ""
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Khách hàng");
    XLSX.writeFile(wb, `khach_hang_export_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success(`Đã xuất ${filteredCustomers.length} khách hàng.`);
  };

  const filteredCustomers = customers.filter(c => {
    const fullName = (c.name || "").toLowerCase();
    const matchSearch = fullName.includes(searchTerm.toLowerCase()) || (c.phone && c.phone.includes(searchTerm));
    
    let matchDate = true;
    if (fromDate && c.createdAt < fromDate) matchDate = false;
    if (toDate && c.createdAt > toDate) matchDate = false;

    // Calculate display status - only care status or customer status
    const hasCarHistory = c.careHistory && c.careHistory.length > 0;
    
    let displayStatus = c.status;
    if (hasCarHistory) {
      displayStatus = c.careHistory[0].status;
    }

    const matchStatus = !statusFilter || displayStatus === statusFilter;
    const matchRole = userRole === "sale" ? c.assigneeId === currentUser.uid : true;
    
    return matchSearch && matchDate && matchStatus && matchRole;
  }).sort((a, b) => {
    // Sort by creation date - newer first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleSelectCustomer = (id) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomerIds.length === filteredCustomers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(filteredCustomers.map(c => c.id));
    }
  };

  const handleDeleteCustomer = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa khách hàng này?");
    if (!confirmDelete) return;
    deleteCustomer(id);
    setSelectedCustomerIds(prev => prev.filter(item => item !== id));
    toast.success("Đã xóa khách hàng.");
  };

  const handleDeleteSelected = () => {
    if (selectedCustomerIds.length === 0) return;
    const confirmDelete = window.confirm(`Bạn có chắc muốn xóa ${selectedCustomerIds.length} khách hàng đã chọn?`);
    if (!confirmDelete) return;
    deleteCustomers(selectedCustomerIds);
    setSelectedCustomerIds([]);
    toast.success(`Đã xóa ${selectedCustomerIds.length} khách hàng.`);
  };

  const handleImportExcel = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Đọc data từ Excel - hàng 1 là header
        const allRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        
        if (allRows.length === 0) {
          toast.error('File Excel không chứa dữ liệu!');
          return;
        }

        // Map dữ liệu từ Excel
        const duplicates = [];
        const imported = [];
        const errors = [];

        allRows.forEach((row, index) => {
          // Map các cột theo tên tiếng Anh
          const phone = String(row.mobile || '').trim();
          const name = String(row.name || '').trim();
          const city = String(row.city || '').trim();
          const source = String(row.source || '').trim();
          const demand = String(row.demand || '').trim();
          const category = String(row.category || '').trim();
          const sale = String(row.sale || '').trim();
          const status = String(row.status || '').trim();
          const note = String(row.note || '').trim();
          const matchingSale = employees.find(emp => emp.fullName === sale && emp.roles.includes("SALES"));

          // Kiểm tra bắt buộc
          if (!phone || !name) {
            errors.push(`Hàng ${index + 2}: Thiếu mobile hoặc name`);
            return;
          }

          // Kiểm tra trùng số điện thoại
          const isDuplicate =
            customers.some((c) => c.phone === phone) ||
            imported.some((c) => c.phone === phone);

          if (isDuplicate) {
            duplicates.push({
              source,
              mobile: phone,
              name,
              city,
              demand,
              category,
              sale,
              status,
              note,
              'ghi-chu': 'Trùng số điện thoại',
            });
          } else {
            const careEvent = status || note ? [{
              id: `${Date.now()}_${Math.random()}`,
              date: new Date().toISOString(),
              creatorName: currentUser.fullName || currentUser.username,
              status,
              note
            }] : [];

            const customerData = {
              name,
              phone,
              address: city,
              source,
              demand,
              category,
              saleName: sale,
              assigneeId: matchingSale?.id || null,
              assigneeName: matchingSale?.fullName || sale || "",
              consultStatus: status,
              consultContent: note,
              careHistory: careEvent,
              status: status || "Mới",
              dob: '',
              birthTime: '',
              province: '',
              gender: 'Nam',
            };
            imported.push(customerData);
            addCustomer(customerData);
          }
        });

        // Xử lý lỗi
        if (errors.length > 0) {
          errors.slice(0, 3).forEach(err => toast.error(err));
          if (errors.length > 3) {
            toast.error(`... và ${errors.length - 3} lỗi khác`);
          }
        }

        // Xuất file khách hàng bị trùng
        if (duplicates.length > 0) {
          const ws = XLSX.utils.json_to_sheet(duplicates);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Khách hàng trùng');
          XLSX.writeFile(wb, `khach_hang_trung_${new Date().getTime()}.xlsx`);
        }

        // Thông báo kết quả
        if (imported.length > 0) {
          let message = `Đã import ${imported.length} khách hàng thành công!`;
          if (duplicates.length > 0) {
            message += ` ${duplicates.length} khách hàng bị trùng số điện thoại đã được xuất ra file.`;
          }
          toast.success(message);
        } else if (duplicates.length > 0) {
          toast.warning(`Tất cả ${duplicates.length} khách hàng bị trùng số điện thoại, không có khách hàng được import.`);
        } else {
          toast.error('Không có khách hàng nào được import!');
        }

        setIsImportModalOpen(false);
        e.target.value = '';
      } catch (error) {
        console.error('Lỗi khi import Excel:', error);
        toast.error('Lỗi khi import Excel. Vui lòng kiểm tra định dạng file!');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>Danh sách khách hàng</h1>
        </div>
        
        <div className="flex gap-2" style={{ flexWrap: "wrap", alignItems: "center" }}>
          {userRole === "admin" && (
            <button className="btn btn-outline" onClick={() => setIsImportModalOpen(true)}>
              <Upload size={16} /> Import File
            </button>
          )}
          {selectedCustomerIds.length > 0 && (
            <button className="btn btn-danger" onClick={handleDeleteSelected}>
              Xóa đã chọn ({selectedCustomerIds.length})
            </button>
          )}
          <button className="btn btn-dark" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Tạo mới
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: "1.5rem 1rem", marginBottom: "1rem" }}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>Từ khoá</span>
            <input
              type="text"
              placeholder="Tên, số điện thoại, địa chỉ..."
              className="input"
              style={{ width: "250px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>Ngày tạo</span>
            <input
              type="date"
              className="input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span style={{ color: "var(--color-text-secondary)" }}>→</span>
            <input
              type="date"
              className="input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>Trạng thái</span>
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: "160px" }}
            >
              <option value="">Tất cả</option>
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>{statusOption}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-outline" onClick={handleClearFilter} style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
            Xoá lọc
          </button>
          <button className="btn btn-outline" onClick={handleExportCustomers} style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
            Xuất file
          </button>
          <button className="btn btn-dark" style={{ fontSize: "0.875rem", padding: "0.5rem 1.5rem" }}>
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: "0" }}>
        <div className="table-container">
          <table className="table" style={{ fontSize: "0.875rem" }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: "1.5rem", width: "48px" }}>
                  <input
                    type="checkbox"
                    checked={selectedCustomerIds.length > 0 && selectedCustomerIds.length === filteredCustomers.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Họ và tên</th>
                <th>Giới tính</th>
                <th>Số điện thoại</th>
                <th>Sinh nhật</th>
                <th>Địa chỉ</th>
                <th>Chăm sóc</th>
                <th>Trạng thái</th>
                <th>Người tạo</th>
                <th>Phụ trách</th>
                <th>Ngày tạo</th>
                <th>Chăm sóc cuối</th>
                <th style={{ width: "100px" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan="12" style={{ textAlign: "center", padding: "3rem" }}>Không tìm thấy bản ghi nào.</td></tr>
              ) : (
                filteredCustomers.map(customer => {
                  const formatDateDDMMYYYY = (dateStr) => {
                    if (!dateStr) return '-';
                    const parts = dateStr.split('-');
                    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                    return dateStr;
                  };

                  const fullName = customer.name;
                  const totalCares = customer.careHistory?.length || 0;
                  const latestCareStatus = customer.careHistory?.[0]?.status || "Chưa chăm sóc";
                  const latestCareDate = customer.careHistory?.[0]?.date ? new Date(customer.careHistory[0].date).toLocaleDateString('vi-VN') : '-';
                  const fullAddress = [customer.address, customer.province].filter(Boolean).join(", ");
                  const hasCarHistory = customer.careHistory && customer.careHistory.length > 0;
                  
                  // Display status: care status if exists, otherwise customer status
                  let displayStatus = customer.status;
                  let isStatusAlert = customer.status === "Mới";
                  if (hasCarHistory) {
                    displayStatus = latestCareStatus;
                    isStatusAlert = latestCareStatus === "Từ Chối" || latestCareStatus === "Add Zalo" || latestCareStatus === "KNM, bán, GLS" || latestCareStatus === "Suy Nghĩ" || latestCareStatus === "K add Zalo đc";
                  }
                  
                  return (
                    <tr key={customer.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/customers/${customer.id}`)}>
                      <td style={{ paddingLeft: "1.5rem" }}>
                        <input
                          type="checkbox"
                          checked={selectedCustomerIds.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td style={{ paddingLeft: "1.5rem", fontWeight: 500, color: "var(--color-secondary)" }}>
                        {fullName}
                      </td>
                      <td>{customer.gender}</td>
                      <td>{customer.phone}</td>
                      <td>{formatDateDDMMYYYY(customer.dob)}</td>
                      <td>{fullAddress || '-'}</td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>Tổng: {totalCares}</span>
                          <span style={{ 
                            fontSize: "0.75rem", 
                            fontWeight: 500,
                            color: latestCareStatus === 'Đã chốt' ? 'var(--color-success)' : 
                                   latestCareStatus === 'Đang quan tâm' ? 'var(--color-warning)' : 
                                   'var(--color-text-secondary)'
                          }}>
                            {latestCareStatus}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: isStatusAlert ? '#FEE2E2' : '#F1F5F9', color: isStatusAlert ? '#B91C1C' : '#475569', fontWeight: 400 }}>
                          {displayStatus}
                        </span>
                      </td>
                      <td>{customer.creatorName}</td>
                      <td>{customer.assigneeName || customer.saleName || '-'}</td>
                      <td style={{ color: "var(--color-text-secondary)" }}>{formatDateDDMMYYYY(customer.createdAt)}</td>
                      <td style={{ color: "var(--color-text-secondary)" }}>{latestCareDate}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                          onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(customer.id); }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Tổng: {filteredCustomers.length} bản ghi</span>
          <div className="flex gap-1">
            <button className="btn btn-dark" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>1</button>
            <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>2</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm khách hàng mới">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Họ và tên *</label>
            <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Số điện thoại *</label>
              <input type="text" className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Giới tính</label>
              <div className="flex gap-4" style={{ marginTop: "0.5rem" }}>
                <label className="flex items-center gap-2"><input type="radio" name="gender" value="Nam" checked={formData.gender === "Nam"} onChange={e => setFormData({...formData, gender: e.target.value})}/> Nam</label>
                <label className="flex items-center gap-2"><input type="radio" name="gender" value="Nữ" checked={formData.gender === "Nữ"} onChange={e => setFormData({...formData, gender: e.target.value})}/> Nữ</label>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Ngày sinh</label>
              <input type="date" className="input" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Giờ sinh</label>
              <input type="time" className="input" value={formData.birthTime} onChange={e => setFormData({...formData, birthTime: e.target.value})} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Tỉnh/Thành phố</label>
            <input type="text" className="input" list="provinces-list" placeholder="Chọn hoặc gõ tên tỉnh..." value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />
            <datalist id="provinces-list">
              {PROVINCES.map(p => <option key={p} value={p} />)}
            </datalist>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Nguồn khách hàng</label>
              <select className="input" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                <option value="">-- Chọn nguồn --</option>
                {sources.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Hạng mục (Dịch vụ)</label>
              <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">-- Chọn hạng mục --</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Người phụ trách</label>
            <select
              className="input"
              value={formData.assigneeId}
              onChange={e => {
                const selected = salesEmployees.find(emp => emp.id === e.target.value);
                setFormData({
                  ...formData,
                  assigneeId: selected?.id || "",
                  assigneeName: selected?.fullName || ""
                });
              }}
              disabled={userRole === "sale"}
            >
              <option value="">-- Chọn người phụ trách --</option>
              {salesEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Địa chỉ</label>
            <input type="text" className="input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 500 }}>Nhu cầu của khách hàng</label>
            <textarea className="input" style={{ resize: "vertical", minHeight: "80px" }} placeholder="Nhập nhu cầu của khách hàng..." value={formData.demand} onChange={e => setFormData({...formData, demand: e.target.value})} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn btn-dark">Lưu khách hàng</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import khách hàng từ Excel">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "1.5rem", backgroundColor: "#F0F9FF", borderRadius: "8px", border: "1px dashed #0284C7" }}>
            <p style={{ fontSize: "0.875rem", color: "#0c4a6e", marginBottom: "0.75rem", fontWeight: 500 }}>
              📋 Định dạng file Excel yêu cầu (9 cột):
            </p>
            <ul style={{ fontSize: "0.8rem", color: "#0c4a6e", lineHeight: "1.8", marginLeft: "1rem" }}>
              <li><strong>Cột A: source</strong> (Nguồn khách hàng)</li>
              <li><strong>Cột B: mobile</strong> (Số điện thoại) *</li>
              <li><strong>Cột C: name</strong> (Tên khách hàng) *</li>
              <li><strong>Cột D: city</strong> (Thành phố/Địa chỉ)</li>
              <li><strong>Cột E: demand</strong> (Nhu cầu)</li>
              <li><strong>Cột F: category</strong> (Hạng mục dịch vụ)</li>
              <li><strong>Cột G: sale</strong> (Tên sale phụ trách)</li>
              <li><strong>Cột H: status</strong> (Trạng thái tư vấn)</li>
              <li><strong>Cột I: note</strong> (Nội dung tư vấn)</li>
              <li style={{ fontStyle: "italic", marginTop: "0.5rem", color: "#dc2626" }}>* Bắt buộc phải có</li>
            </ul>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 500 }}>Chọn file Excel</label>
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv"
              onChange={handleImportExcel}
              style={{
                display: "block",
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                backgroundColor: "var(--color-bg-secondary)",
                cursor: "pointer",
                fontSize: "0.875rem"
              }}
            />
          </div>

          <div style={{ padding: "0.75rem", backgroundColor: "#FEF3C7", borderRadius: "6px", border: "1px solid #FCD34D" }}>
            <p style={{ fontSize: "0.8rem", color: "#92400E", margin: "0" }}>
              ⚠️ Khách hàng bị trùng số điện thoại sẽ được xuất ra file Excel riêng và không được import.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsImportModalOpen(false)}>Đóng</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
