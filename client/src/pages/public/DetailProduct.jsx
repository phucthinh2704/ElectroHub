import DOMPurify from "dompurify";
import {
	Heart,
	Loader2,
	RotateCcw,
	Share2,
	Shield,
	ShoppingCart,
	Truck,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
	apiGetProductById,
	apiUpdateCart,
	apiUpdateWishlist,
} from "../../apis";
import {
	Breadcrumbs,
	InformationDetail,
	OthersProduct,
	RatingsReview,
} from "../../components";
import { getCurrent } from "../../store/user/asyncAction";
import formatMoney from "../../utils/formatMoney";
import path from "../../utils/path";
import renderRatingStar from "../../utils/renderRatingStar";
import settings from "../../utils/settingsSlider";

const DetailProduct = () => {
	const { productId } = useParams();
	const dispatch = useDispatch();
	const [product, setProduct] = useState({});
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [variant, setVariant] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(true);
	const { current } = useSelector((state) => state.user);
	const navigate = useNavigate();

	const fetchProduct = useCallback(async () => {
		setLoading(true);
		try {
			const response = await apiGetProductById({ pid: productId });
			setProduct(response.product);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching product:", error);
			setLoading(false);
		}
	}, [productId]);

	useEffect(() => {
		fetchProduct();
		document.title = `${product.title || "Loading..."}`;
	}, [fetchProduct, product]);

	const handleReviewSubmitted = () => {
		// Refresh product data sau khi submit review
		fetchProduct();
	};

	useEffect(() => {
		if (variant?.stock <= 0 || product.stock <= 0) {
			setQuantity(0);
		}
	}, [product.stock, variant?.stock]);

	const discountPercentage = product.discount ? product.discount : 0;

	const handleQuantityChange = (change) => {
		const newQuantity = quantity + change;
		if (variant) {
			if (newQuantity >= 1 && newQuantity <= variant.stock) {
				setQuantity(newQuantity);
			}
		} else {
			if (newQuantity >= 1 && newQuantity <= product.stock) {
				setQuantity(newQuantity);
			}
		}
	};

	const handleImageChange = (index) => {
		setCurrentImageIndex(index);
	};

	const handleUpdateWishlist = async () => {
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
				toast.error(response.message || "Failed to update wishlist");
			}
		} catch (error) {
			console.log("Error adding to wishlist:", error);
			toast.error("Failed to add to wishlist. Please try again later.");
		}
	};

	const handleAddToCart = async () => {
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
		if (variant) {
			try {
				if (variant.stock <= 0) {
					toast.error("This variant of product is out of stock");
					return;
				}
				const response = await apiUpdateCart({
					pid: product._id,
					color: variant.color,
					quantity,
					thumb: variant.thumb,
					price: variant.price,
					stock: variant.stock,
				});
				if (response.success) {
					toast.success(response.message);
					dispatch(getCurrent());
				} else {
					Swal.fire({
						title: "Error",
						text:
							response.message || "Failed to add product to cart",
						icon: "error",
					});
				}
			} catch (error) {
				console.error("Error adding to cart:", error);
				Swal.fire({
					title: "Error",
					text: "Failed to add product to cart. Please try again later.",
					icon: "error",
				});
				return;
			}
		} else {
			try {
				if (product.stock <= 0) {
					toast.error("This product is out of stock");
					return;
				}
				const response = await apiUpdateCart({
					pid: product._id,
					color: product.color,
					quantity,
					thumb: product.thumb,
					price: product.price,
					stock: product.stock,
				});
				if (response.success) {
					toast.success(response.message);
					dispatch(getCurrent());
				} else {
					Swal.fire({
						title: "Error",
						text:
							response.message || "Failed to add product to cart",
						icon: "error",
					});
				}
			} catch (error) {
				console.error("Error adding to cart:", error);
				Swal.fire({
					title: "Error",
					text: "Failed to add product to cart. Please try again later.",
					icon: "error",
				});
				return;
			}
		}
	};

	return (
		<div className="bg-gray-100 min-h-screen py-2">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Breadcrumbs */}
				<div className="mb-2 bg-white rounded-lg">
					<nav className="flex items-center text-sm font-medium text-gray-500 ml-2">
						<Breadcrumbs
							title={product.title?.toUpperCase()}
							category={product.category?.toUpperCase()}></Breadcrumbs>
					</nav>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-16">
						<Loader2
							size={40}
							className="animate-spin text-main"
						/>
					</div>
				) : (
					<>
						<div className="bg-white rounded-xl shadow-lg overflow-hidden">
							<div className="md:flex">
								{/* Product Images Section */}
								<div className="md:w-1/2 p-6">
									<div className="relative w-full rounded-lg mb-10">
										{variant ? (
											variant.images && (
												<Zoom>
													<img
														src={
															variant.images[
																currentImageIndex
															] || variant.thumb
														}
														alt={product.title}
														loading="lazy"
														decoding="async"
														className="h-[560px] object-contain display-block mx-auto"
													/>
												</Zoom>
											)
										) : product.images ? (
											<Zoom>
												<img
													src={
														product.images[
															currentImageIndex
														] || product.thumb
													}
													alt={product.title}
													loading="lazy"
													decoding="async"
													className="h-[560px] object-contain display-block mx-auto"
												/>
											</Zoom>
										) : (
											<div className="w-full h-full bg-gray-200 flex items-center justify-center">
												<span className="text-gray-400">
													No image available
												</span>
											</div>
										)}
									</div>

									{/* Thumbnail Gallery */}
									{variant ? (
										variant.images.length > 2 ? (
											<Slider
												{...settings}
												slidesToShow={3}>
												{variant.images.map(
													(image, index) => (
														<div
															key={image}
															className={`aspect-square h-[140px] rounded-md overflow-hidden cursor-pointer border-2 ${
																currentImageIndex ===
																index
																	? "border-blue-500"
																	: "border-gray-300"
															}`}
															onClick={() =>
																handleImageChange(
																	index
																)
															}>
															<img
																src={image}
																alt={`${
																	product.title
																} thumbnail ${
																	index + 1
																}`}
																loading="lazy"
																decoding="async"
																className="h-full object-contain display-block mx-auto"
															/>
														</div>
													)
												)}
											</Slider>
										) : (
											<>
												{variant.images.map(
													(image, index) => (
														<div
															key={image}
															className={`aspect-square h-[140px] rounded-md overflow-hidden cursor-pointer border-2 ${
																currentImageIndex ===
																index
																	? "border-blue-500"
																	: "border-gray-300"
															}`}
															onClick={() =>
																handleImageChange(
																	index
																)
															}>
															<img
																src={image}
																alt={`${
																	product.title
																} thumbnail ${
																	index + 1
																}`}
																loading="lazy"
																decoding="async"
																className="h-full object-contain display-block mx-auto"
															/>
														</div>
													)
												)}{" "}
											</>
										)
									) : product.images &&
									  product.images.length > 2 ? (
										<Slider
											{...settings}
											slidesToShow={3}>
											{product.images.map(
												(image, index) => (
													<div
														key={image}
														className={`aspect-square h-[140px] rounded-md overflow-hidden cursor-pointer border-2 ${
															currentImageIndex ===
															index
																? "border-blue-500"
																: "border-gray-300"
														}`}
														onClick={() =>
															handleImageChange(
																index
															)
														}>
														<img
															src={image}
															alt={`${
																product.title
															} thumbnail ${
																index + 1
															}`}
															loading="lazy"
															decoding="async"
															className="h-full object-contain display-block mx-auto"
														/>
													</div>
												)
											)}
										</Slider>
									) : (
										<>
											{product.images.map(
												(image, index) => (
													<div
														key={image}
														className={`aspect-square h-[140px] rounded-md overflow-hidden cursor-pointer border-2 ${
															currentImageIndex ===
															index
																? "border-blue-500"
																: "border-gray-300"
														}`}
														onClick={() =>
															handleImageChange(
																index
															)
														}>
														<img
															src={image}
															alt={`${
																product.title
															} thumbnail ${
																index + 1
															}`}
															loading="lazy"
															decoding="async"
															className="h-full object-contain display-block mx-auto"
														/>
													</div>
												)
											)}{" "}
										</>
									)}
								</div>
								{/* Product Info Section */}
								<div className="md:w-1/2 p-6 md:border-l border-gray-200">
									<div className="flex items-center mb-2">
										<span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
											{product.brand}
										</span>
										{product.sold > 50 && (
											<span className="bg-orange-100 text-orange-800 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded">
												Best Seller
											</span>
										)}
									</div>

									<h1 className="text-3xl font-bold mb-2">
										{product.title}
									</h1>
									<div className="flex items-center gap-1">
										{renderRatingStar(
											product.totalRatings,
											20
										)}
										<span className="text-sm text-gray-600 ml-2">
											({product.ratingCount}{" "}
											{product.ratingCount === 1
												? "Review"
												: "Reviews"}
											)
										</span>
									</div>

									<div className="mt-4 mb-6">
										<div className="flex items-center">
											<span className="text-3xl font-semibold">
												{variant
													? formatMoney(variant.price)
													: formatMoney(
															product.price
													  )}{" "}
												đ
											</span>
											{discountPercentage > 0 && (
												<span className="ml-3 text-lg text-gray-500 line-through">
													{formatMoney(
														product.originalPrice
													)}{" "}
													đ
												</span>
											)}
											{discountPercentage > 0 && (
												<span className="ml-3 bg-red-100 text-red-800 text-sm font-semibold px-2.5 py-0.5 rounded">
													Save {discountPercentage}%
												</span>
											)}
										</div>
										<p className="text-gray-500">
											Sold:{" "}
											{variant
												? variant.sold
												: product.sold}
										</p>
										<p className="text-gray-500">
											In Stock:{" "}
											{variant
												? variant.stock
												: product.stock}
										</p>
									</div>

									{/* Product Description */}
									<div className="border-t border-b border-gray-200 py-4 my-4">
										<h3 className="text-2xl font-semibold mb-2">
											Description
										</h3>
										<ul className="space-y-1 text-gray-600 overflow-y-auto max-h-80">
											{Array.isArray(
												product.description
											) ? (
												product.description.map(
													(desc, index) => (
														<li
															key={index}
															className="flex items-start">
															<span className="mr-2 mt-1 text-blue-500">
																•
															</span>
															<span
																dangerouslySetInnerHTML={{
																	__html: DOMPurify.sanitize(
																		desc
																	),
																}}
															/>
														</li>
													)
												)
											) : (
												<li>{product.description}</li>
											)}
										</ul>
									</div>

									{/* Color */}
									{product.color && (
										<div className="mb-4 min-w-xl">
											<h3 className="text-sm font-medium text-gray-900 mb-2">
												Color
											</h3>
											<div className="grid grid-cols-2 gap-2">
												<div
													className={`border relative border-gray-300 rounded-xl flex items-center gap-2 py-2 px-3 cursor-pointer ${
														!variant
															? "border-blue-500 bg-blue-100 shadow-md"
															: "border-gray-200 bg-white hover:border-gray-300"
													}`}
													onClick={() =>
														setVariant(null)
													}>
													<img
														src={product.thumb}
														alt={product.title}
														className="w-12 h-12 object-contain rounded-lg"
														loading="lazy"
														decoding="async"
													/>
													<div>
														<span className="font-semibold">
															{product.color}
														</span>
														<p>
															{formatMoney(
																product.price
															)}{" "}
															đ
														</p>
													</div>
													{!variant && (
														<div className="absolute top-2 right-2">
															<div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
																<svg
																	className="w-2.5 h-2.5 text-white"
																	fill="currentColor"
																	viewBox="0 0 20 20">
																	<path
																		fillRule="evenodd"
																		d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																		clipRule="evenodd"
																	/>
																</svg>
															</div>
														</div>
													)}
												</div>
												{product.variants &&
													product.variants.map(
														(variantItem) => (
															<div
																key={
																	variantItem.sku
																}
																onClick={() =>
																	setVariant(
																		variantItem
																	)
																}
																className={`relative border border-gray-300 rounded-xl flex items-center gap-4 py-2 px-4 cursor-pointer ${
																	variantItem.sku ===
																	variant?.sku
																		? "border-blue-500 bg-blue-100 shadow-md"
																		: "border-gray-200 bg-white hover:border-gray-300"
																}`}>
																<img
																	src={
																		variantItem.thumb
																	}
																	alt={
																		product.title
																	}
																	className="w-12 h-12 object-contain rounded-lg"
																	loading="lazy"
																	decoding="async"
																/>
																<div>
																	<span className="font-semibold">
																		{
																			variantItem.color
																		}
																	</span>
																	<p>
																		{formatMoney(
																			variantItem.price
																		)}{" "}
																		đ
																	</p>
																</div>
																{variant &&
																	variant.sku ===
																		variantItem.sku && (
																		<div className="absolute top-2 right-2">
																			<div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
																				<svg
																					className="w-2.5 h-2.5 text-white"
																					fill="currentColor"
																					viewBox="0 0 20 20">
																					<path
																						fillRule="evenodd"
																						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																						clipRule="evenodd"
																					/>
																				</svg>
																			</div>
																		</div>
																	)}
															</div>
														)
													)}
											</div>
										</div>
									)}

									{/* Quantity */}
									<div className="mb-6">
										<h3 className="text-sm font-medium text-gray-900 mb-2">
											Quantity
										</h3>
										<div className="flex items-center">
											<button
												onClick={() =>
													handleQuantityChange(-1)
												}
												className="text-gray-500 focus:outline-none focus:text-gray-600 p-1 cursor-pointer">
												<svg
													className="h-5 w-5"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													viewBox="0 0 24 24"
													stroke="currentColor">
													<path d="M20 12H4"></path>
												</svg>
											</button>
											<span className="mx-4 text-gray-700">
												{quantity}
											</span>
											<button
												onClick={() =>
													handleQuantityChange(1)
												}
												className="text-gray-500 focus:outline-none focus:text-gray-600 p-1 cursor-pointer">
												<svg
													className="h-5 w-5"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													viewBox="0 0 24 24"
													stroke="currentColor">
													<path d="M12 4v16m8-8H4"></path>
												</svg>
											</button>
										</div>
										<p className="text-sm text-gray-500 mt-1">
											{variant
												? variant.stock
												: product.stock}{" "}
											items available
										</p>
									</div>

									{/* Action Buttons */}
									<div className="flex flex-col space-y-3">
										<button
											className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center cursor-pointer"
											onClick={handleAddToCart}>
											<ShoppingCart className="mr-2 h-5 w-5" />
											Add to Cart
										</button>

										<div className="grid grid-cols-2 gap-3">
											<button
												onClick={handleUpdateWishlist}
												className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center cursor-pointer">
												{current?.wishlist?.some(
													(productItem) =>
														productItem._id ===
														product._id
												) ? (
													<Heart
														className="mr-2 h-5 w-5"
														fill="red"
														color="red"
													/>
												) : (
													<Heart className="mr-2 h-5 w-5" />
												)}
												Wishlist
											</button>
											<button className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center cursor-pointer">
												<Share2 className="mr-2 h-5 w-5" />
												Share
											</button>
										</div>
									</div>

									{/* Delivery Info */}
									<div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
										<div className="flex flex-col items-center">
											<Truck className="h-6 w-6 text-blue-500 mb-2" />
											<p className="font-medium">
												Free Delivery
											</p>
										</div>
										<div className="flex flex-col items-center">
											<Shield className="h-6 w-6 text-blue-500 mb-2" />
											<p className="font-medium">
												2 Year Warranty
											</p>
										</div>
										<div className="flex flex-col items-center">
											<RotateCcw className="h-6 w-6 text-blue-500 mb-2" />
											<p className="font-medium">
												30-day Return
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-8">
							<InformationDetail
								description={product.description}
							/>
						</div>
						<div className="mt-8">
							<RatingsReview
								product={product}
								onReviewSubmitted={handleReviewSubmitted}
							/>
						</div>
						<div className="mt-10">
							<OthersProduct category={product.category} />
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default DetailProduct;
