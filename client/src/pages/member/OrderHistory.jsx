import {
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	Download,
	Eye,
	Package,
	Truck,
	XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { apiUserOrders } from "../../apis";

const OrderHistory = () => {
	const [activeTab, setActiveTab] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
   const [orderss, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async (params) => {
			const response = await apiUserOrders(params);
         if(response.success) {
            setOrders(response.orders);
            console.log(response);
         }
		};
      
      fetchOrders({ limit: 1 });
	}, []);
   console.log(orderss);

	// Sample order data
	const orders = [
		{
			id: "ORD-2024-001",
			date: "2024-06-10",
			status: "delivered",
			total: 299.99,
			items: 3,
			paymentMethod: "Credit Card",
			shippingAddress: "123 Main St, New York, NY 10001",
			products: [
				{
					name: "Wireless Headphones",
					price: 149.99,
					quantity: 1,
					image: "/api/placeholder/60/60",
				},
				{
					name: "Phone Case",
					price: 29.99,
					quantity: 2,
					image: "/api/placeholder/60/60",
				},
			],
		},
		{
			id: "ORD-2024-002",
			date: "2024-06-08",
			status: "shipped",
			total: 159.99,
			items: 2,
			paymentMethod: "PayPal",
			shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
			products: [
				{
					name: "Bluetooth Speaker",
					price: 89.99,
					quantity: 1,
					image: "/api/placeholder/60/60",
				},
				{
					name: "USB Cable",
					price: 19.99,
					quantity: 1,
					image: "/api/placeholder/60/60",
				},
			],
		},
		{
			id: "ORD-2024-003",
			date: "2024-06-05",
			status: "processing",
			total: 89.99,
			items: 1,
			paymentMethod: "Credit Card",
			shippingAddress: "789 Pine St, Chicago, IL 60601",
			products: [
				{
					name: "Laptop Stand",
					price: 89.99,
					quantity: 1,
					image: "/api/placeholder/60/60",
				},
			],
		},
		{
			id: "ORD-2024-004",
			date: "2024-06-01",
			status: "cancelled",
			total: 199.99,
			items: 1,
			paymentMethod: "Credit Card",
			shippingAddress: "321 Elm St, Miami, FL 33101",
			products: [
				{
					name: "Smart Watch",
					price: 199.99,
					quantity: 1,
					image: "/api/placeholder/60/60",
				},
			],
		},
	];

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

	const filteredOrders = orders.filter((order) => {
		const matchesTab = activeTab === "all" || order.status === activeTab;
		const matchesSearch =
			order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.products.some((product) =>
				product.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		return matchesTab && matchesSearch;
	});

	const tabs = [
		{ id: "all", label: "All Orders", count: orders.length },
		{
			id: "delivered",
			label: "Delivered",
			count: orders.filter((o) => o.status === "delivered").length,
		},
		{
			id: "shipped",
			label: "Shipped",
			count: orders.filter((o) => o.status === "shipped").length,
		},
		{
			id: "processing",
			label: "Processing",
			count: orders.filter((o) => o.status === "processing").length,
		},
		{
			id: "cancelled",
			label: "Cancelled",
			count: orders.filter((o) => o.status === "cancelled").length,
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 py-8 text-black">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Order History
					</h1>
					<p className="text-gray-600">
						Track and manage your orders
					</p>
				</div>

				{/* Search and Filter */}
				<div className="mb-8 bg-white rounded-lg shadow-sm p-6">
					<div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
						<div className="relative flex-1 max-w-md">
							<input
								type="text"
								placeholder="Search orders or products..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-4 pr-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div className="flex gap-2">
							<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								<Download className="w-4 h-4" />
								Export
							</button>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="mb-6">
					<nav className="flex space-x-8 overflow-x-auto">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
									activeTab === tab.id
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}>
								{tab.label}
								<span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
									{tab.count}
								</span>
							</button>
						))}
					</nav>
				</div>

				{/* Orders List */}
				<div className="space-y-6">
					{filteredOrders.length === 0 ? (
						<div className="text-center py-12 bg-white rounded-lg shadow-sm">
							<Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No orders found
							</h3>
							<p className="text-gray-500">
								Try adjusting your search or filter criteria
							</p>
						</div>
					) : (
						filteredOrders.map((order) => (
							<div
								key={order.id}
								className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
								{/* Order Header */}
								<div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
									<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
										<div className="flex flex-col sm:flex-row gap-4 sm:items-center">
											<div>
												<h3 className="font-semibold text-gray-900">
													{order.id}
												</h3>
												<div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
													<Calendar className="w-4 h-4" />
													{new Date(
														order.date
													).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														}
													)}
												</div>
											</div>
											<div
												className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
													order.status
												)}`}>
												{getStatusIcon(order.status)}
												{order.status
													.charAt(0)
													.toUpperCase() +
													order.status.slice(1)}
											</div>
										</div>
										<div className="text-right">
											<p className="text-lg font-semibold text-gray-900">
												${order.total}
											</p>
											<p className="text-sm text-gray-500">
												{order.items} items
											</p>
										</div>
									</div>
								</div>

								{/* Order Details */}
								<div className="px-6 py-4">
									{/* Products */}
									<div className="mb-4">
										<h4 className="font-medium text-gray-900 mb-3">
											Items
										</h4>
										<div className="space-y-3">
											{order.products.map(
												(product, index) => (
													<div
														key={index}
														className="flex items-center gap-4">
														<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
															<Package className="w-6 h-6 text-gray-400" />
														</div>
														<div className="flex-1">
															<p className="font-medium text-gray-900">
																{product.name}
															</p>
															<p className="text-sm text-gray-500">
																Qty:{" "}
																{
																	product.quantity
																}
															</p>
														</div>
														<p className="font-medium text-gray-900">
															${product.price}
														</p>
													</div>
												)
											)}
										</div>
									</div>

									{/* Payment and Shipping */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
										<div>
											<h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
												<CreditCard className="w-4 h-4" />
												Payment Method
											</h4>
											<p className="text-gray-600">
												{order.paymentMethod}
											</p>
										</div>
										<div>
											<h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
												<Truck className="w-4 h-4" />
												Shipping Address
											</h4>
											<p className="text-gray-600">
												{order.shippingAddress}
											</p>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
									<div className="flex flex-wrap gap-3">
										<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
											<Eye className="w-4 h-4" />
											View Details
										</button>
										{order.status === "delivered" && (
											<button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
												<Download className="w-4 h-4" />
												Download Invoice
											</button>
										)}
										{order.status === "shipped" && (
											<button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
												<Truck className="w-4 h-4" />
												Track Package
											</button>
										)}
										{order.status === "processing" && (
											<button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
												<XCircle className="w-4 h-4" />
												Cancel Order
											</button>
										)}
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* Pagination */}
				{filteredOrders.length > 0 && (
					<div className="mt-8 flex justify-center">
						<nav className="flex items-center gap-2">
							<button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
								Previous
							</button>
							<button className="px-3 py-2 text-sm bg-blue-600 text-white rounded">
								1
							</button>
							<button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
								2
							</button>
							<button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
								3
							</button>
							<button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
								Next
							</button>
						</nav>
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderHistory;
