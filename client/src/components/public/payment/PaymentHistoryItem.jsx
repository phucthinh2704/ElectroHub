import {
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	Eye,
	HandCoins,
	History,
	Package,
	Truck,
	XCircle,
} from "lucide-react";
import moment from "moment";
import React, { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiUpdateStatusOrders } from "../../../apis";
import formatMoney from "../../../utils/formatMoney";
import OrderDetailsModal from "../order/OrderDetailsModal";

const PaymentHistoryItem = ({ order, fetchOrders }) => {
	const navigate = useNavigate();
	const [showDetail, setShowDetail] = useState(false);
	const getStatusColor = (status) => {
		switch (status) {
			case "delivered":
				return "text-green-600 bg-green-50";
			case "shipped":
				return "text-blue-600 bg-blue-50";
			case "processing":
				return "text-yellow-600 bg-yellow-50";
			case "cancelled":
				return "text-red-600 bg-red-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "delivered":
				return <CheckCircle className="w-4 h-4" />;
			case "shipped":
				return <Truck className="w-4 h-4" />;
			case "processing":
				return <Clock className="w-4 h-4" />;
			case "cancelled":
				return <XCircle className="w-4 h-4" />;
			default:
				return <Package className="w-4 h-4" />;
		}
	};

	const handleUpdateStatusOrder = async (orderId, type, product) => {
		if (type === "received") {
			Swal.fire({
				title: "Are you sure?",
				text: "Do you really want to mark this order as received?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, mark as received!",
				cancelButtonText: "No, keep it",
			}).then(async (result) => {
				if (result.isConfirmed) {
					try {
						const response = await apiUpdateStatusOrders(orderId, {
							status: "delivered",
						});
						if (response.success) {
							toast.success(
								"Order marked as received successfully."
							);
							fetchOrders();
						} else {
							toast.error(
								"Failed to mark order as received. " +
									response.message
							);
						}
					} catch (error) {
						console.error(
							"Error marking order as received:",
							error
						);
						toast.error(
							"Failed to mark order as received. Please try again."
						);
					}
				}
			});
		} else if (type === "cancelled") {
			Swal.fire({
				title: "Are you sure?",
				text: "Do you really want to cancel this order?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#d33",
				cancelButtonColor: "#3085d6",
				confirmButtonText: "Yes, cancel it!",
				cancelButtonText: "No, keep it",
			}).then(async (result) => {
				if (result.isConfirmed) {
					try {
						const response = await apiUpdateStatusOrders(orderId, {
							status: "cancelled",
						});
						if (response.success) {
							toast.success("Order cancelled successfully.");
							fetchOrders();
						} else {
							toast.error(
								"Failed to cancel order. " + response.message
							);
						}
					} catch (error) {
						console.error("Error cancelling order:", error);
						toast.error(
							"Failed to cancel order. Please try again."
						);
					}
				}
			});
		} else if (type === "buy-again") {
			navigate(
				`/products/${product.category.toLowerCase()}/${product._id}/${
					product.slug
				}`
			);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			{/* Order Header */}
			<div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex flex-col sm:flex-row gap-4 sm:items-center items-start justify-between">
						<div>
							<h3 className="font-semibold text-gray-900 text-xl">
								Order Code: {order._id}
							</h3>
							<div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
								<Calendar className="w-4 h-4" />
								{moment(order.createdAt).format(
									"MMMM Do YYYY, h:mm A"
								)}
							</div>
						</div>
						<div
							className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
								order.status
							)}`}>
							{getStatusIcon(order.status)}
							{order.status.charAt(0).toUpperCase() +
								order.status.slice(1)}
						</div>
					</div>
					<div className="text-right">
						<p className="text-lg font-semibold text-gray-900">
							{formatMoney(order.total)} đ
						</p>
						<p className="text-sm text-gray-500">
							Total items:{" "}
							{order.products.reduce(
								(accumulator, currentValue) =>
									currentValue.quantity + accumulator,
								0
							)}
						</p>
					</div>
				</div>
			</div>

			{/* Order Details */}
			<div className="px-6 py-4">
				{/* Products */}
				<div className="mb-4">
					<h4 className="font-medium text-gray-900 mb-3">Items</h4>
					<div className="space-y-3">
						{order.products.map((product, index) => (
							<div
								key={index}
								className="flex items-center gap-4">
								<div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
									<img
										src={product.thumb}
										alt={product.product.title}
										className="w-full h-full object-contain rounded-lg border border-gray-300"
										loading="lazy"
										decoding="async"
									/>
								</div>
								<div className="flex-1">
									<p className="text-lg font-medium text-gray-900">
										{product.product.title}
									</p>
									<p className="text-sm font-medium text-gray-700">
										Color: {product.color}
									</p>
									<p className="text-sm text-gray-500">
										Quantity: {product.quantity}
									</p>
								</div>
								<p className="font-medium text-gray-900">
									{formatMoney(product.price)} đ
								</p>
								{order.status === "delivered" && (
									<button
										className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm cursor-pointer"
										onClick={() =>
											handleUpdateStatusOrder(
												order._id,
												"buy-again",
												product.product
											)
										}>
										<History className="w-4 h-4" />
										Buy Again
									</button>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Payment and Shipping */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
					<div>
						<h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
							<CreditCard className="w-4 h-4" />
							Payment Method
						</h4>
						<p className="text-gray-600">Paypal</p>
					</div>
					<div>
						<h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
							<Truck className="w-4 h-4" />
							Shipping Address
						</h4>
						<p className="text-gray-600">{order.shippingAddress}</p>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
				<div className="flex flex-wrap gap-3">
					<button
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
						onClick={() => setShowDetail(true)}>
						<Eye className="w-4 h-4" />
						View Details
					</button>
					{showDetail && (
						<div
							className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
							onClick={(e) => {
								if (e.target === e.currentTarget) {
									setShowDetail(false);
								}
							}}>
							<OrderDetailsModal
								order={order}
								setShowDetail={setShowDetail}
							/>
						</div>
					)}
					{order.status === "processing" && (
						<button
							className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm cursor-pointer"
							onClick={() =>
								handleUpdateStatusOrder(order._id, "cancelled")
							}>
							<XCircle className="w-4 h-4" />
							Cancel Order
						</button>
					)}
					{order.status === "shipped" && (
						<button
							className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm cursor-pointer"
							onClick={() =>
								handleUpdateStatusOrder(order._id, "received")
							}>
							<HandCoins className="w-4 h-4" />
							Order Received
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(PaymentHistoryItem);
