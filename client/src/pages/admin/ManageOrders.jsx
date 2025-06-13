import React, { useEffect, useState } from "react";
import {
	Package,
	ShoppingCart,
	Truck,
	CheckCircle,
	XCircle,
	Clock,
	Search,
	Eye,
	Edit,
	Trash2,
	DollarSign,
	Calendar,
	MapPin,
	User,
	Phone,
	Filter,
} from "lucide-react";
import moment from "moment";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ManageOrders = () => {
	const [orders, setOrders] = useState([
		{
			_id: "684c36b0701ccbeea0ceef72",
			orderBy: {
				_id: "682b4990026e87c710c88489",
				name: "John Doe",
				email: "john@example.com",
				mobile: "0123456789",
			},
			products: [
				{
					product: {
						_id: "682348a77df1af2f60778937",
						title: "iPhone 15 Pro Max",
						thumb: "https://digital-world-2.myshopify.com/cdn/shop/products/z1_877559ca-73.jpg",
					},
					quantity: 1,
					color: "BLACK",
					price: 12838766,
				},
				{
					product: {
						_id: "682348a77df1af2f60778938",
						title: "AirPods Pro",
						thumb: "https://digital-world-2.myshopify.com/cdn/shop/products/airpods-pro.jpg",
					},
					quantity: 2,
					color: "WHITE",
					price: 5490000,
				},
			],
			total: 25031439,
			status: "delivered",
			shippingAddress:
				"KDC 148, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh",
			createdAt: "2025-06-13T14:33:20.943+00:00",
			updatedAt: "2025-06-13T14:33:20.943+00:00",
		},
		{
			_id: "684c36b0701ccbeea0ceef73",
			orderBy: {
				_id: "682b4990026e87c710c88490",
				name: "Jane Smith",
				email: "jane@example.com",
				mobile: "0987654321",
			},
			products: [
				{
					product: {
						_id: "682348a77df1af2f60778939",
						title: "MacBook Pro M3",
						thumb: "https://digital-world-2.myshopify.com/cdn/shop/products/macbook-pro.jpg",
					},
					quantity: 1,
					color: "SILVER",
					price: 45000000,
				},
			],
			total: 45000000,
			status: "processing",
			shippingAddress:
				"123 Nguyen Hue Street, District 1, Ho Chi Minh City",
			createdAt: "2025-06-12T10:20:15.943+00:00",
			updatedAt: "2025-06-12T10:20:15.943+00:00",
		},
		{
			_id: "684c36b0701ccbeea0ceef74",
			orderBy: {
				_id: "682b4990026e87c710c88491",
				name: "Mike Johnson",
				email: "mike@example.com",
				mobile: "0369852147",
			},
			products: [
				{
					product: {
						_id: "682348a77df1af2f60778940",
						title: "Samsung Galaxy S24",
						thumb: "https://digital-world-2.myshopify.com/cdn/shop/products/samsung-s24.jpg",
					},
					quantity: 1,
					color: "BLUE",
					price: 18990000,
				},
			],
			total: 18990000,
			status: "pending",
			shippingAddress: "456 Le Loi Street, District 3, Ho Chi Minh City",
			createdAt: "2025-06-11T08:15:30.943+00:00",
			updatedAt: "2025-06-11T08:15:30.943+00:00",
		},
	]);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage] = useState(5);

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
		setCurrentPage(1);
	};

	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
			case "pending":
				return <Clock className="w-3 h-3" />;
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

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const handleDeleteOrder = (orderId) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.isConfirmed) {
				setOrders(orders.filter((order) => order._id !== orderId));
				toast.success("Order deleted successfully");
			}
		});
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
	const pendingOrders = orders.filter((o) => o.status === "pending").length;
	const processingOrders = orders.filter(
		(o) => o.status === "processing"
	).length;
	const deliveredOrders = orders.filter(
		(o) => o.status === "delivered"
	).length;
	const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

	return (
		<div className="p-4 bg-slate-100 min-h-screen text-slate-900">
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
									Pending
								</p>
								<p className="text-2xl font-bold text-yellow-600">
									{pendingOrders}
								</p>
							</div>
							<div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
								<Clock className="w-6 h-6 text-yellow-600" />
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
									{formatCurrency(totalRevenue)}
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
								<th className="py-4 px-6 text-left font-semibold text-slate-700">
									#
								</th>
								<th className="py-4 px-6 text-left font-semibold text-slate-700">
									Order ID
								</th>
								<th className="py-4 px-6 text-left font-semibold text-slate-700">
									Customer
								</th>
								<th className="py-4 px-6 text-left font-semibold text-slate-700">
									Products
								</th>
								<th className="py-4 px-6 text-center font-semibold text-slate-700">
									Status
								</th>
								<th className="py-4 px-6 text-right font-semibold text-slate-700">
									Total
								</th>
								<th className="py-4 px-6 text-center font-semibold text-slate-700">
									Date
								</th>
								<th className="py-4 px-6 text-center font-semibold text-slate-700">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{currentOrders.map((order, index) => (
								<tr
									key={order._id}
									className="hover:bg-slate-50 transition-colors duration-150">
									<td className="py-4 px-6 text-slate-600 font-semibold">
										{indexOfFirstOrder + index + 1}
									</td>

									{/* Order ID */}
									<td className="py-4 px-6">
										<div className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
											#{order._id.slice(-8).toUpperCase()}
										</div>
									</td>

									{/* Customer Info */}
									<td className="py-4 px-6">
										<div className="flex items-start gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
												{order.orderBy.name
													.charAt(0)
													.toUpperCase()}
											</div>
											<div className="min-w-0">
												<p className="font-medium text-slate-800 truncate">
													{order.orderBy.name}
												</p>
												<p className="text-sm text-slate-500 truncate">
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
									<td className="py-4 px-6">
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
															onError={(e) => {
																e.target.src =
																	"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiA4QzEyLjY4NjMgOCAxMCAxMC42ODYzIDEwIDE0QzEwIDE3LjMxMzcgMTIuNjg2MyAyMCAxNiAyMEMxOS4zMTM3IDIwIDIyIDE3LjMxMzcgMjIgMTRDMjIgMTAuNjg2MyAxOS4zMTM3IDggMTYgOFpNMTYgMThDMTMuNzkwOSAxOCAxMiAxNi4yMDkxIDEyIDE0QzEyIDExLjc5MDkgMTMuNzkwOSAxMCAxNiAxMEMxOC4yMDkxIDEwIDIwIDExLjc5MDkgMjAgMTRDMjAgMTYuMjA5MSAxOC4yMDkxIDE4IDE2IDE4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
															}}
														/>
														<div className="min-w-0 flex-1">
															<p className="text-sm font-medium text-slate-800 truncate">
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
									<td className="py-4 px-6 text-center">
										<span
											className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border uppercase ${getStatusBadgeColor(
												order.status
											)}`}>
											{getStatusIcon(order.status)}
											{order.status}
										</span>
									</td>

									{/* Total */}
									<td className="py-4 px-6 text-right">
										<p className="font-semibold text-slate-800">
											{formatCurrency(order.total)}
										</p>
									</td>

									{/* Date */}
									<td className="py-4 px-6 text-center">
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
									<td className="py-4 px-6">
										<div className="flex items-center justify-center gap-1">
											<button
												className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
												title="View Order">
												<Eye className="w-4 h-4" />
											</button>
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
											<button
												onClick={() =>
													handleDeleteOrder(order._id)
												}
												className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
												title="Delete Order">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination Info */}
				<div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
					<div className="text-sm text-slate-600">
						Showing {indexOfFirstOrder + 1} to{" "}
						{Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
						{filteredOrders.length} orders
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() =>
								setCurrentPage((prev) => Math.max(prev - 1, 1))
							}
							disabled={currentPage === 1}
							className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
							Previous
						</button>

						{[
							...Array(
								Math.ceil(filteredOrders.length / ordersPerPage)
							),
						].map((_, i) => (
							<button
								key={i + 1}
								onClick={() => setCurrentPage(i + 1)}
								className={`px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
									currentPage === i + 1
										? "bg-blue-600 text-white"
										: "text-slate-600 hover:bg-slate-200"
								}`}>
								{i + 1}
							</button>
						))}

						<button
							onClick={() =>
								setCurrentPage((prev) =>
									Math.min(
										prev + 1,
										Math.ceil(
											filteredOrders.length /
												ordersPerPage
										)
									)
								)
							}
							disabled={
								currentPage ===
								Math.ceil(filteredOrders.length / ordersPerPage)
							}
							className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
							Next
						</button>
					</div>
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
