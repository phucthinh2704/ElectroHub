import {
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	Download,
	MapPin,
	Package,
	Truck,
	X,
	XCircle,
} from "lucide-react";
import moment from "moment";
import React, { memo, useState } from "react";
import formatMoney from "../../../utils/formatMoney";
import PreviewInvoice from "../invoice/PreviewInvoice";

const OrderDetailsModal = ({ order, setShowDetail }) => {
	const [showPreviewInvoice, setShowPreviewInvoice] = useState(false);

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case "processing":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "shipped":
				return "bg-blue-100 text-blue-800 border-blue-200";
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
				return <Package className="w-4 h-4 mr-2" />;
			case "shipped":
				return <Truck className="w-4 h-4 mr-2" />;
			case "delivered":
				return <CheckCircle className="w-4 h-4 mr-2" />;
			case "cancelled":
				return <XCircle className="w-4 h-4 mr-2" />;
			default:
				return <Clock className="w-4 h-4 mr-2" />;
		}
	};

	return (
		<div className="mx-auto w-full max-w-4xl rounded-lg shadow-lg text-black relative max-h-screen overflow-y-auto ">
			{/* Modal */}
			<div className="relative w-full mx-auto transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-5 text-white">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="rounded-full bg-white/20 p-3">
								<Package className="h-7 w-7" />
							</div>
							<div>
								<h2 className="text-2xl font-bold">
									Order Details
								</h2>
								<p className="text-blue-100">
									Order ID: #{order._id}
								</p>
							</div>
						</div>
						<button
							onClick={() => setShowDetail(false)}
							className="rounded-full bg-opacity-20 p-3 hover:bg-white/30 transition-colors cursor-pointer">
							<X className="h-7 w-7" />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="p-8">
					{/* Status and Key Info */}
					<div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="mb-2">
								<span
									className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
										order.status
									)}`}>
									{getStatusIcon(order.status)}
									{order.status.charAt(0).toUpperCase() +
										order.status.slice(1)}
								</span>
							</div>
							<p className="text-sm text-gray-600">
								Order Status
							</p>
						</div>

						<div className="text-center">
							<div className="mb-2">
								<span className="text-2xl font-bold text-main">
									{formatMoney(order.total)} đ
								</span>
							</div>
							<p className="text-sm text-gray-600">
								Total Amount
							</p>
						</div>

						<div className="text-center">
							<div className="mb-2">
								<span className="text-lg font-semibold text-blue-500">
									{order.products.reduce(
										(acc, cur) => acc + cur.quantity,
										0
									)}{" "}
									item
									{order.products.reduce(
										(acc, cur) => acc + cur.quantity,
										0
									) > 1
										? "s"
										: ""}
								</span>
							</div>
							<p className="text-sm text-gray-600">
								Products Ordered
							</p>
						</div>
					</div>

					{/* Products Section */}
					<div className="mb-8">
						<h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
							<Package className="h-5 w-5 mr-2 text-blue-600" />
							Products
						</h3>
						<div className="space-y-4">
							{order.products.map((product, index) => (
								<div
									key={index}
									className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
									<div className="flex-shrink-0 w-23 h-23 bg-white rounded-lg overflow-hidden border border-gray-200">
										<img
											src={product.thumb}
											alt="Product"
											className="w-full h-full object-contain"
										/>
									</div>
									<div className="ml-2 flex-1">
										<div className="flex justify-between items-center">
											<div>
												<p className="font-medium text-gray-900">
													{product.product.title}
												</p>
												<p className="text-sm text-gray-600 mt-1">
													Color: {product.color}
												</p>
												<p className="text-sm text-gray-600">
													Quantity: {product.quantity}{" "}
													x{" "}
													{formatMoney(product.price)}{" "}
													đ
												</p>
											</div>
											<div className="text-right">
												<p className="text-lg font-semibold text-gray-900">
													{formatMoney(
														product.price *
															product.quantity
													)}{" "}
													đ
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Shipping Information */}
					<div className="mb-8">
						<h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
							<MapPin className="h-5 w-5 mr-2 text-green-600" />
							Shipping Information
						</h3>
						<div className="bg-green-50 border border-green-200 rounded-xl p-4">
							<p className="text-gray-900 font-medium">
								Shipping Address:
							</p>
							<p className="text-gray-700 mt-1">
								{order.shippingAddress}
							</p>
						</div>
					</div>

					{/* Order Timeline */}
					<div className="mb-8">
						<h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
							<Calendar className="h-5 w-5 mr-2 text-purple-600" />
							Order Timeline
						</h3>
						<div className="space-y-4">
							<div className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-xl">
								<div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
									<Calendar className="h-5 w-5 text-white" />
								</div>
								<div className="ml-4">
									<p className="font-medium text-gray-900">
										Order Created
									</p>
									<p className="text-sm text-gray-600">
										{moment(order.createdAt).format(
											"MMMM Do YYYY, h:mm:ss A"
										)}
									</p>
								</div>
							</div>

							<div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
								<div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
									<Clock className="h-5 w-5 text-white" />
								</div>
								<div className="ml-4">
									<p className="font-medium text-gray-900">
										Last Updated
									</p>
									<p className="text-sm text-gray-600">
										{moment(order.updatedAt).format(
											"MMMM Do YYYY, h:mm:ss A"
										)}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Order Summary */}
					<div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
						<h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
							<CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
							Order Summary
						</h3>
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-gray-600">
									Items Count:
								</span>
								<span className="font-medium text-gray-900">
									{order.products.reduce(
										(acc, cur) => acc + cur.quantity,
										0
									)}
								</span>
							</div>
							<hr className="border-gray-300" />
							<div className="flex justify-between items-center text-lg font-bold">
								<span className="text-gray-900">
									Total Amount:
								</span>
								<span className="text-main">
									{formatMoney(order.total)} đ
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="bg-gray-50 px-8 py-4 flex justify-end space-x-4">
					<button
						onClick={() => setShowDetail(false)}
						className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer">
						Close
					</button>
					<button
						onClick={() => setShowPreviewInvoice(true)}
						className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2">
						<Download className="w-4 h-4" />
						Export Order
					</button>
				</div>

				{/* Invoice */}
				{showPreviewInvoice && (
					<div
						className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								setShowPreviewInvoice(false);
							}
						}}>
						<PreviewInvoice
							order={order}
							onClose={() => setShowPreviewInvoice(false)}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(OrderDetailsModal);
