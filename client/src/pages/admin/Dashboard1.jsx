import {
   DollarSign,
   Package,
   ShoppingBag,
   ShoppingCart,
   TrendingUp,
   Users
} from "lucide-react";
import React, { useState } from "react";
import {
   Area,
   AreaChart,
   Bar,
   BarChart,
   CartesianGrid,
   Cell,
   Pie,
   PieChart,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis
} from "recharts";

const Dashboard1 = () => {
	// Sample data based on your images
	const [users] = useState([
		{
			_id: "682b4990026e87c710c88489",
			name: "Phuc Thinh",
			email: "thinhb2203636@student.ctu.edu.vn",
			mobile: "0916660387",
			role: "admin",
			isBlocked: false,
			createdAt: "2025-05-19T15:09:04.507+00:00",
		},
		// Add more sample users
		{
			_id: "682b4990026e87c710c88490",
			name: "Nguyen Van A",
			email: "nguyenvana@example.com",
			mobile: "0916660388",
			role: "user",
			isBlocked: false,
			createdAt: "2025-05-18T10:30:00.000+00:00",
		},
		{
			_id: "682b4990026e87c710c88491",
			name: "Tran Thi B",
			email: "tranthib@example.com",
			mobile: "0916660389",
			role: "user",
			isBlocked: true,
			createdAt: "2025-05-17T14:20:00.000+00:00",
		},
	]);

	const [products] = useState([
		{
			_id: "682348a77df1af2f60778917",
			title: "XIAOMI MI 5",
			brand: "XIAOMI",
			price: 5069643,
			originalPrice: 7921317,
			discount: 36,
			stock: 15,
			quantity: 315,
			sold: 68,
			category: "Smartphone",
			ratingCount: 0,
			totalRatings: 0,
			createdAt: "2025-05-13T13:27:03.686+00:00",
		},
		// Add more sample products
		{
			_id: "682348a77df1af2f60778918",
			title: "iPhone 14 Pro",
			brand: "Apple",
			price: 25000000,
			originalPrice: 28000000,
			discount: 10,
			stock: 8,
			quantity: 50,
			sold: 42,
			category: "Smartphone",
			ratingCount: 15,
			totalRatings: 4.5,
			createdAt: "2025-05-12T10:15:00.000+00:00",
		},
		{
			_id: "682348a77df1af2f60778919",
			title: "Samsung Galaxy S23",
			brand: "Samsung",
			price: 18000000,
			originalPrice: 20000000,
			discount: 10,
			stock: 12,
			quantity: 80,
			sold: 68,
			category: "Smartphone",
			ratingCount: 25,
			totalRatings: 4.2,
			createdAt: "2025-05-11T16:45:00.000+00:00",
		},
	]);

	const [orders] = useState([
		{
			_id: "6852d2b3ff1194a22e6ace22",
			orderBy: "682b4990026e87c710c88489",
			products: [
				{
					product: "682348a77df1af2f60778917",
					quantity: 1,
					color: "BLACK",
					price: 2442622,
				},
				{
					product: "682348a77df1af2f60778937",
					quantity: 1,
					color: "BLACK",
					price: 12838766,
				},
			],
			status: "shipped",
			total: 24723893,
			shippingAddress:
				"59/5 Xô Viết Nghệ Tĩnh, Phường An Cư, Quận Ninh Kiều, Thành phố Cần Thơ",
			createdAt: "2025-06-18T14:52:35.208+00:00",
		},
		// Add more sample orders
		{
			_id: "6852d2b3ff1194a22e6ace23",
			orderBy: "682b4990026e87c710c88490",
			products: [
				{
					product: "682348a77df1af2f60778918",
					quantity: 2,
					color: "GOLD",
					price: 25000000,
				},
			],
			status: "delivered",
			total: 50000000,
			shippingAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
			createdAt: "2025-06-17T09:30:00.000+00:00",
		},
		{
			_id: "6852d2b3ff1194a22e6ace24",
			orderBy: "682b4990026e87c710c88491",
			products: [
				{
					product: "682348a77df1af2f60778919",
					quantity: 1,
					color: "WHITE",
					price: 18000000,
				},
			],
			status: "pending",
			total: 18000000,
			shippingAddress: "456 Đường DEF, Phường GHI, Quận 3, TP.HCM",
			createdAt: "2025-06-16T15:20:00.000+00:00",
		},
	]);

	// Calculate statistics
	const totalUsers = users.length;
	const activeUsers = users.filter((user) => !user.isBlocked).length;
	const totalProducts = products.length;
	const totalOrders = orders.length;
	const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
	const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

	// Monthly revenue data
	const monthlyRevenue = [
		{ month: "Jan", revenue: 45000000, orders: 15 },
		{ month: "Feb", revenue: 52000000, orders: 18 },
		{ month: "Mar", revenue: 48000000, orders: 16 },
		{ month: "Apr", revenue: 61000000, orders: 22 },
		{ month: "May", revenue: 55000000, orders: 20 },
		{ month: "Jun", revenue: 67000000, orders: 25 },
	];

	// Order status distribution
	const orderStatusData = [
		{
			name: "Delivered",
			value: orders.filter((o) => o.status === "delivered").length,
			color: "#10B981",
		},
		{
			name: "Shipped",
			value: orders.filter((o) => o.status === "shipped").length,
			color: "#3B82F6",
		},
		{
			name: "Pending",
			value: orders.filter((o) => o.status === "pending").length,
			color: "#F59E0B",
		},
		{
			name: "Cancelled",
			value: orders.filter((o) => o.status === "cancelled").length,
			color: "#EF4444",
		},
	];

	// Top selling products
	const topProducts = products
		.sort((a, b) => b.sold - a.sold)
		.slice(0, 5)
		.map((product) => ({
			name: product.title.substring(0, 20) + "...",
			sold: product.sold,
			revenue: product.sold * product.price,
		}));

	// Recent activities
	const recentActivities = [
		{
			type: "order",
			message: "New order #6852d2b3ff1194a22e6ace22",
			time: "2 hours ago",
		},
		{
			type: "user",
			message: "New user registered: Nguyen Van A",
			time: "4 hours ago",
		},
		{
			type: "product",
			message: 'Product "iPhone 14 Pro" stock updated',
			time: "6 hours ago",
		},
		{
			type: "order",
			message: "Order #6852d2b3ff1194a22e6ace23 delivered",
			time: "8 hours ago",
		},
	];

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const formatNumber = (num) => {
		return new Intl.NumberFormat("vi-VN").format(num);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Admin Dashboard
					</h1>
					<p className="text-gray-600">
						Welcome back! Here's what's happening with your store
						today.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Users
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{formatNumber(totalUsers)}
								</p>
								<p className="text-xs text-green-600 flex items-center mt-1">
									<TrendingUp className="w-3 h-3 mr-1" />
									{activeUsers} active
								</p>
							</div>
							<div className="p-3 bg-blue-100 rounded-full">
								<Users className="w-6 h-6 text-blue-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Products
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{formatNumber(totalProducts)}
								</p>
								<p className="text-xs text-blue-600 flex items-center mt-1">
									<Package className="w-3 h-3 mr-1" />
									{
										products.filter((p) => p.stock > 0)
											.length
									}{" "}
									in stock
								</p>
							</div>
							<div className="p-3 bg-green-100 rounded-full">
								<ShoppingBag className="w-6 h-6 text-green-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Orders
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{formatNumber(totalOrders)}
								</p>
								<p className="text-xs text-orange-600 flex items-center mt-1">
									<ShoppingCart className="w-3 h-3 mr-1" />
									{
										orders.filter(
											(o) => o.status === "pending"
										).length
									}{" "}
									pending
								</p>
							</div>
							<div className="p-3 bg-orange-100 rounded-full">
								<ShoppingCart className="w-6 h-6 text-orange-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Revenue
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{formatCurrency(totalRevenue).slice(0, -2)}đ
								</p>
								<p className="text-xs text-green-600 flex items-center mt-1">
									<TrendingUp className="w-3 h-3 mr-1" />
									Avg:{" "}
									{formatCurrency(averageOrderValue).slice(
										0,
										-2
									)}
									đ
								</p>
							</div>
							<div className="p-3 bg-purple-100 rounded-full">
								<DollarSign className="w-6 h-6 text-purple-600" />
							</div>
						</div>
					</div>
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Monthly Revenue Chart */}
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Monthly Revenue
						</h3>
						<ResponsiveContainer
							width="100%"
							height={300}>
							<AreaChart data={monthlyRevenue}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis
									tickFormatter={(value) =>
										`${(value / 1000000).toFixed(0)}M`
									}
								/>
								<Tooltip
									formatter={(value) => [
										`${formatCurrency(value)}`,
										"Revenue",
									]}
								/>
								<Area
									type="monotone"
									dataKey="revenue"
									stroke="#3B82F6"
									fill="#3B82F6"
									fillOpacity={0.6}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>

					{/* Order Status Distribution */}
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Order Status Distribution
						</h3>
						<ResponsiveContainer
							width="100%"
							height={300}>
							<PieChart>
								<Pie
									data={orderStatusData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value">
									{orderStatusData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={entry.color}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Top Products and Recent Activities */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Top Selling Products */}
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Top Selling Products
						</h3>
						<ResponsiveContainer
							width="100%"
							height={300}>
							<BarChart
								data={topProducts}
								layout="horizontal">
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									type="number"
									tickFormatter={(value) =>
										formatNumber(value)
									}
								/>
								<YAxis
									dataKey="name"
									type="category"
									width={100}
								/>
								<Tooltip
									formatter={(value) => [
										formatNumber(value),
										"Units Sold",
									]}
								/>
								<Bar
									dataKey="sold"
									fill="#10B981"
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>

					{/* Recent Activities */}
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Recent Activities
						</h3>
						<div className="space-y-4">
							{recentActivities.map((activity, index) => (
								<div
									key={index}
									className="flex items-start space-x-3">
									<div
										className={`p-2 rounded-full ${
											activity.type === "order"
												? "bg-blue-100"
												: activity.type === "user"
												? "bg-green-100"
												: "bg-orange-100"
										}`}>
										{activity.type === "order" ? (
											<ShoppingCart className="w-4 h-4 text-blue-600" />
										) : activity.type === "user" ? (
											<Users className="w-4 h-4 text-green-600" />
										) : (
											<Package className="w-4 h-4 text-orange-600" />
										)}
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">
											{activity.message}
										</p>
										<p className="text-xs text-gray-500">
											{activity.time}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Data Tables */}
				<div className="grid grid-cols-1 gap-6">
					{/* Recent Orders Table */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								Recent Orders
							</h3>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Order ID
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Customer
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Products
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Total
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Date
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{orders.map((order) => (
										<tr
											key={order._id}
											className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												#{order._id.slice(-8)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{users.find(
													(u) =>
														u._id === order.orderBy
												)?.name || "Unknown"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{order.products.length} items
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{formatCurrency(order.total)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
														order.status ===
														"delivered"
															? "bg-green-100 text-green-800"
															: order.status ===
															  "shipped"
															? "bg-blue-100 text-blue-800"
															: order.status ===
															  "pending"
															? "bg-yellow-100 text-yellow-800"
															: "bg-red-100 text-red-800"
													}`}>
													{order.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(
													order.createdAt
												).toLocaleDateString("vi-VN")}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Recent Users Table */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								Recent Users
							</h3>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Name
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Email
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Mobile
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Role
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Join Date
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{users.map((user) => (
										<tr
											key={user._id}
											className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{user.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{user.email}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{user.mobile}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
														user.role === "admin"
															? "bg-purple-100 text-purple-800"
															: "bg-gray-100 text-gray-800"
													}`}>
													{user.role}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
														!user.isBlocked
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}>
													{!user.isBlocked
														? "Active"
														: "Blocked"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(
													user.createdAt
												).toLocaleDateString("vi-VN")}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard1;
