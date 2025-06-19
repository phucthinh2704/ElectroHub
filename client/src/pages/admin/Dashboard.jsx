import {
	Bell,
	DollarSign,
	Download,
	Filter,
	Loader2,
	Package,
	Search,
	ShoppingCart,
	Users,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { apiGetAllOrders, apiGetProducts } from "../../apis/product";
import { apiGetAllUsers } from "../../apis/user";
import formatMoney from "../../utils/formatMoney";
import getRandomRGBColor from "../../utils/getRandomRGBColor";

const Dashboard = () => {
	const [isLoading, setIsLoading] = useState(true);

	const [dashboardData, setDashboardData] = useState({
		users: [],
		products: [],
		orders: [],
	});
	const { categories } = useSelector((state) => state.app);
	const [categoriesData, setCategoriesData] = useState([]);
	const [revenue, setRevenue] = useState([]);

	useEffect(() => {
		const fetchRevenueData = async () => {
			const response = await apiGetProducts();
			const revenueData = response.products.map((product) => ({
				name: product.title,
				revenue: product.price * product.sold,
				orders: product.sold,
				users: product.ratingCount,
			}));
			setRevenue(revenueData);
		};
		fetchRevenueData();
	}, []);

	useEffect(() => {
		const fetchProductByCategory = async () => {
			setIsLoading(true);
			const categoryData = await Promise.all(
				categories.map(async (category) => {
					const response = await apiGetProducts({
						category: category.title,
					});
					return {
						name: category.title,
						value: response.products.length,
						color: getRandomRGBColor(),
					};
				})
			);
			setCategoriesData(categoryData);
			setIsLoading(false);
		};
		fetchProductByCategory();
	}, [categories]);

	useEffect(() => {
		const fetchData = async () => {
			const [responseUsers, responseOrders, responseProducts] =
				await Promise.all([
					apiGetAllUsers(),
					apiGetAllOrders(),
					apiGetProducts(),
				]);
			setDashboardData({
				users: responseUsers.users,
				products: responseProducts.products,
				orders: responseOrders.orders,
			});
		};

		fetchData();
	}, []);

	// Tính toán thống kê
	const stats = {
		totalUsers: dashboardData.users.length,
		totalProducts: dashboardData.products.length,
		totalOrders: dashboardData.orders.length,
		totalRevenue: dashboardData.orders.reduce(
			(sum, order) => sum + order.total,
			0
		),
		activeUsers: dashboardData.users.filter((user) => !user.isBlocked)
			.length,
		inStock: dashboardData.products.filter((product) => product.stock > 0)
			.length,
		completedOrders: dashboardData.orders.filter(
			(order) => order.status === "delivered"
		).length,
	};

	const orderStatusData = [
		{
			name: "Processing",
			value: dashboardData.orders.filter((o) => o.status === "processing")
				.length,
			color: "#F59E0B",
		},
		{
			name: "Shipped",
			value: dashboardData.orders.filter((o) => o.status === "shipped")
				.length,
			color: "#3B82F6",
		},
		{
			name: "Delivered",
			value: dashboardData.orders.filter((o) => o.status === "delivered")
				.length,
			color: "#10B981",
		},
		{
			name: "Cancelled",
			value: dashboardData.orders.filter((o) => o.status === "cancelled")
				.length,
			color: "#EF4444",
		},
	];

	// Mock data
	// const revenueData = [
	// 	{ name: "Jan", revenue: 4000, orders: 240, users: 120 },
	// 	{ name: "Feb", revenue: 3000, orders: 198, users: 110 },
	// 	{ name: "Mar", revenue: 2000, orders: 180, users: 150 },
	// 	{ name: "Apr", revenue: 2780, orders: 220, users: 140 },
	// 	{ name: "May", revenue: 1890, orders: 160, users: 160 },
	// 	{ name: "Jun", revenue: 2390, orders: 190, users: 180 },
	// 	{ name: "Jul", revenue: 3490, orders: 280, users: 200 },
	// ];

	const topProducts = [
		{
			id: 1,
			name: "iPhone 15 Pro",
			sales: 1234,
			revenue: 1234000,
			trend: 12.5,
		},
		{
			id: 2,
			name: "MacBook Air M2",
			sales: 892,
			revenue: 1072800,
			trend: -3.2,
		},
		{ id: 3, name: "iPad Pro", sales: 567, revenue: 453600, trend: 8.1 },
		{
			id: 4,
			name: "AirPods Pro",
			sales: 445,
			revenue: 111250,
			trend: 15.3,
		},
		{
			id: 5,
			name: "Apple Watch",
			sales: 378,
			revenue: 151200,
			trend: -1.8,
		},
	];

	const recentOrders = dashboardData.orders
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	// eslint-disable-next-line no-unused-vars
	const StatCard = ({ title, value, icon: Icon, color, change }) => (
		<div
			className="bg-white rounded-lg shadow-md p-6 border-l-4"
			style={{ borderLeftColor: color }}>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-2xl font-bold text-gray-900">
						{title.includes("Revenue")
							? new Intl.NumberFormat("vi-VN", {
									style: "currency",
									currency: "VND",
							  }).format(value)
							: value.toLocaleString()}
					</p>
					{change && (
						<div
							className={`flex items-center mt-2 text-sm ${
								title.includes("Users")
									? "text-blue-600"
									: title.includes("Products")
									? "text-green-600"
									: title.includes("Orders")
									? "text-yellow-600"
									: "text-red-600"
							}`}>
							{title.includes("Users") ? (
								<Users size={17} />
							) : title.includes("Products") ? (
								<Package size={17} />
							) : title.includes("Orders") ? (
								<ShoppingCart size={17} />
							) : (
								<DollarSign size={17} />
							)}
							<span className="ml-1">
								{change}{" "}
								{title.includes("Users")
									? "active"
									: title.includes("Products")
									? "in stock"
									: title.includes("Orders")
									? "completed orders"
									: ""}
							</span>
						</div>
					)}
				</div>
				<div
					className="p-3 rounded-full"
					style={{ backgroundColor: color + "20" }}>
					<Icon
						size={24}
						style={{ color }}
					/>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-slate-100 text-slate-800">
			{isLoading ? (
				<div className="flex items-center justify-center h-screen">
					<Loader2
						size={40}
						className="animate-spin text-main"
					/>
				</div>
			) : (
				<>
					{/* Header */}
					<div className="bg-white border-b border-gray-200 px-6 py-4">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									Admin Dashboard
								</h1>
								<p className="text-gray-600 mt-2">
									Welcome back! Here's what's happening with
									your store today.
								</p>
							</div>
							<div className="flex items-center space-x-4">
								<div className="relative">
									<Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
									<input
										type="text"
										placeholder="Search..."
										className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
								<button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
									<Bell className="w-6 h-6" />
								</button>
								<button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
									<Download className="w-4 h-4 mr-2" />
									Export
								</button>
							</div>
						</div>
					</div>

					<div className="p-6">
						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							<StatCard
								title="Total Users"
								value={stats.totalUsers}
								icon={Users}
								color="#3B82F6"
								change={stats.activeUsers}
							/>
							<StatCard
								title="Total Products"
								value={stats.totalProducts}
								icon={Package}
								color="#10B981"
								change={stats.inStock}
							/>
							<StatCard
								title="Total Orders"
								value={stats.totalOrders}
								icon={ShoppingCart}
								color="#F59E0B"
								change={stats.completedOrders}
							/>
							<StatCard
								title="Total Revenue"
								value={stats.totalRevenue}
								icon={DollarSign}
								color="#EF4444"
								change={formatMoney(stats.totalRevenue / 25000)}
							/>
						</div>

						{/* Charts Section */}
						<div className="grid grid-cols-1 gap-6 mb-8">
							{/* Revenue Chart */}
							<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-lg font-semibold text-gray-900">
										Revenue Overview
									</h2>
									<div className="flex items-center space-x-2">
										<Filter className="w-4 h-4 text-gray-400" />
										<select className="text-sm border-none focus:outline-none text-gray-600">
											<option>Monthly</option>
											<option>Weekly</option>
											<option>Daily</option>
										</select>
									</div>
								</div>
								<ResponsiveContainer
									width="100%"
									height={350}>
									<AreaChart data={revenue}>
										<defs>
											<linearGradient
												id="colorRevenue"
												x1="0"
												y1="0"
												x2="0"
												y2="1">
												<stop
													offset="5%"
													stopColor="#3B82F6"
													stopOpacity={0.3}
												/>
												<stop
													offset="95%"
													stopColor="#3B82F6"
													stopOpacity={0}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="#f0f0f0"
										/>
										<XAxis
											dataKey="name"
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											tickFormatter={(value) =>
												new Intl.NumberFormat("vi-VN", {
													notation: "compact",
												}).format(value)
											}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor: "white",
												border: "none",
												borderRadius: "12px",
												boxShadow:
													"0 10px 25px rgba(0,0,0,0.1)",
											}}
											formatter={(value) => [
												new Intl.NumberFormat("vi-VN", {
													style: "currency",
													currency: "VND",
												}).format(value),
												"Revenue",
											]}
										/>
										<Area
											type="monotone"
											dataKey="revenue"
											stroke="#3B82F6"
											strokeWidth={3}
											fillOpacity={1}
											fill="url(#colorRevenue)"
											animationDuration={1000}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</div>

						{/* Bottom Section */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Category Distribution */}
							{/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
						<h2 className="text-lg font-semibold text-gray-900 mb-6">
							Sales by Category
						</h2>
						<ResponsiveContainer
							width="100%"
							height={280}>
							<PieChart>
								<Pie
									data={categoryData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={100}
									paddingAngle={2}
									dataKey="value">
									{categoryData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={entry.color}
										/>
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: "white",
										border: "none",
										borderRadius: "12px",
										boxShadow:
											"0 10px 25px rgba(0,0,0,0.1)",
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="mt-4 space-y-2">
							{categoryData.map((item, index) => (
								<div
									key={index}
									className="flex items-center justify-between text-sm">
									<div className="flex items-center">
										<div
											className={`w-3 h-3 rounded-full mr-2`}
											style={{
												backgroundColor: item.color,
											}}></div>
										<span className="text-gray-600">
											{item.name}
										</span>
									</div>
									<span className="font-semibold">
										${item.value.toLocaleString()}
									</span>
								</div>
							))}
						</div>
					</div> */}

							{/* Order Status Distribution */}
							<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex">
									<ShoppingCart className="w-5 h-5 mr-2" />
									Order Status Distribution
								</h3>
								{/* <ResponsiveContainer
									width="100%"
									height={300}>
									<PieChart>
										<Pie
											data={orderStatusData}
											cx="50%"
											cy="50%"
											labelLine={false}
											label={({ name, percent }) =>
												`${name} ${(
													percent * 100
												).toFixed(0)}%`
											}
											outerRadius={80}
											fill="#8884d8"
											dataKey="value">
											{orderStatusData.map(
												(entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
													/>
												)
											)}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer> */}
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
												`${name} ${(
													percent * 100
												).toFixed(0)}%`
											}
											outerRadius={80}
											fill="#8884d8"
											dataKey="value">
											{orderStatusData.map(
												(entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
													/>
												)
											)}
										</Pie>
										<Tooltip
											formatter={(value) => [
												`${value} orders`,
												"Count",
											]}
										/>
									</PieChart>
								</ResponsiveContainer>

								<div className="mt-4 space-y-2">
									{orderStatusData.map((item, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
											<div className="flex items-center">
												<div
													className="w-3 h-3 rounded-full mr-3"
													style={{
														backgroundColor:
															item.color,
													}}></div>
												<div className="flex items-center">
													<span className="ml-2 text-gray-600">
														{item.name}
													</span>
												</div>
											</div>
											<div className="text-right">
												<span className="font-semibold">
													{item.value}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Category Distribution */}
							<div className="bg-white rounded-lg shadow-md p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Product Categories
								</h3>
								<ResponsiveContainer
									width="100%"
									height={300}>
									<PieChart>
										<Pie
											data={categoriesData}
											cx="50%"
											cy="50%"
											outerRadius={80}
											fill="#8884d8"
											dataKey="value"
											label={({ name, percent }) =>
												`${name} ${(
													percent * 100
												).toFixed(0)}%`
											}>
											{categoriesData.map(
												(entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
													/>
												)
											)}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
								<div className="mt-4 space-y-2">
									{categoriesData.map((item, index) => (
										<div
											key={index}
											className="flex items-center justify-between text-sm">
											<div className="flex items-center">
												<div
													className={`w-3 h-3 rounded-full mr-2`}
													style={{
														backgroundColor:
															item.color,
													}}></div>
												<span className="text-gray-600">
													{item.name}
												</span>
											</div>
											<span className="font-semibold">
												{item.value.toLocaleString()}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Top Products */}
							{/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-semibold text-gray-900">
								Top Products
							</h2>
							<button className="text-blue-600 text-sm hover:text-blue-700">
								View All
							</button>
						</div>
						<div className="space-y-4">
							{topProducts.map((product, index) => (
								<div
									key={product.id}
									className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
									<div className="flex items-center">
										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
											{index + 1}
										</div>
										<div>
											<p className="font-medium text-gray-900 text-sm">
												{product.name}
											</p>
											<p className="text-gray-500 text-xs">
												{product.sales} sales
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-semibold text-gray-900 text-sm">
											${product.revenue.toLocaleString()}
										</p>
										<div
											className={`flex items-center text-xs ${
												product.trend > 0
													? "text-green-600"
													: "text-red-600"
											}`}>
											{product.trend > 0 ? (
												<ArrowUpRight className="w-3 h-3 mr-1" />
											) : (
												<ArrowDownRight className="w-3 h-3 mr-1" />
											)}
											{Math.abs(product.trend)}%
										</div>
									</div>
								</div>
							))}
						</div>
					</div> */}
						</div>

						<div className="grid grid-cols-1 gap-6 mt-6">
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
											{recentOrders.map((order) => (
												<tr
													key={order._id}
													className="hover:bg-gray-50">
													<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
														#{order._id.slice(-8)}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
														{order.orderBy.name}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
														{order.products.length}{" "}
														items
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
														{formatMoney(
															order.total
														)}
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
																	  "processing"
																	? "bg-yellow-100 text-yellow-800"
																	: "bg-red-100 text-red-800"
															}`}>
															{order.status[0].toUpperCase() +
																order.status.slice(
																	1
																)}
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
														{moment(
															order.createdAt
														).format("DD/MM/YYYY")}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Dashboard;
