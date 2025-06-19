import moment from "moment";
import React, { memo, useRef, useState } from "react";
import formatMoney from "../../../utils/formatMoney";
import exportToPDF from "../../../utils/exportToPDF";
import { Loader2 } from "lucide-react";

const PreviewInvoice = ({ order, onClose }) => {
	const pdfRef = useRef(null);
	const [isExporting, setIsExporting] = useState(false);
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

	const handleExportOrder = async (element, fileName, customOptions = {}) => {
		setIsExporting(true);
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

		setTimeout(async () => {
			await exportToPDF(element, fileName, options);
			setIsExporting(false);
		}, 200);
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
		<div className="max-h-screen bg-gray-100 p-4 pt-6 overflow-y-auto">
			<div
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
								<p>Email: electrohub-digital@support.com</p>
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
								<strong>Payment Method:</strong> Via Paypal
							</p>
							<p>
								<strong>Delivery:</strong> Standard Shipping
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
									<th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
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
										<td className="border border-gray-300 p-3 max-w-[270px]">
											<div className="text-sm">
												<p className="font-medium text-gray-800">
													{item.product.title}
												</p>
												<p className="text-gray-600 text-xs uppercase">
													{item.product.category}
												</p>
											</div>
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center overflow-hidden">
											<div className="flex justify-center">
												<img
													src={item.thumb}
													alt={item.product.title}
													className="w-12 h-12 object-contain rounded border border-gray-400"
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
												item.price * item.quantity
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
									• All products come with manufacturer
									warranty
								</p>
								<p>
									• Returns accepted within 7 days of delivery
								</p>
								<p>• Products must be in original condition</p>
								<p>• Warranty void if tampered or damaged</p>
							</div>
						</div>

						<div>
							<h4 className="font-semibold text-gray-800 mb-2">
								CUSTOMER SERVICE
							</h4>
							<div className="text-xs text-gray-600 space-y-1">
								<p>
									<strong>Hotline:</strong> (+84) 8000 8080
								</p>
								<p>
									<strong>Email:</strong>{" "}
									electrohub-digital@support.com
								</p>
								<p>
									<strong>Hours:</strong> Mon-Sat 9:00 AM -
									8:00 PM
								</p>
								<p>
									<strong>Website:</strong> www.electrohub.vn
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-end mt-4 gap-2">
				<button
					className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
					onClick={onClose}>
					Close
				</button>
				<button
					className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-400"
					disabled={isExporting}
					onClick={() =>
						handleExportOrder(pdfRef.current, `INV-${order._id}`)
					}>
					{isExporting && (
						<Loader2 className="mr-1 h-4 w-4 animate-spin" />
					)}{" "}
					Export To PDF
				</button>
			</div>
		</div>
	);
};

export default memo(PreviewInvoice);
