import {
   DollarSign,
   Package, ShoppingCart,
   TrendingDown,
   TrendingUp,
   Users
} from 'lucide-react';
import React, { useState } from 'react';
import {
   Area,
   AreaChart,
   Bar,
   CartesianGrid,
   Cell,
   Legend,
   Line,
   LineChart,
   Pie,
   PieChart,
   ResponsiveContainer,
   Tooltip,
   XAxis, YAxis
} from 'recharts';

const Dashboard2 = () => {
  // Mock data - thay thế bằng data thực từ API
  const [dashboardData, setDashboardData] = useState({
    users: [
      {
        _id: '682b4990026e87c710c88489',
        name: 'Phuc Thinh',
        email: 'thinhb2203636@student.ctu.edu.vn',
        mobile: '0916660387',
        role: 'admin',
        isBlocked: false,
        createdAt: '2025-05-19T15:09:04.507+00:00'
      },
      // More users...
    ],
    products: [
      {
        _id: '682348a77df1af2f60778917',
        title: 'XIAOMI MI 5',
        brand: 'XIAOMI',
        category: 'Smartphone',
        price: 5069643,
        originalPrice: 7921317,
        discount: 36,
        stock: 15,
        sold: 68,
        ratingCount: 0,
        thumb: 'https://digital-world-2.myshopify.com/cdn/shop/products/z4_1024x1024.jpg',
        createdAt: '2025-05-13T13:27:03.686+00:00'
      },
      // More products...
    ],
    orders: [
      {
        _id: '6852d2b3ff1194a22e6ace22',
        orderBy: '682b4990026e87c710c88489',
        status: 'shipped',
        total: 24723893,
        shippingAddress: '59/5 Xô Viết Nghệ Tĩnh, Phường An Cư, Quận Ninh Kiều, Thành phố Cần Thơ',
        products: [
          {
            product: '682348a77df1af2f60778977',
            quantity: 3,
            color: 'BLACK',
            price: 2442622
          }
        ],
        createdAt: '2025-06-18T14:52:35.208+00:00'
      },
      // More orders...
    ]
  });

  // Tính toán thống kê
  const stats = {
    totalUsers: dashboardData.users.length,
    totalProducts: dashboardData.products.length,
    totalOrders: dashboardData.orders.length,
    totalRevenue: dashboardData.orders.reduce((sum, order) => sum + order.total, 0),
    activeUsers: dashboardData.users.filter(user => !user.isBlocked).length,
    inStock: dashboardData.products.filter(product => product.stock > 0).length,
    completedOrders: dashboardData.orders.filter(order => order.status === 'shipped').length
  };

  // Dữ liệu cho biểu đồ doanh thu theo tháng (mock)
  const monthlyRevenue = [
    { month: 'Jan', revenue: 15000000, orders: 45 },
    { month: 'Feb', revenue: 18000000, orders: 52 },
    { month: 'Mar', revenue: 22000000, orders: 68 },
    { month: 'Apr', revenue: 19000000, orders: 58 },
    { month: 'May', revenue: 25000000, orders: 75 },
    { month: 'Jun', revenue: 28000000, orders: 82 }
  ];

  // Dữ liệu cho biểu đồ category
  const categoryData = [
    { name: 'Smartphone', value: 35, color: '#8884d8' },
    { name: 'Laptop', value: 25, color: '#82ca9d' },
    { name: 'Tablet', value: 20, color: '#ffc658' },
    { name: 'Accessories', value: 20, color: '#ff7300' }
  ];

  // Dữ liệu top sản phẩm bán chạy
  const topProducts = dashboardData.products
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)
    .map(product => ({
      name: product.title.substring(0, 20) + '...',
      sold: product.sold,
      revenue: product.sold * product.price
    }));

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {title.includes('Revenue') ? 
              new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) :
              value.toLocaleString()
            }
          </p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1">{change}% from last month</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  const RecentOrdersTable = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dashboardData.orders.slice(0, 5).map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order._id.slice(-8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const TopProductsTable = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
      <div className="space-y-4">
        {dashboardData.products.slice(0, 5).map((product) => (
          <div key={product._id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <img 
                src={product.thumb} 
                alt={product.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {product.title}
              </p>
              <p className="text-sm text-gray-500">
                {product.brand} • {product.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Sold: {product.sold}
              </p>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="#3B82F6"
            change={12}
            changeType="up"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="#10B981"
            change={8}
            changeType="up"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="#F59E0B"
            change={15}
            changeType="up"
          />
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            icon={DollarSign}
            color="#EF4444"
            change={23}
            changeType="up"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  formatter={(value) => [
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
                    'Revenue'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders vs Products Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders & Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" tickFormatter={(value) => `${value / 1000000}M`} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) :
                    value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="revenue" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrdersTable />
          <TopProductsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;