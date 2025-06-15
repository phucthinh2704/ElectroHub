import {
	Calendar,
	CheckCircle,
	Clock,
	Copy,
	CreditCard,
	Hash,
	Mail,
	MapPin,
	Package,
	Phone,
	ShoppingBag,
	Truck,
	User,
	X,
	XCircle,
} from "lucide-react";
import moment from "moment";
import React, { memo } from "react";
import { toast } from "react-toastify";
import avatarDefault from "../../../assets/avatarDefault.png";
import formatMoney from "../../../utils/formatMoney";

const OrderDetailModal = ({ onClose, order }) => {
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
				return <Package className="w-5 h-5" />;
			case "shipped":
				return <Truck className="w-5 h-5" />;
			case "delivered":
				return <CheckCircle className="w-5 h-5" />;
			case "cancelled":
				return <XCircle className="w-5 h-5" />;
			default:
				return <Clock className="w-5 h-5" />;
		}
	};

	const copyOrderId = () => {
		navigator.clipboard.writeText(order._id);
		toast.success("Order ID copied to clipboard!");
	};

	const calculateSubtotal = () => {
		return order.products.reduce((sum, item) => {
			return sum + item.price * item.quantity;
		}, 0);
	};

	const subtotal = calculateSubtotal();
	const shipping =
		subtotal > 2000000 ? 0 : import.meta.env.VITE_SHIPPING_COST; // Example shipping cost

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto min-h-screen">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/30 bg-opacity-50 transition-opacity"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="flex min-h-full items-center justify-center p-4">
				<div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
					{/* Header */}
					<div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-xl font-bold text-white">
									Order Details
								</h2>
								<p className="text-blue-100 text-sm">
									Complete order information
								</p>
							</div>
							<button
								onClick={onClose}
								className="p-2 hover:bg-white/30 rounded-lg transition-colors duration-200 cursor-pointer">
								<X className="w-5 h-5 text-white" />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className="max-h-[calc(90vh-80px)] overflow-y-auto">
						<div className="p-4 space-y-4">
							{/* Order Summary */}
							<div className="bg-slate-50 rounded-xl p-4">
								<div className="flex items-center justify-around gap-4">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-blue-100 rounded-lg">
											<Hash className="w-5 h-5 text-blue-600" />
										</div>
										<div>
											<p className="text-sm text-slate-600">
												Order ID
											</p>
											<div className="flex items-center gap-2">
												<p className="font-mono text-sm font-semibold">
													#{order._id}
												</p>
												<button
													onClick={copyOrderId}
													className="p-1 hover:bg-slate-200 rounded cursor-pointer"
													title="Copy Order ID">
													<Copy className="w-3 h-3 text-slate-500" />
												</button>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="p-2 bg-green-100 rounded-lg">
											<Calendar className="w-5 h-5 text-green-600" />
										</div>
										<div>
											<p className="text-sm text-slate-600">
												Order Date
											</p>
											<p className="font-semibold">
												{moment(order.createdAt).format(
													"DD/MM/YYYY HH:mm"
												)}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div
											className={`p-2 rounded-lg ${
												order.status === "delivered"
													? "bg-green-100"
													: order.status ===
													  "cancelled"
													? "bg-red-100"
													: "bg-blue-100"
											}`}>
											{getStatusIcon(order.status)}
										</div>
										<div>
											<p className="text-sm text-slate-600">
												Status
											</p>
											<span
												className={`inline-flex items-center gap-1 px-3  rounded-full text-xs font-medium border uppercase ${getStatusBadgeColor(
													order.status
												)}`}>
												{getStatusIcon(order.status)}
												{order.status}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Customer & Shipping Info */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Customer Information */}
								<div className="bg-white border border-slate-200 rounded-xl p-5">
									<div className="flex items-center gap-2 mb-4">
										<User className="w-5 h-5 text-blue-600" />
										<h3 className="font-semibold text-slate-800">
											Customer Information
										</h3>
									</div>

									<div className="flex items-start gap-4">
										<img
											src={
												order.orderBy.avatar ||
												avatarDefault
											}
											alt="Customer Avatar"
											className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
										/>
										<div className="flex-1 space-y-2">
											<h4 className="font-semibold text-slate-800 text-lg">
												{order.orderBy.name}
											</h4>
											<div className="flex items-center gap-2 text-slate-600">
												<Mail className="w-4 h-4" />
												<span className="text-sm">
													{order.orderBy.email}
												</span>
											</div>
											<div className="flex items-center gap-2 text-slate-600">
												<Phone className="w-4 h-4" />
												<span className="text-sm">
													{order.orderBy.mobile}
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Shipping Address */}
								<div className="bg-white border border-slate-200 rounded-xl p-5">
									<div className="flex items-center gap-2 mb-4">
										<MapPin className="w-5 h-5 text-green-600" />
										<h3 className="font-semibold text-slate-800">
											Shipping Address
										</h3>
									</div>

									<div className="space-y-2 text-slate-600">
										<p className="font-medium text-slate-800">
											{order.orderBy.name}
										</p>
										<p className="text-sm">
											{order.shippingAddress}
										</p>
										<p className="text-sm">
											Phone: {order.orderBy.mobile}
										</p>
									</div>
								</div>
							</div>

							{/* Order Items */}
							<div className="bg-white border border-slate-200 rounded-xl p-5">
								<div className="flex items-center gap-2 mb-4">
									<ShoppingBag className="w-5 h-5 text-purple-600" />
									<h3 className="font-semibold text-slate-800">
										Order Items
									</h3>
									<span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
										{order.products.length} item
										{order.products.length > 1 ? "s" : ""}
									</span>
								</div>

								<div className="space-y-4">
									{order.products.map((item, index) => (
										<div
											key={index}
											className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
											<img
												src={item.thumb}
												alt={item.product.title}
												className="w-16 h-16 object-cover rounded-lg border border-slate-200"
											/>
											<div className="flex-1">
												<h4 className="font-medium text-slate-800 mb-1">
													{item.product.title}
												</h4>
												<div className="flex items-center gap-4 text-sm text-slate-600">
													<span>
														Color:{" "}
														<span className="font-medium">
															{item.color}
														</span>
													</span>
													<span>
														Quantity:{" "}
														<span className="font-medium">
															{item.quantity}
														</span>
													</span>
													<span>
														Price:{" "}
														<span className="font-medium text-blue-600">
															{formatMoney(
																item.price
															)}{" "}
															đ
														</span>
													</span>
												</div>
											</div>
											<div className="text-right">
												<p className="font-semibold text-slate-800">
													{formatMoney(
														item.price *
															item.quantity
													)}{" "}
													đ
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Payment Summary */}
							<div className="bg-white border border-slate-200 rounded-xl p-5">
								<div className="flex items-center gap-2 mb-4">
									<CreditCard className="w-5 h-5 text-green-600" />
									<h3 className="font-semibold text-slate-800">
										Payment Summary
									</h3>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between items-center py-1">
										<span className="text-slate-600">
											Subtotal:
										</span>
										<span className="font-medium">
											{formatMoney(subtotal)} đ
										</span>
									</div>
									<div className="flex justify-between items-center py-1">
										<span className="text-slate-600">
											Shipping:
										</span>
										<span className="font-medium">
											{formatMoney(shipping)} đ
										</span>
									</div>
									<div className="border-t pt-3">
										<div className="flex justify-between items-center">
											<span className="text-lg font-semibold text-slate-800">
												Total:
											</span>
											<span className="text-xl font-bold text-blue-600">
												{formatMoney(order.total)} đ
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(OrderDetailModal);
