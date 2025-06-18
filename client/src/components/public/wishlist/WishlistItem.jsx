import { ShoppingCart, Trash2 } from "lucide-react";
import { memo } from "react";
import renderRatingStar from "../../../utils/renderRatingStar";
import formatMoney from "../../../utils/formatMoney";
import { apiUpdateCart, apiUpdateWishlist } from "../../../apis";
import { toast } from "react-toastify";
import { getCurrent } from "../../../store/user/asyncAction";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const WishlistItem = ({
	item,
	removeFromWishlist,
	currentWishlistItem,
	currentPage,
	setCurrentPage,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleAddToCart = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!item.stock) {
			Swal.fire({
				title: "Out of Stock",
				text: "This item is currently out of stock.",
				icon: "warning",
				confirmButtonText: "OK",
			});
			return;
		}
		try {
			const response = await apiUpdateCart({
				pid: item._id,
				color: item.color,
				price: item.price,
				thumb: item.thumb,
				quantity: 1,
				stock: item.stock,
			});
			if (response.success) {
				toast.success(response.message);
				dispatch(getCurrent());
			} else {
				toast.error(response.message || "Failed to add to cart");
			}
		} catch (error) {
			console.log("Error adding to cart:", error);
			toast.error("Failed to add to cart. Please try again later.");
		}
	};

	const handleUpdateWishlist = async (e) => {
		e.stopPropagation();
		e.preventDefault();
		try {
			const response = await apiUpdateWishlist(item._id);
			if (response.success) {
				toast.success(`Removed ${item.title} from wishlist`);
				dispatch(getCurrent());
				removeFromWishlist(item._id);
				if (currentWishlistItem.length === 1 && currentPage > 1) {
					setCurrentPage(currentPage - 1);
					navigate({
						pathname: window.location.pathname,
						search: `?page=${currentPage - 1}`,
					});
				}
			} else {
				toast.error(response.message || "Failed to update wishlist");
			}
		} catch (error) {
			console.log("Error updating wishlist:", error);
			toast.error("Failed to update wishlist. Please try again later.");
		}
	};
	return (
		<div
			className={`bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden group hover:shadow-lg transition-all duration-300`}>
			<div className={`relative aspect-square border-b border-gray-300`}>
				<img
					src={item.thumb}
					alt={item.title}
					className="w-full h-full object-contain"
				/>
				{!item.stock && (
					<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<span className="text-white text-sm font-medium px-3 py-1 bg-red-500 rounded-full">
							Out of Stock
						</span>
					</div>
				)}
				<button
					onClick={(e) => handleUpdateWishlist(e)}
					title="Remove from Wishlist"
					className="absolute top-3 right-3 p-2.5 bg-red-500 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 cursor-pointer">
					<Trash2
						size={21}
						color="white"
					/>
				</button>
			</div>

			<div className={`p-4`}>
				<div className="flex items-start justify-between mb-2">
					<h3 className="font-semibold text-gray-900 line-clamp-1 text-sm leading-tight">
						{item.title}
					</h3>
				</div>

				<div className="flex items-center gap-1 mb-2">
					{renderRatingStar(item.totalRatings)}
					<span className="text-xs text-gray-500 ml-1">
						({item.totalRatings})
					</span>
				</div>

				<div className="flex flex-col mb-3">
					<span className="text-sm text-gray-500 line-through">
						{formatMoney(item.originalPrice)} đ
					</span>
					<div className="flex items-center gap-2">
						<span className="text-lg font-bold text-gray-900">
							{formatMoney(item.price)} đ
						</span>
						{item.originalPrice > item.price && (
							<span className="text-sm text-green-600 font-medium block">
								Save{" "}
								{formatMoney(
									(item.originalPrice - item.price).toFixed(2)
								)}{" "}
								đ
							</span>
						)}
					</div>
				</div>

				<button
					disabled={!item.stock}
					onClick={(e) => handleAddToCart(e)}
					className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
						item.stock
							? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
							: "bg-gray-100 text-gray-400 cursor-not-allowed"
					}`}>
					<ShoppingCart size={16} />
					{item.stock ? "Add to Cart" : "Out of Stock"}
				</button>
			</div>
		</div>
	);
};

export default memo(WishlistItem);
