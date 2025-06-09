import React, { memo } from "react";
import { ShoppingCart, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import path from "../../../utils/path";

const CartHeader = ({ cartItems, icon, title }) => {
	const totalItems = cartItems?.length || 0;
	const totalQuantity =
		cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
	return (
		<div className="relative mb-6 overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl"></div>

			<div className="relative p-6">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
					{/* Left Section */}
					<div className="space-y-4">
						{/* Breadcrumb */}
						<div className="flex items-center gap-3 text-sm">
							<Link to={`/${path.HOME}`}>
								<button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 group cursor-pointer">
									<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
									<span className="font-medium">
										Continue Shopping
									</span>
								</button>
							</Link>
							<span className="text-gray-400">/</span>
							<span className="text-gray-800 font-medium">
								{title}
							</span>
						</div>

						{/* Main Title */}
						<div className="flex items-center gap-3">
							<div className="relative">
								<div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
									{/* <ShoppingCart className="w-6 h-6 text-white" /> */}
									{icon}
								</div>
							</div>

							<div>
								<h1 className="text-3xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
									{title}
								</h1>
							</div>
						</div>
					</div>

					{/* Right Section - Cart Stats */}
					{title.toLowerCase().includes("cart") && (
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Items Count */}
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/50 min-w-[120px]">
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-800">
										{totalItems}
									</div>
									<div className="text-sm text-gray-600">
										Item{totalItems !== 1 ? "s" : ""}
									</div>
								</div>
							</div>

							{/* Total Quantity */}
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/50 min-w-[120px]">
								<div className="text-center">
									<div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
										{totalQuantity}
									</div>
									<div className="text-sm text-gray-600">
										Total Quantity
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Bottom Decorative Border */}
			<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-3xl"></div>
		</div>
	);
};

export default memo(CartHeader);
