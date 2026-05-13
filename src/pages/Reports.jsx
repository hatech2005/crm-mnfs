import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrderContext } from "../context/OrderContext";
import { useCustomerContext } from "../context/CustomerContext";
import { Users, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DATE_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const rangeOptions = [
  { id: "today", label: "Hôm nay" },
  { id: "yesterday", label: "Hôm qua" },
  { id: "last7days", label: "7 ngày" }
];

const getDateKey = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
};

const isSameDate = (dateA, dateB) => getDateKey(dateA) === getDateKey(dateB);

export default function Reports() {
  const { userRole } = useAuth();
  const { orders } = useOrderContext();
  const { customers } = useCustomerContext();
  const [animate, setAnimate] = useState(false);
  const [timeRange, setTimeRange] = useState("today");

  useEffect(() => {
    setAnimate(true);
  }, []);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const getOrdersForRange = () => {
    if (timeRange === "today") {
      return orders.filter(order => isSameDate(order.createdAt, today));
    }
    if (timeRange === "yesterday") {
      return orders.filter(order => isSameDate(order.createdAt, yesterday));
    }
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return getDateKey(orderDate) >= getDateKey(sevenDaysAgo) && getDateKey(orderDate) <= getDateKey(today);
    });
  };

  const ordersInRange = getOrdersForRange();
  const revenue = ordersInRange.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  const newCustomers = customers.filter(customer => {
    const createdAt = new Date(customer.createdAt);
    if (timeRange === "today") return isSameDate(createdAt, today);
    if (timeRange === "yesterday") return isSameDate(createdAt, yesterday);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    return getDateKey(createdAt) >= getDateKey(sevenDaysAgo) && getDateKey(createdAt) <= getDateKey(today);
  });
  const closedOrders = ordersInRange.filter(order => order.status === "Hoàn thành");
  const closeRate = ordersInRange.length > 0 ? Math.round((closedOrders.length / ordersInRange.length) * 100) : 0;
  const todayAppointments = orders.filter(order => isSameDate(order.createdAt, today)).length;

  const statCards = [

    {
      title: "Doanh thu",
      value: `${revenue.toLocaleString('vi-VN')}đ`,
      icon: DollarSign,
      color: "var(--color-success)",
      bg: "#D1FAE5",
      trend: timeRange === "today"
        ? "Doanh thu trong ngày"
        : timeRange === "yesterday"
        ? "Doanh thu ngày hôm qua"
        : "Doanh thu 7 ngày gần nhất"
    },
    {
      title: "Khách hàng mới",
      value: `${newCustomers.length}`,
      icon: Users,
      color: "var(--color-secondary)",
      bg: "#DBEAFE",
      trend: timeRange === "today"
        ? "Khách hàng mới hôm nay"
        : timeRange === "yesterday"
        ? "Khách hàng mới hôm qua"
        : "Khách hàng mới trong 7 ngày"
    },
    {
      title: "Tỷ lệ chốt Sale",
      value: `${closeRate}%`,
      icon: TrendingUp,
      color: "var(--color-warning)",
      bg: "#FEF3C7",
      trend: ordersInRange.length > 0
        ? `${closedOrders.length}/${ordersInRange.length} đơn đã hoàn thành`
        : "Chưa có đơn hàng"
    },
  ];

  if (userRole === "admin") {
    statCards.push({
      title: "Lịch hẹn hôm nay",
      value: `${todayAppointments}`,
      icon: Calendar,
      color: "var(--color-primary)",
      bg: "#E2E8F0",
      trend: "Số đơn tạo hôm nay"
    });
  }

  const last7DaysData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const dateKey = getDateKey(date);
    const dayRevenue = orders
      .filter(order => order.createdAt === dateKey)
      .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
    return {
      name: DATE_LABELS[date.getDay()],
      revenue: dayRevenue
    };
  });

  return (
    <div style={{ opacity: animate ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)" }}>
          Báo cáo Tổng quan
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Cập nhật kết quả kinh doanh và hiệu suất chăm sóc khách hàng.
        </p>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {rangeOptions.map(option => (
          <button
            key={option.id}
            onClick={() => setTimeRange(option.id)}
            className={`btn ${timeRange === option.id ? 'btn-dark' : 'btn-outline'}`}
            style={{ minWidth: "120px" }}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card" style={{ 
              display: "flex", 
              flexDirection: "column",
              borderTop: `4px solid ${stat.color}`
            }}>
              <div className="flex justify-between items-start" style={{ marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>{stat.title}</h3>
                  <p style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "0.25rem", color: "var(--color-text-primary)" }}>{stat.value}</p>
                </div>
                <div style={{ 
                  backgroundColor: stat.bg, 
                  color: stat.color, 
                  padding: "0.75rem", 
                  borderRadius: "50%" 
                }}>
                  <Icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: "auto" }}>
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem" }}>Biểu đồ doanh thu 7 ngày gần nhất</h3>
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748B'}}
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <Tooltip 
                cursor={{fill: '#F1F5F9'}} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
              />
              <Bar dataKey="revenue" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
