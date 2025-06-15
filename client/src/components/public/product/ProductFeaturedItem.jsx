import React, { memo } from "react";
import renderRatingStar from "../../../utils/renderRatingStar";
import formatMoney from "../../../utils/formatMoney";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import path from "../../../utils/path";
import { apiUpdateWishlist } from "../../../apis";
import { toast } from "react-toastify";
import { getCurrent } from "../../../store/user/asyncAction";
import { useDispatch, useSelector } from "react-redux";

const ProductFeaturedItem = ({ product }) => {
	const { current } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const isFavorite = current?.wishlist?.some(
		(item) => item._id === product._id
	);
	const handleAddToWishlist = async (e) => {
		e.preventDefault();
		if (!current) {
			Swal.fire({
				title: "Please login to continue",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Login",
				cancelButtonText: "Cancel",
			}).then((result) => {
				if (result.isConfirmed) {
					window.scrollTo(0, 0);
					navigate(`/${path.LOGIN}`, {
						state: `/products/${product.category.toLowerCase()}/${
							product._id
						}/${product.slug}`,
					});
				}
			});
			return;
		}
		try {
			const response = await apiUpdateWishlist(product._id);
			if (response.success) {
				toast.success(response.message);
				dispatch(getCurrent());
			} else {
				toast.error(response.message || "Failed to update wishlist");
			}
		} catch (error) {
			console.log("Error adding to wishlist:", error);
			toast.error("Failed to add to wishlist. Please try again later.");
		}
	};
	return (
		<Link
			to={`/products/${product.category.toLowerCase()}/${product._id}/${
				product.slug
			}`}
			className="w-full">
			<div className="border border-gray-300 hover:border-main rounded-lg p-3 flex gap-4 items-center transition-all duration-300 hover:shadow-md group cursor-pointer">
				{/* Image with hover effect */}
				<div className="w-[105px] h-[105px] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center relative">
					<img
						src={product.thumb}
						alt={product.title || "Product image"}
						className="w-full h-full object-contain block transition-transform duration-500 group-hover:scale-110"
					/>
					{product.discount > 0 && (
						<div className="absolute top-0 left-0 bg-main text-white text-xs font-medium py-1 px-2 rounded-br-md">
							-{product.discount}%
						</div>
					)}
				</div>

				{/* Product details with better typography */}
				<div className="flex-1">
					<div className="flex justify-between items-start">
						<p className="line-clamp-1 font-medium text-gray-800 group-hover:text-main transition-colors duration-300">
							{product.title}
						</p>

						{/* Optional: Add to wishlist button */}
						<button className="text-gray-400 hover:text-main transition-colors duration-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								onClick={(e) => handleAddToWishlist(e)}
								className="h-4 w-4 cursor-pointer"
								fill={`${isFavorite ? "red" : "none"}`}
								stroke={`${isFavorite ? "none" : "red"}`}
								viewBox="0 0 24 24"
								strokeWidth={2}>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
						</button>
					</div>

					{/* Rating stars */}
					<div className="flex items-center gap-2 my-1.5">
						<span className="flex">
							{renderRatingStar(product.totalRatings)}
						</span>
						<span className="text-xs text-gray-500">
							({product.ratingCount || 0})
						</span>
					</div>

					{/* Price section with original price if discounted */}
					<div className="flex items-baseline gap-2">
						<p className="text-main font-semibold">
							{formatMoney(product.price)} VND
						</p>

						{product.originalPrice &&
							product.originalPrice > product.price && (
								<p className="text-gray-400 text-xs line-through">
									{formatMoney(product.originalPrice)} VND
								</p>
							)}
					</div>

					{/* Stock status */}
					{product.stock <= 5 && product.stock > 0 ? (
						<p className="text-xs text-amber-600 mt-1">
							Only {product.stock} left in stock
						</p>
					) : product.stock === 0 ? (
						<p className="text-xs text-gray-500 mt-1">
							Out of stock
						</p>
					) : null}
				</div>
			</div>
		</Link>
	);
};

export default memo(ProductFeaturedItem);
