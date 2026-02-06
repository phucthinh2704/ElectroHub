import {
	DollarSign,
	Loader2,
	Package,
	ShoppingCart,
	TrendingUp,
	Users,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { apiGetAllOrders, apiGetProducts } from "../../apis/product";
import { apiGetAllUsers } from "../../apis/user";
import avatarDefault from "../../assets/avatarDefault.png";
import formatMoney from "../../utils/formatMoney";

const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl">
				<p className="text-sm font-semibold text-slate-900 mb-2">
					{label}
				</p>
				{payload.map((entry, index) => (
					<div
						key={index}
						className="flex items-center gap-2 text-xs">
						<div
							className="w-2 h-2 rounded-full"
							style={{ backgroundColor: entry.color }}
						/>
						<span className="text-slate-500 capitalize">
							{entry.name}:
						</span>
						<span className="font-medium text-slate-900">
							{entry.name === "Revenue" ||
							entry.name === "revenue"
								? formatMoney(entry.value)
								: entry.value.toLocaleString()}
						</span>
					</div>
				))}
			</div>
		);
	}
	return null;
};

const Dashboard = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState({});

	// State cho bộ lọc thời gian
	const [timeRange, setTimeRange] = useState("7"); // Mặc định 7 ngày

	const [chartData, setChartData] = useState({
		revenueByTime: [],
		orderStatus: [],
		topSelling: [],
	});
	const [recentOrders, setRecentOrders] = useState([]);
	const [allOrders, setAllOrders] = useState([]); // Lưu trữ raw orders để filter lại

	// Hàm xử lý dữ liệu doanh thu dựa trên timeRange
	const processRevenueData = (orders, range) => {
		const days = parseInt(range);
		const isMonthlyView = days > 30; // Nếu xem > 30 ngày thì gom nhóm theo tháng
		const map = {};
		const labels = [];

		// 1. Tạo khung dữ liệu (Labels)
		if (isMonthlyView) {
			// Gom theo tháng (VD: Last 6 months)
			const months = Math.ceil(days / 30);
			for (let i = months - 1; i >= 0; i--) {
				const d = moment().subtract(i, "months");
				const key = d.format("MM/YYYY");
				labels.push(key);
				map[key] = 0;
			}
		} else {
			// Gom theo ngày (VD: Last 7 days, 30 days)
			for (let i = days - 1; i >= 0; i--) {
				const d = moment().subtract(i, "days");
				const key = d.format("DD/MM");
				labels.push(key);
				map[key] = 0;
			}
		}

		// 2. Map dữ liệu đơn hàng vào khung
		orders.forEach((order) => {
			if (order.status === "delivered") {
				const orderDate = moment(order.createdAt);

				// Chỉ lấy đơn trong khoảng thời gian đã chọn
				if (orderDate.isAfter(moment().subtract(days, "days"))) {
					const key = isMonthlyView
						? orderDate.format("MM/YYYY")
						: orderDate.format("DD/MM");

					if (map[key] !== undefined) {
						map[key] += order.total;
					}
				}
			}
		});

		// 3. Chuyển đổi thành mảng cho Recharts
		return labels.map((label) => ({
			name: label,
			Revenue: map[label],
		}));
	};

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [responseUsers, responseOrders, responseProducts] =
					await Promise.all([
						apiGetAllUsers(),
						apiGetAllOrders(), // Cần đảm bảo API trả về tất cả đơn hàng (không phân trang hoặc limit lớn)
						apiGetProducts({ limit: 100 }),
					]);

				const users = responseUsers.users || [];
				const orders = responseOrders.orders || [];
				const products = responseProducts.products || [];

				setAllOrders(orders); // Lưu lại để dùng cho filter sau này

				// 1. Stats Cards
				const calculatedStats = {
					totalUsers: users.length,
					totalProducts: products.length,
					totalOrders: orders.length,
					totalRevenue: orders.reduce(
						(sum, order) =>
							order.status === "delivered"
								? sum + order.total
								: sum,
						0,
					),
					activeUsers: users.filter((u) => !u.isBlocked).length,
					inStock: products.filter((p) => p.stock > 0).length,
					completedOrders: orders.filter(
						(o) => o.status === "delivered",
					).length,
				};
				setStats(calculatedStats);

				// 2. Initial Revenue Chart (Default 7 days)
				const revenueData = processRevenueData(orders, "7");

				// 3. Order Status Chart
				const statusCount = orders.reduce((acc, order) => {
					acc[order.status] = (acc[order.status] || 0) + 1;
					return acc;
				}, {});

				const statusData = [
					{
						name: "Processing",
						value: statusCount.processing || 0,
						color: "#F59E0B",
					},
					{
						name: "Shipped",
						value: statusCount.shipped || 0,
						color: "#3B82F6",
					},
					{
						name: "Delivered",
						value: statusCount.delivered || 0,
						color: "#10B981",
					},
					{
						name: "Cancelled",
						value: statusCount.cancelled || 0,
						color: "#EF4444",
					},
				].filter((item) => item.value > 0);

				// 4. Top Selling Products
				const topProducts = [...products]
					.sort((a, b) => b.sold - a.sold)
					.slice(0, 5)
					.map((p) => ({
						name:
							p.title.length > 20
								? p.title.substring(0, 20) + "..."
								: p.title,
						sold: p.sold,
						revenue: p.sold * p.price,
					}));

				setChartData({
					revenueByTime: revenueData,
					orderStatus: statusData,
					topSelling: topProducts,
				});

				setRecentOrders(
					orders
						.sort(
							(a, b) =>
								new Date(b.createdAt) - new Date(a.createdAt),
						)
						.slice(0, 5),
				);
			} catch (error) {
				console.error("Dashboard fetch error:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Effect riêng để xử lý khi đổi bộ lọc thời gian
	useEffect(() => {
		if (allOrders.length > 0) {
			const newData = processRevenueData(allOrders, timeRange);
			setChartData((prev) => ({ ...prev, revenueByTime: newData }));
		}
	}, [timeRange, allOrders]);

	// eslint-disable-next-line no-unused-vars
	const StatCard = ({ title, value, icon: Icon, color, subText }) => (
		<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
			<div className="flex items-center justify-between mb-4">
				<div
					className={`w-12 h-12 rounded-xl flex items-center justify-center`}
					style={{ backgroundColor: `${color}15` }}>
					<Icon
						size={24}
						style={{ color: color }}
					/>
				</div>
				{subText && (
					<span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600 flex items-center gap-1">
						<TrendingUp size={12} />
						{subText}
					</span>
				)}
			</div>
			<div>
				<p className="text-slate-600 text-sm font-medium mb-1">
					{title}
				</p>
				<h3 className="text-2xl font-bold text-slate-800">{value}</h3>
			</div>
		</div>
	);

	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "processing":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "shipped":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "delivered":
				return "bg-green-100 text-green-800 border-green-200";
			case "cancelled":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-slate-100 text-slate-800 border-slate-200";
		}
	};

	return (
		<div className="p-6 bg-slate-100 min-h-screen">
			{isLoading ? (
				<div className="flex items-center justify-center h-screen">
					<Loader2
						size={40}
						className="animate-spin text-main"
					/>
				</div>
			) : (
				<div className="space-y-6">
					{/* Header */}
					<div className="mb-6">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
							<div>
								<h1 className="text-3xl font-bold text-slate-800 mb-2 uppercase">
									Dashboard Overview
								</h1>
								<p className="text-slate-600">
									Welcome back! Here's your business at a
									glance.
								</p>
							</div>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<StatCard
								title="Total Revenue"
								value={formatMoney(stats.totalRevenue) + " đ"}
								icon={DollarSign}
								color="#3B82F6"
								subText="+12.5%"
							/>
							<StatCard
								title="Total Orders"
								value={stats.totalOrders}
								icon={ShoppingCart}
								color="#F59E0B"
								subText={`${stats.completedOrders} completed`}
							/>
							<StatCard
								title="Active Users"
								value={stats.totalUsers}
								icon={Users}
								color="#10B981"
								subText={`${stats.activeUsers} active`}
							/>
							<StatCard
								title="Products In Stock"
								value={stats.totalProducts}
								icon={Package}
								color="#8B5CF6"
								subText={`${stats.inStock} available`}
							/>
						</div>
					</div>

					{/* Charts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main Revenue Chart (Chiếm 2/3) */}
						<div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-bold text-slate-800 uppercase">
									Revenue Analytics
								</h2>
								<select
									className="text-sm px-4 py-2 border border-slate-300 rounded-xl text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white outline-none transition-all"
									value={timeRange}
									onChange={(e) =>
										setTimeRange(e.target.value)
									}>
									<option value="7">Last 7 days</option>
									<option value="30">Last 30 days</option>
									<option value="90">Last 3 months</option>
									<option value="180">Last 6 months</option>
									<option value="365">Last 1 year</option>
								</select>
							</div>
							<div className="h-[350px]">
								<ResponsiveContainer
									width="100%"
									height="100%">
									<AreaChart data={chartData.revenueByTime}>
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
													stopOpacity={0.2}
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
											vertical={false}
											stroke="#E2E8F0"
										/>
										<XAxis
											dataKey="name"
											axisLine={false}
											tickLine={false}
											tick={{
												fill: "#64748B",
												fontSize: 12,
											}}
											dy={10}
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											tick={{
												fill: "#64748B",
												fontSize: 12,
											}}
											tickFormatter={(value) =>
												`${value / 1000000}M`
											}
										/>
										<Tooltip content={<CustomTooltip />} />
										<Area
											type="monotone"
											dataKey="Revenue"
											stroke="#3B82F6"
											strokeWidth={3}
											fill="url(#colorRevenue)"
											activeDot={{ r: 6, strokeWidth: 0 }}
											animationDuration={1000}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</div>

						{/* Order Status (Chiếm 1/3) */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
							<h2 className="text-lg font-bold text-slate-800 mb-6 uppercase">
								Order Status
							</h2>
							<div className="h-[250px] relative">
								<ResponsiveContainer
									width="100%"
									height="100%">
									<PieChart>
										<Pie
											data={chartData.orderStatus}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value">
											{chartData.orderStatus.map(
												(entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
														stroke="none"
													/>
												),
											)}
										</Pie>
										<Tooltip content={<CustomTooltip />} />
										<Legend
											verticalAlign="bottom"
											height={36}
											iconType="circle"
										/>
									</PieChart>
								</ResponsiveContainer>
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center">
									<p className="text-3xl font-bold text-slate-800">
										{stats.totalOrders}
									</p>
									<p className="text-xs text-slate-600">
										Total Orders
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Top Selling Products */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
							<h2 className="text-lg font-bold text-slate-800 mb-6 uppercase">
								Top Selling Products
							</h2>
							<div className="h-[300px]">
								<ResponsiveContainer
									width="100%"
									height="100%">
									<BarChart
										layout="vertical"
										data={chartData.topSelling}
										margin={{
											top: 0,
											right: 30,
											left: 20,
											bottom: 5,
										}}>
										<CartesianGrid
											strokeDasharray="3 3"
											horizontal={false}
											stroke="#E2E8F0"
										/>
										<XAxis
											type="number"
											hide
										/>
										<YAxis
											dataKey="name"
											type="category"
											width={150}
											tick={{
												fill: "#475569",
												fontSize: 13,
											}}
											axisLine={false}
											tickLine={false}
										/>
										<Tooltip
											cursor={{ fill: "transparent" }}
											content={<CustomTooltip />}
										/>
										<Bar
											dataKey="sold"
											fill="#8B5CF6"
											radius={[0, 4, 4, 0]}
											barSize={20}
											name="Units Sold"
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>

						{/* Recent Orders Table */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-hidden">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-bold text-slate-800 uppercase">
									Recent Transactions
								</h2>
								<Link to="/admin/manage-orders">
									<button className="text-blue-600 text-sm font-medium hover:text-blue-700 cursor-pointer">
										View All
									</button>
								</Link>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
											<th className="pb-3 pl-2">
												Customer
											</th>
											<th className="pb-3">Status</th>
											<th className="pb-3 text-right pr-2">
												Amount
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{recentOrders.map((order) => (
											<tr
												key={order._id}
												className="group hover:bg-slate-50 transition-colors">
												<td className="py-3 pl-2">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
															<img
																src={
																	order
																		.orderBy
																		?.avatar ||
																	avatarDefault
																}
																alt="avatar"
																className="w-full h-full object-cover"
															/>
														</div>
														<div>
															<p className="text-sm font-medium text-slate-800">
																{
																	order
																		.orderBy
																		?.name
																}
															</p>
															<p className="text-xs text-slate-500">
																{moment(
																	order.createdAt,
																).fromNow()}
															</p>
														</div>
													</div>
												</td>
												<td className="py-3">
													<span
														className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${getStatusBadgeColor(order.status)}`}>
														{order.status}
													</span>
												</td>
												<td className="py-3 text-right pr-2 text-sm font-semibold text-slate-800">
													{formatMoney(order.total)} đ
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
