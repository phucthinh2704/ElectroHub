import { Heart, Minus, Plus, Tag, Trash2 } from "lucide-react";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import formatMoney from "../../../utils/formatMoney";
import renderRatingStar from "../../../utils/renderRatingStar";
import { apiUpdateCart } from "../../../apis";
import { toast } from "react-toastify";
import { getCurrent } from "../../../store/user/asyncAction";
import { useDispatch } from "react-redux";

const CartItem = ({ item, updateQuantity, removeItem }) => {
	const dispatch = useDispatch();
	const discountPercentage = Math.round(
		((item.product.originalPrice - item.price) /
			item.product.originalPrice) *
			100
	);

	const handleIncreaseItem = async () => {
		updateQuantity(item._id, 1);
		try {
			const response = await apiUpdateCart({
				pid: item.product._id,
				color: item.color,
				quantity: 1,
				thumb: item.thumb,
				price: item.price,
				stock: item.stock,
			});
			if (response.success) {
				dispatch(getCurrent());
			} else {
				toast.error(response.message || "Failed to add to cart");
			}
		} catch (error) {
			console.log("Error adding to cart:", error);
			toast.error("Failed to add to cart. Please try again later.");
		}
	};

	const handleDecreaseItem = async () => {
		updateQuantity(item._id, -1);
		try {
			const response = await apiUpdateCart({
				pid: item.product._id,
				color: item.color,
				quantity: -1,
				thumb: item.thumb,
				price: item.price,
				stock: item.stock,
			});
			if (response.success) {
				dispatch(getCurrent());
			} else {
				toast.error(response.message || "Failed to add to cart");
			}
		} catch (error) {
			console.log("Error adding to cart:", error);
			toast.error("Failed to add to cart. Please try again later.");
		}
	}

	return (
		<div className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 py-4 px-6 border border-gray-100 hover:border-gray-200 relative overflow-hidden">
			{/* Discount Badge */}
			{discountPercentage > 0 && (
				<div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
					-{discountPercentage}%
				</div>
			)}

			{/* Heart Icon */}
			<button className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10 cursor-pointer">
				<Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors duration-300" />
			</button>

			<div className="flex flex-col lg:flex-row gap-4">
				{/* Product Image */}
				<div className="relative">
					<Link
						to={`/products/${item.product.category.toLowerCase()}/${
							item.product._id
						}/${item.product.slug}`}>
						<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden p-4 hover:from-gray-100 hover:to-gray-200 transition-colors duration-300">
							<img
								src={item.thumb}
								alt={item.product.title}
								className="w-full lg:w-40 h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
							/>
						</div>
					</Link>

					{/* Color indicator */}
					<div className="absolute bottom-2 left-2 flex items-center gap-2 bg-white/90 px-2 py-1 rounded-full border-2 border-gray-300">
						<div
							className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
							style={{
								backgroundColor:
									item.color?.toLowerCase() || "#3B82F6",
							}}></div>
						<span className="text-xs font-medium text-gray-700">
							{item.color}
						</span>
					</div>
				</div>

				{/* Product Details */}
				<div className="flex-1 space-y-2">
					<div>
						{/* Category */}
						<div className="flex items-center gap-2">
							<Tag className="w-4 h-4 text-blue-500" />
							<Link
								to={`/products/${item.product.category.toLowerCase()}`}>
								<span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer uppercase">
									{item.product.category}
								</span>
							</Link>
						</div>

						{/* Product Title */}
						<Link
							to={`/products/${item.product.category.toLowerCase()}/${
								item.product._id
							}/${item.product.slug}`}>
							<h3 className="text-xl lg:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300 cursor-pointer line-clamp-2 inline-block">
								{item.product.title}
							</h3>
						</Link>

						{/* Rating (if available) */}
						<div className="flex items-center gap-1">
							<div className="flex items-center">
								{renderRatingStar(
									item.product.totalRatings,
									17
								)}
							</div>
							<span className="text-sm text-gray-600">
								{item.product.totalRatings}
							</span>
						</div>

						{/* Pricing */}
						<div
							className={`space-y-1 ${
								item.stock <= 30 ? "mt-7" : "mt-13"
							}`}>
							<div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
								<span>💰</span>
								Save{" "}
								{formatMoney(
									item.product.originalPrice - item.price
								)}
								đ
							</div>
							<div className="flex items-center gap-2">
								<span className="text-xl font-bold text-main">
									{formatMoney(item.price)}đ
								</span>
								<span className="text-gray-400 line-through">
									{formatMoney(item.product.originalPrice)}đ
								</span>
							</div>
							{item.stock <= 30 && (
								<div>
									<p className="text-sm text-main font- animate-bounce">
										Only {item.stock} items left in stock!
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Quantity Controls & Actions */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
						{/* Quantity Controls */}
						<div className="flex items-center bg-gray-100 rounded-xl px-1">
							<button
								onClick={handleDecreaseItem}
								className="bg-white hover:bg-gray-100 p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer">
								<Minus className="w-4 h-4 text-gray-600" />
							</button>

							<div className="flex items-center justify-center min-w-[40px] px-4 py-3">
								<span className="text-lg font-semibold text-gray-800">
									{item.quantity}
								</span>
							</div>

							<button
								onClick={handleIncreaseItem}
								className="bg-white hover:bg-gray-100 p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer">
								<Plus className="w-4 h-4 text-gray-600" />
							</button>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-3">
							{/* Total Price for this item */}
							<div className="text-right">
								<p className="text-sm text-gray-600">Total</p>
								<p className="text-xl font-bold text-gray-800">
									{formatMoney(item.price * item.quantity)}đ
								</p>
							</div>

							{/* Remove Button */}
							<button
								onClick={() => removeItem(item._id)}
								className="bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 group cursor-pointer">
								<Trash2 className="w-5 h-5 group-hover:animate-pulse" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Subtle background pattern */}
			<div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl pointer-events-none"></div>
		</div>
	);
};

export default memo(CartItem);
