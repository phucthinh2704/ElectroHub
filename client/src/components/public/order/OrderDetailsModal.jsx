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
import React, { memo, useRef } from "react";
import exportToPDF from "../../../utils/exportToPDF";
import formatMoney from "../../../utils/formatMoney";

const OrderDetailsModal = ({ order, setShowDetail }) => {
	const pdfRef = useRef(null);

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

	const handleExportOrder = async (element, fileName, customOptions = {}) => {
		const options = {
			format: "a4",
			orientation: "portrait",
			scale: 2,
			margin: {
				horizontal: 10,
				vertical: 10,
			},
			backgroundColor: "#ffffff",
			...customOptions,
		};

		await exportToPDF(element, fileName, options);
	};

	const subtotal =
		order.products.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		) || 0;
	const shipping =
		subtotal > 2000000 ? 0 : +import.meta.env.VITE_SHIPPING_COST;
	const total = subtotal + shipping;
	const invoiceNumber = `INV-${order._id.slice(-8).toUpperCase()}`;

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
						className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
						Close
					</button>
					<button
						onClick={() =>
							handleExportOrder(pdfRef.current, `INV-${order._id}`)
						}
						className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2">
						<Download className="w-4 h-4" />
						Export Order
					</button>
				</div>

				{/* Invoice */}
				<div className="hidden">
					<div
						id="invoice-content"
						ref={pdfRef}
						className="max-w-4xl mx-auto bg-white p-8 font-sans">
						{/* Header */}
						<div className="border-b-2 border-blue-600 pb-6 mb-6">
							<div className="flex justify-between items-start">
								<div>
									<h1 className="text-4xl font-bold text-blue-600 mb-2">
										ELECTRO HUB
									</h1>
									<p className="text-xl text-gray-600 font-medium">
										DIGITAL
									</p>
									<div className="mt-4 text-sm text-gray-600">
										<p>474 Ontario St Toronto</p>
										<p>ON M4X 1M7 Canada</p>
										<p>Phone: (+84) 8000 8080</p>
										<p>
											Email:
											electrohub-digital@support.com
										</p>
									</div>
								</div>
								<div className="text-right">
									<h2 className="text-3xl font-bold text-gray-800 mb-2">
										INVOICE
									</h2>
									<div className="text-sm">
										<p className="font-semibold">
											Invoice ID: {invoiceNumber}
										</p>
										<p>
											Date:{" "}
											{moment(order.createdAt).format(
												"DD MMMM YYYY"
											)}
										</p>
										<p>
											Status:{" "}
											<span
												className={`capitalize px-2 py-1 rounded text-xs ${getStatusColor(
													order.status
												)}`}>
												{order.status}
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Customer Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
							<div>
								<h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
									BILL TO
								</h3>
								<div className="text-sm text-gray-600">
									<p className="font-medium">
										Customer ID: {order.orderBy._id}
									</p>
									<p className="font-medium">
										Name: {order.orderBy.name}
									</p>
									<p className="font-medium">
										Phone: {order.orderBy.mobile}
									</p>
									<p className="mt-2">
										<strong>Shipping Address:</strong>
									</p>
									<p>{order.shippingAddress}</p>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
									ORDER DETAILS
								</h3>
								<div className="text-sm text-gray-600">
									<p>
										<strong>Order ID:</strong> {order._id}
									</p>
									<p>
										<strong>Order Date:</strong>{" "}
										{moment(order.createdAt).format(
											"DD MMMM YYYY, h:mm A"
										)}
									</p>
									<p>
										<strong>Payment Method:</strong> Via
										Paypal
									</p>
									<p>
										<strong>Delivery:</strong> Standard
										Shipping
									</p>
								</div>
							</div>
						</div>

						{/* Products Table */}
						<div className="mb-8">
							<h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
								ITEMS ORDERED
							</h3>
							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr className="bg-gray-100">
											<th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
												#
											</th>
											<th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
												Product
											</th>
											<th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
												Image
											</th>
											<th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
												Color
											</th>
											<th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
												Quantity
											</th>
											<th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
												Unit Price
											</th>
											<th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
												Total
											</th>
										</tr>
									</thead>
									<tbody>
										{order.products.map((item, index) => (
											<tr
												key={index}
												className="hover:bg-gray-50">
												<td className="border border-gray-300 px-4 py-3 text-sm text-gray-600 text-center">
													{index + 1}
												</td>
												<td className="border border-gray-300 px-4 py-3">
													<div className="text-sm">
														<p className="font-medium text-gray-800">
															{item.product.title}
														</p>
														<p className="text-gray-600 text-xs uppercase">
															{
																item.product
																	.category
															}
														</p>
													</div>
												</td>
												<td className="border border-gray-300 px-4 py-3 text-center overflow-hidden">
													<div className="flex justify-center">
														<img
															src={item.thumb}
															alt={
																item.product
																	.title
															}
															className="w-12 h-12 object-cover rounded border border-gray-400"
														/>
													</div>
												</td>
												<td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-700">
													<span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
														{item.color}
													</span>
												</td>
												<td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-600">
													{item.quantity}
												</td>
												<td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-600">
													{formatMoney(item.price)} đ
												</td>
												<td className="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-800">
													{formatMoney(
														item.price *
															item.quantity
													)}{" "}
													đ
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Totals */}
						<div className="flex justify-end mb-8">
							<div className="w-80">
								<div className="border border-gray-300 rounded-lg overflow-hidden">
									<div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
										<h4 className="font-semibold text-gray-800">
											ORDER SUMMARY
										</h4>
									</div>
									<div className="p-4 space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">
												Subtotal:
											</span>
											<span className="text-gray-800">
												{formatMoney(subtotal)}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">
												Shipping:
											</span>
											<span className="text-gray-800">
												{shipping === 0
													? "FREE"
													: formatMoney(shipping)}
											</span>
										</div>
										<hr className="border-gray-300" />
										<div className="flex justify-between text-lg font-bold">
											<span className="text-gray-800">
												TOTAL:
											</span>
											<span className="text-main">
												{formatMoney(total)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Terms and Notes */}
						<div className="border-t border-gray-300 pt-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div>
									<h4 className="font-semibold text-gray-800 mb-2">
										TERMS & CONDITIONS
									</h4>
									<div className="text-xs text-gray-600 space-y-1">
										<p>
											• All products come with
											manufacturer warranty
										</p>
										<p>
											• Returns accepted within 7 days of
											delivery
										</p>
										<p>
											• Products must be in original
											condition
										</p>
										<p>
											• Warranty void if tampered or
											damaged
										</p>
									</div>
								</div>

								<div>
									<h4 className="font-semibold text-gray-800 mb-2">
										CUSTOMER SERVICE
									</h4>
									<div className="text-xs text-gray-600 space-y-1">
										<p>
											<strong>Hotline:</strong> (+84) 8000
											8080
										</p>
										<p>
											<strong>Email:</strong>{" "}
											electrohub-digital@support.com
										</p>
										<p>
											<strong>Hours:</strong> Mon-Sat 9:00
											AM - 8:00 PM
										</p>
										<p>
											<strong>Website:</strong>{" "}
											www.electrohub.vn
										</p>
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

export default memo(OrderDetailsModal);
