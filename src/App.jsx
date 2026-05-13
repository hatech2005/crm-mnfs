import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CustomerProvider } from "./context/CustomerContext";
import { EmployeeProvider } from "./context/EmployeeContext";
import { RBACProvider } from "./context/RBACContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { ReceiptProvider } from "./context/ReceiptContext";
import { PaymentProvider } from "./context/PaymentContext";
import { SettingsProvider } from "./context/SettingsContext";
import DashboardLayout from "./components/layout/DashboardLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerCare from "./pages/CustomerCare";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import OrderNew from "./pages/OrderNew";
import OrderDetail from "./pages/OrderDetail";
import Receipts from "./pages/Receipts";
import ReceiptDetail from "./pages/ReceiptDetail";
import Payments from "./pages/Payments";
import PaymentDetail from "./pages/PaymentDetail";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeNew from "./pages/EmployeeNew";
import Roles from "./pages/Roles";
import RoleDetail from "./pages/RoleDetail";
import RoleNew from "./pages/RoleNew";
import Permissions from "./pages/Permissions";
import PermissionDetail from "./pages/PermissionDetail";
import PermissionNew from "./pages/PermissionNew";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CustomerProvider>
          <EmployeeProvider>
            <RBACProvider>
              <ProductProvider>
                <OrderProvider>
                  <ReceiptProvider>
                    <PaymentProvider>
                      <Router>
                        <Toaster position="top-right" />
                        <Routes>
                          <Route path="/login" element={<Login />} />
                          <Route path="/" element={<DashboardLayout />}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="customers" element={<Customers />} />
                            <Route path="customers/:id" element={<CustomerDetail />} />
                            <Route path="customer-care" element={<CustomerCare />} />
                            <Route path="products" element={<Products />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="orders/new" element={<OrderNew />} />
                            <Route path="orders/:id" element={<OrderDetail />} />
                            <Route path="receipts" element={<Receipts />} />
                            <Route path="receipts/:id" element={<ReceiptDetail />} />
                            <Route path="payments" element={<Payments />} />
                            <Route path="payments/:id" element={<PaymentDetail />} />
                            <Route path="employees" element={<Employees />} />
                            <Route path="employees/new" element={<EmployeeNew />} />
                            <Route path="employees/:id" element={<EmployeeDetail />} />
                            <Route path="roles" element={<Roles />} />
                            <Route path="roles/new" element={<RoleNew />} />
                            <Route path="roles/:id" element={<RoleDetail />} />
                            <Route path="permissions" element={<Permissions />} />
                            <Route path="permissions/new" element={<PermissionNew />} />
                            <Route path="permissions/:id" element={<PermissionDetail />} />
                            <Route path="settings" element={<Settings />} />
                          </Route>
                        </Routes>
                      </Router>
                    </PaymentProvider>
                  </ReceiptProvider>
                </OrderProvider>
              </ProductProvider>
            </RBACProvider>
          </EmployeeProvider>
        </CustomerProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
