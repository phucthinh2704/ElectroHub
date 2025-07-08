import { memo } from "react";
import formatMoney from "../../../utils/formatMoney";
import { Star, Heart, Eye, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { apiUpdateCart, apiUpdateWishlist } from "../../../apis";
import { toast } from "react-toastify";
import { getCurrent } from "../../../store/user/asyncAction";
import path from "../../../utils/path";

const ProductListItem = ({ product }) => {
	const { current } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const isFavorite = current?.wishlist?.some(
		(item) => item._id === product._id
	);

	const handleActions = async (type) => {
		switch (type) {
			case "WISHLIST": {
				if (!current) {
					Swal.fire({
						title: "Please login to continue",
						icon: "warning",
						showCancelButton: true,
						confirmButtonText: "Login",
						cancelButtonText: "Cancel",
					}).then((result) => {
						if (result.isConfirmed) {
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
						toast.error(
							response.message || "Failed to update wishlist"
						);
					}
				} catch (error) {
					console.log("Error adding to wishlist:", error);
					toast.error(
						"Failed to add to wishlist. Please try again later."
					);
				}
				break;
			}
			case "VIEW":
				navigate(
					`/products/${product.category.toLowerCase()}/${
						product._id
					}/${product.slug}`
				);
				break;
			case "ADD_TO_CART": {
				if (!current) {
					Swal.fire({
						title: "Please login to continue",
						icon: "warning",
						showCancelButton: true,
						confirmButtonText: "Login",
						cancelButtonText: "Cancel",
					}).then((result) => {
						if (result.isConfirmed) {
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
					if (product.stock <= 0) {
						Swal.fire({
							title: "Out of Stock",
							text: "This item is currently out of stock.",
							icon: "warning",
							confirmButtonText: "OK",
						});
						return;
					}
					const response = await apiUpdateCart({
						pid: product._id,
						color: product.color,
						quantity: 1,
						thumb: product.thumb,
						price: product.price,
						stock: product.stock,
					});
					if (response.success) {
						toast.success(response.message);
						dispatch(getCurrent());
					} else {
						toast.error(
							response.message || "Failed to add to cart"
						);
					}
				} catch (error) {
					console.log("Error adding to cart:", error);
					toast.error(
						"Failed to add to cart. Please try again later."
					);
					return;
				}
				break;
			}
			default:
				break;
		}
	};
	return (
		<div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex items-center gap-2 p-3 border border-gray-200 hover:border-gray-300 relative group">
			{/* Product Image and Discount Badge */}
			<div className="relative w-50 min-h-[250px] border border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden">
				<img
					src={product.thumb}
					alt={product.title}
					className="h-full object-contain"
					loading="lazy"
					decoding="async"
				/>
				{product.discount > 0 && (
					<span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
						-{product.discount}%
					</span>
				)}
			</div>

			<div className="flex-1 p-4">
				<div className="flex justify-between items-center">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
								{product.brand}
							</span>
							<span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
								{product.category}
							</span>
						</div>

						<Link
							to={`/products/${product.category.toLowerCase()}/${
								product._id
							}/${product.slug}`}>
							<h3 className="font-semibold text-gray-800 mb-2 hover:text-main transition-colors duration-200">
								{product.title}
							</h3>
						</Link>

						<p className="text-sm text-gray-600 mb-2">
							{/* {product.description.join("\n")} */}
							{product.description.map((desc, index) => (
								<li
									key={index}
									className="flex items-start">
									<span className="mr-2 mt-1 text-blue-500">
										•
									</span>
									<span>{desc}</span>
								</li>
							))}
						</p>

						<div className="flex items-center gap-4 mb-2">
							<div className="flex items-center">
								<Star
									size={14}
									className="text-yellow-400 fill-current"
								/>
								<span className="text-sm text-gray-600 ml-1">
									{product.totalRatings} (
									{product.ratingCount})
								</span>
							</div>
							<span className="text-sm text-gray-500">
								Sold: {product.sold}
							</span>
							<span
								className={`text-sm ${
									product.stock > 10
										? "text-green-600"
										: "text-orange-600"
								}`}>
								Stock: {product.stock}
							</span>
						</div>
					</div>

					<div className="text-right">
						<div className="mb-2">
							<div className="text-2xl font-bold text-red-600">
								{formatMoney(product.price)} đ
							</div>
							{product.discount > 0 && (
								<div className="text-gray-500 line-through">
									{formatMoney(product.originalPrice)} đ
								</div>
							)}
						</div>

						<div className="flex gap-2">
							<button
								className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
								onClick={() => handleActions("WISHLIST")}>
								{isFavorite ? (
									<Heart
										size={16}
										fill="red"
										stroke="red"
									/>
								) : (
									<Heart size={16} />
								)}
							</button>
							<button
								className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
								onClick={() => handleActions("VIEW")}>
								<Eye size={16} />
							</button>
							<button
								className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
								onClick={() => handleActions("ADD_TO_CART")}>
								<ShoppingCart size={16} />
								Add to Cart
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default memo(ProductListItem);
