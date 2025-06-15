import {
	CheckCircle,
	Clock,
	DollarSign,
	Eye,
	Package,
	Phone,
	Search,
	ShoppingCart,
	Truck,
	Mail,
	XCircle,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGetAllOrders } from "../../apis";
import { OrderDetailModal, Pagination } from "../../components";
import avatarDefault from "../../assets/avatarDefault.png";
import formatMoney from "../../utils/formatMoney";
import getPaginationInfo from "../../utils/getPaginationInfo";

const ManageOrders = () => {
	const [orders, setOrders] = useState([]);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage] = useState(3);

	const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState({});

	const navigate = useNavigate();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await apiGetAllOrders();
				if (response.success) {
					setOrders(response.orders);
				}
			} catch (error) {
				console.log("Failed to fetch orders:", error);
				toast.error("Failed to fetch orders. Please try again later.");
			}
		};
		fetchOrders();
		const params = new URLSearchParams(window.location.search);
		const page = params.get("page") || 1;
		setCurrentPage(Number(page));
	}, []);

	// Filter orders
	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.orderBy.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			order.orderBy.email
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.products.some((p) =>
				p.product.title.toLowerCase().includes(searchTerm.toLowerCase())
			);

		const matchesStatus =
			filterStatus === "all" || order.status === filterStatus;

		return matchesSearch && matchesStatus;
	});

	// Pagination
	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = filteredOrders.slice(
		indexOfFirstOrder,
		indexOfLastOrder
	);

	const handleFilterChange = (field, value) => {
		if (field === "search") {
			setSearchTerm(value);
		} else if (field === "status") {
			setFilterStatus(value);
		}
		const params = new URLSearchParams(window.location.search);
		params.set("page", 1);
		setCurrentPage(1);
		navigate({
			pathname: window.location.pathname,
			search: params.toString(),
		});
	};

	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "processing":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "shipped":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "delivered":
				return "bg-green-100 text-green-800 border-green-200";
			case "cancelled":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "processing":
				return <Package className="w-3 h-3" />;
			case "shipped":
				return <Truck className="w-3 h-3" />;
			case "delivered":
				return <CheckCircle className="w-3 h-3" />;
			case "cancelled":
				return <XCircle className="w-3 h-3" />;
			default:
				return <Clock className="w-3 h-3" />;
		}
	};

	const handleUpdateStatus = (orderId, newStatus) => {
		setOrders(
			orders.map((order) =>
				order._id === orderId
					? {
							...order,
							status: newStatus,
							updatedAt: new Date().toISOString(),
					  }
					: order
			)
		);
		toast.success(`Order status updated to ${newStatus}`);
	};

	// Calculate stats
	const totalOrders = orders.length;
	const shippedOrders = orders.filter((o) => o.status === "shipped").length;
	const processingOrders = orders.filter(
		(o) => o.status === "processing"
	).length;
	const deliveredOrders = orders.filter(
		(o) => o.status === "delivered"
	).length;
	const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

	const { startItem, endItem } = getPaginationInfo(
		currentPage,
		ordersPerPage,
		filteredOrders.length
	);

	return (
		<div className="p-6 bg-slate-100 min-h-screen text-slate-900">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold text-slate-800 mb-2 uppercase">
							Manage Orders
						</h1>
						<p className="text-slate-600">
							Track and manage all customer orders
						</p>
					</div>
					<button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
						<Package className="w-5 h-5" />
						Export Orders
					</button>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Total Orders
								</p>
								<p className="text-2xl font-bold text-slate-800">
									{totalOrders}
								</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<ShoppingCart className="w-6 h-6 text-blue-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Processing
								</p>
								<p className="text-2xl font-bold text-blue-600">
									{processingOrders}
								</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<Package className="w-6 h-6 text-blue-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Shipped
								</p>
								<p className="text-2xl font-bold text-purple-600">
									{shippedOrders}
								</p>
							</div>
							<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
								<Truck className="w-6 h-6 text-purple-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Delivered
								</p>
								<p className="text-2xl font-bold text-green-600">
									{deliveredOrders}
								</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
								<CheckCircle className="w-6 h-6 text-green-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Revenue
								</p>
								<p className="text-lg font-bold text-purple-600">
									{formatMoney(totalRevenue)} đ
								</p>
							</div>
							<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
								<DollarSign className="w-6 h-6 text-purple-600" />
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Search className="w-5 h-5 text-slate-400" />
								</div>
								<input
									type="text"
									placeholder="Search by order ID, customer name, email, or product..."
									value={searchTerm}
									onChange={(e) =>
										handleFilterChange(
											"search",
											e.target.value
										)
									}
									className="w-full pl-10 pr-4 py-3 outline-none border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								/>
							</div>
						</div>

						{/* Status Filter */}
						<select
							value={filterStatus}
							onChange={(e) =>
								handleFilterChange("status", e.target.value)
							}
							className="px-4 py-3 outline-none border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white cursor-pointer">
							<option value="all">All Status</option>
							<option value="processing">Processing</option>
							<option value="shipped">Shipped</option>
							<option value="delivered">Delivered</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>
				</div>
			</div>

			{/* Orders Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-slate-50 border-b border-slate-200">
							<tr>
								<th className="p-4 text-center font-semibold text-slate-700">
									#
								</th>
								<th className="p-4 text-center font-semibold text-slate-700">
									Order ID
								</th>
								<th className="p-4 text-center font-semibold text-slate-700">
									Customer
								</th>
								<th className="p-4 text-center font-semibold text-slate-700">
									Products
								</th>
								<th className="p-4 text-center font-semibold text-slate-700">
									Status
								</th>
								<th className="p-4 text-center font-semibold text-slate-700">
									Total
								</th>
								<th className="p-4 text-center font-semibold text-slate-700">
									Date
								</th>
								<th className="p-4 text-center font-semibold text-slate-700">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{currentOrders.map((order, index) => (
								<tr
									key={order._id}
									className="hover:bg-slate-50 transition-colors duration-150">
									<td className="p-4 text-slate-600 font-semibold text-center">
										{indexOfFirstOrder + index + 1}
									</td>

									{/* Order ID */}
									<td className="p-4 max-w-[150px]">
										<div className="text-sm font-mono line-clamp-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
											#{order._id}
										</div>
									</td>

									{/* Customer Info */}
									<td className="p-4">
										<div className="flex items-center gap-2">
											<div className="w-10 h-10 rounded-full flex items-center justify-center">
												<img
													src={
														order.orderBy.avatar ||
														avatarDefault
													}
													alt="avatar"
												/>
											</div>
											<div className="min-w-0">
												<p className="font-medium text-slate-800 truncate">
													{order.orderBy.name}
												</p>
												<p className="text-sm text-slate-500 truncate flex items-center gap-1">
													<Mail className="w-3 h-3" />
													{order.orderBy.email}
												</p>
												<p className="text-sm text-slate-500 flex items-center gap-1">
													<Phone className="w-3 h-3" />
													{order.orderBy.mobile}
												</p>
											</div>
										</div>
									</td>

									{/* Products */}
									<td className="p-4">
										<div className="flex flex-col gap-2 max-w-xs">
											{order.products
												.slice(0, 2)
												.map((item, idx) => (
													<div
														key={idx}
														className="flex items-center gap-2">
														<img
															src={
																item.product
																	.thumb
															}
															alt={
																item.product
																	.title
															}
															className="w-8 h-8 object-cover rounded"
														/>
														<div className="min-w-0 flex-1">
															<p className="text-sm font-medium text-slate-800 truncate line-clamp-1">
																{
																	item.product
																		.title
																}
															</p>
															<p className="text-xs text-slate-500">
																{item.color} ×{" "}
																{item.quantity}
															</p>
														</div>
													</div>
												))}
											{order.products.length > 2 && (
												<p className="text-xs text-slate-500">
													+{order.products.length - 2}{" "}
													more items
												</p>
											)}
										</div>
									</td>

									{/* Status */}
									<td className="p-4 text-center">
										<span
											className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border uppercase ${getStatusBadgeColor(
												order.status
											)}`}>
											{getStatusIcon(order.status)}
											{order.status}
										</span>
									</td>

									{/* Total */}
									<td className="p-4 text-center">
										<p className="font-semibold text-slate-800">
											{formatMoney(order.total)} đ
										</p>
									</td>

									{/* Date */}
									<td className="p-4 text-center">
										<div className="text-sm">
											<p className="text-slate-800">
												{moment(order.createdAt).format(
													"DD/MM/YYYY"
												)}
											</p>
											<p className="text-slate-500">
												{moment(order.createdAt).format(
													"HH:mm"
												)}
											</p>
										</div>
									</td>

									{/* Actions */}
									<td className="p-4">
										<div className="flex items-center justify-center gap-1">
											<button
												className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 cursor-pointer"
												title="View Order"
												onClick={() => {
													setShowOrderDetailModal(
														true
													);
													setSelectedOrder(order);
												}}>
												<Eye className="w-4 h-4" />
											</button>
											{showOrderDetailModal && (
												<OrderDetailModal
													order={selectedOrder}
													onClose={() =>
														setShowOrderDetailModal(
															false
														)
													}
												/>
											)}
											<select
												value={order.status}
												onChange={(e) =>
													handleUpdateStatus(
														order._id,
														e.target.value
													)
												}
												className="text-xs px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
												<option value="processing">
													Processing
												</option>
												<option value="shipped">
													Shipped
												</option>
												<option value="delivered">
													Delivered
												</option>
												<option value="cancelled">
													Cancelled
												</option>
											</select>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="flex items-center justify-between px-10 py-5 bg-slate-100">
					<div>
						{orders.length > 0 && (
							<div className="text-sm text-gray-500">
								Showing {filteredOrders.length} order
								{filteredOrders.length !== 1 ? "s" : ""}
							</div>
						)}
						<div className="text-sm text-slate-600">
							Show orders {startItem} - {endItem} of{" "}
							{filteredOrders.length}
						</div>
					</div>
					<Pagination
						currentPage={currentPage}
						pageSize={ordersPerPage}
						onPageChange={setCurrentPage}
						totalCount={filteredOrders.length}
						siblingCount={1}
					/>
				</div>
			</div>

			{/* Empty State */}
			{filteredOrders.length === 0 && (
				<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
					<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<ShoppingCart className="w-8 h-8 text-slate-400" />
					</div>
					<h3 className="text-lg font-semibold text-slate-800 mb-2">
						No orders found
					</h3>
					<p className="text-slate-600">
						Try adjusting your search or filter criteria
					</p>
				</div>
			)}
		</div>
	);
};

export default ManageOrders;
