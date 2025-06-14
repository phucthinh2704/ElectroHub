import { Download, History, Package } from "lucide-react";
import React, { useEffect, useState } from "react";
import { apiUserOrders } from "../../apis";
import { CartHeader, Pagination, PaymentHistoryItem } from "../../components";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
	const [activeTab, setActiveTab] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [orders, setOrders] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage] = useState(2); // Number of orders per page

	const navigate = useNavigate();

	useEffect(() => {
		const fetchOrders = async (params) => {
			const response = await apiUserOrders(params);
			if (response.success) {
				setOrders(response.orders);
			}
		};
		fetchOrders();

		const params = new URLSearchParams(window.location.search);
		const page = params.get("page") || 1;
		setCurrentPage(Number(page));
	}, []);

	const filteredOrders = orders.filter((order) => {
		const matchesTab = activeTab === "all" || order.status === activeTab;
		const matchesSearch =
			order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.products.some((product) =>
				product.product.title
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
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

	const handleTabsFilterChange = (id) => {
		setActiveTab(id);
		const params = new URLSearchParams(window.location.search);
		params.set("page", 1);
		setCurrentPage(1);
		navigate({
			pathname: window.location.pathname,
			search: params.toString(),
		});
	};

	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = filteredOrders.slice(
		indexOfFirstOrder,
		indexOfLastOrder
	);

	return (
		<div className="min-h-screen p-4 bg-white shadow-lg text-slate-900">
			{/* Header */}
			<CartHeader
				title={"Order History"}
				icon={<History className="w-6 h-6 text-white" />}
			/>

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
							onClick={() => handleTabsFilterChange(tab.id)}
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
					currentOrders.map((order) => (
						<PaymentHistoryItem
							key={order._id}
							order={order}
						/>
					))
				)}
			</div>

			<div className="mt-8 justify-end flex">
				<Pagination
					currentPage={currentPage}
					totalCount={filteredOrders.length}
					onPageChange={setCurrentPage}
					pageSize={ordersPerPage}
					siblingCount={1}
				/>
			</div>
		</div>
	);
};

export default OrderHistory;
