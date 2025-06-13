import {
   ShoppingCart,
   Trash2
} from "lucide-react";
import { memo } from "react";
import renderRatingStar from "../../../utils/renderRatingStar";

const WishlistItem = ({ item, viewMode, removeFromWishlist }) => (
	<div
		className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 ${
			viewMode === "list" ? "flex" : ""
		}`}>
		<div
			className={`relative ${
				viewMode === "list"
					? "w-32 h-32 flex-shrink-0"
					: "aspect-square"
			}`}>
			<img
				src={item.image}
				alt={item.name}
				className="w-full h-full object-cover"
			/>
			{!item.inStock && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<span className="text-white text-sm font-medium px-3 py-1 bg-red-500 rounded-full">
						Out of Stock
					</span>
				</div>
			)}
			<button
				onClick={() => removeFromWishlist(item.id)}
				className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white hover:text-red-500">
				<Trash2 size={16} />
			</button>
		</div>

		<div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
			<div className="flex items-start justify-between mb-2">
				<h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight">
					{item.name}
				</h3>
			</div>

			<div className="flex items-center gap-1 mb-2">
				{renderRatingStar(item.rating)}
				<span className="text-xs text-gray-500 ml-1">
					({item.rating})
				</span>
			</div>

			<div className="flex items-center gap-2 mb-3">
				<span className="text-lg font-bold text-gray-900">
					${item.price}
				</span>
				{item.originalPrice > item.price && (
					<span className="text-sm text-gray-500 line-through">
						${item.originalPrice}
					</span>
				)}
				{item.originalPrice > item.price && (
					<span className="text-xs text-green-600 font-medium">
						Save ${(item.originalPrice - item.price).toFixed(2)}
					</span>
				)}
			</div>

			<button
				disabled={!item.inStock}
				className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
					item.inStock
						? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
						: "bg-gray-100 text-gray-400 cursor-not-allowed"
				}`}>
				<ShoppingCart size={16} />
				{item.inStock ? "Add to Cart" : "Out of Stock"}
			</button>
		</div>
	</div>
);

export default memo(WishlistItem);
