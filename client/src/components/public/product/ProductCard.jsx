import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiUpdateCart, apiUpdateWishlist } from "../../../apis/user";
import newLabel from "../../../assets/new.png";
import trendingLabel from "../../../assets/trending.png";
import { getCurrent } from "../../../store/user/asyncAction";
import formatMoney from "../../../utils/formatMoney";
import icons from "../../../utils/icons";
import path from "../../../utils/path";
import renderRatingStar from "../../../utils/renderRatingStar";
import HoverOption from "../common/HoverOption";
import QuickView from "./QuickView";

const { AiFillEye, BsFillSuitHeartFill, FaCartPlus } = icons;

const ProductCard = ({ data, isNew, normal }) => {
	const [isShowOptions, setIsShowOptions] = useState(false);
	const [isShowQuickView, setIsShowQuickView] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { current } = useSelector((state) => state.user);

	const isFavorite = current?.wishlist?.some((item) => item._id === data._id);
	const handleClickOptions = async (e, type) => {
		e.preventDefault();
		e.stopPropagation();
		switch (type) {
			case "QUICK_VIEW":
				setIsShowQuickView(true);
				break;
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
							window.scrollTo(0, 0);
							navigate(`/${path.LOGIN}`, {
								state: `/products/${data.category.toLowerCase()}/${
									data._id
								}/${data.slug}`,
							});
						}
					});
					return;
				}
				try {
					const response = await apiUpdateWishlist(data._id);
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
							window.scrollTo(0, 0);
							navigate(`/${path.LOGIN}`, {
								state: `/products/${data.category.toLowerCase()}/${
									data._id
								}/${data.slug}`,
							});
						}
					});
					return;
				}
				try {
					if (data.stock <= 0) {
						Swal.fire({
							title: "Out of Stock",
							text: "This item is currently out of stock.",
							icon: "warning",
							confirmButtonText: "OK",
						});
						return;
					}
					const response = await apiUpdateCart({
						pid: data._id,
						color: data.color,
						quantity: 1,
						thumb: data.thumb,
						price: data.price,
						stock: data.stock,
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
		<div
			className="w-full h-full text-base border-2 border-gray-300 p-4 rounded-xl relative hover:border-main/80 transition-all duration-300 cursor-pointer overflow-hidden"
			onMouseEnter={() => setIsShowOptions(true)}
			onMouseLeave={() => setIsShowOptions(false)}>
			{isFavorite && (
				<div className="absolute left-4 top-4 z-99 flex justify-end">
					<BsFillSuitHeartFill
						size={22}
						color="red"
					/>
				</div>
			)}
			<Link
				to={`/products/${data.category.toLowerCase()}/${data._id}/${
					data.slug
				}`}
				className="display-block">
				<div className="relative">
					<div
						className={`absolute bottom-[-20px] left-0 right-0 flex justify-center gap-3 transition-all duration-200 ${
							isShowOptions
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-[20px]"
						}`}>
						<span
							title="Quick View"
							onClick={(e) =>
								handleClickOptions(e, "QUICK_VIEW")
							}>
							<HoverOption icon={<AiFillEye />} />
						</span>
						<span
							title="Add to Wishlist"
							onClick={(e) => handleClickOptions(e, "WISHLIST")}>
							<HoverOption
								icon={<BsFillSuitHeartFill />}
								isFavorite={isFavorite}
							/>
						</span>
						<span
							title="Add to Cart"
							onClick={(e) =>
								handleClickOptions(e, "ADD_TO_CART")
							}>
							<HoverOption icon={<FaCartPlus />} />
						</span>
					</div>
					<img
						src={
							data.thumb ||
							"https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png"
						}
						alt="image product"
						className="h-[243px] object-cover display-block mx-auto"
					/>
					{!normal && (
						<img
							src={isNew ? newLabel : trendingLabel}
							alt="label"
							className={`absolute top-[0px] right-[-17px] h-[30px] w-[90px] object-cover`}
						/>
					)}
				</div>
				<div className="flex flex-col gap-2 mt-8 border-t border-gray-500 pt-2">
					<p className="line-clamp-1">{data.title}</p>
					<span className="flex">
						{renderRatingStar(data.totalRatings)}
						<span className="text-xs text-gray-500 ml-1">
							({data.ratingCount || 0})
						</span>
					</span>

					<div>
						{data.originalPrice && (
							<p className="text-gray-400 text-xs line-through">
								{formatMoney(data.originalPrice)} VND
							</p>
						)}
						<div className="flex justify-between items-center mt-auto">
							<p className="text-main font-semibold">
								{formatMoney(data.price)} VND
							</p>
							<p className="text-[14px] text-black font-semibold">
								Sold: {data.sold}
							</p>
						</div>
					</div>
				</div>
			</Link>
			{isShowQuickView && (
				<div className="absolute top-0 left-0 right-0 h-full w-full">
					<QuickView
						data={data}
						onClose={() => setIsShowQuickView(false)}
					/>
				</div>
			)}
		</div>
	);
};

export default memo(ProductCard);
