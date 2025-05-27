import {
	Heart,
	Loader2,
	RotateCcw,
	Share2,
	Shield,
	ShoppingCart,
	Truck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { apiGetProductById } from "../../apis";
import {
	Breadcrumbs,
	InformationDetail,
	OthersProduct,
	RatingsReview,
} from "../../components";
import renderRatingStar from "../../utils/renderRatingStar";
import formatMoney from "../../utils/formatMoney";
import Slider from "react-slick";
import settings from "../../utils/settingsSlider";

const DetailProduct = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState({});
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(true);

	const fetchProduct = async () => {
		setLoading(true);
		try {
			const response = await apiGetProductById({ pid: productId });
			setProduct(response.product);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching product:", error);
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchProduct();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleReviewSubmitted = () => {
		// Refresh product data sau khi submit review
		fetchProduct();
	};

	// Calculate discount percentage
	const discountPercentage = product.discount ? product.discount : 0;

	// Handle quantity change
	const handleQuantityChange = (change) => {
		const newQuantity = quantity + change;
		if (newQuantity >= 1 && newQuantity <= product.stock) {
			setQuantity(newQuantity);
		}
	};

	// Change the current image
	const handleImageChange = (index) => {
		setCurrentImageIndex(index);
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
										{product.images ? (
											<Zoom>
												<img
													src={
														product.images[
															currentImageIndex
														] || product.thumb
													}
													alt={product.title}
													className="h-[500px] object-contain display-block mx-auto"
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
									{product.images &&
										product.images.length > 0 && (
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
																className="h-full object-contain display-block mx-auto"
															/>
														</div>
													)
												)}
											</Slider>
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
												{formatMoney(product.price)} đ
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
											Sold: {product.sold}
										</p>
									</div>

									{/* Product Description */}
									<div className="border-t border-b border-gray-200 py-4 my-4">
										<h3 className="text-lg font-semibold mb-2">
											Description
										</h3>
										<ul className="space-y-1 text-gray-600">
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
															<span>{desc}</span>
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
										<div className="mb-4">
											<h3 className="text-sm font-medium text-gray-900 mb-2">
												Color
											</h3>
											<div className="flex items-center">
												<div
													className="h-8 w-8 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center"
													style={{
														backgroundColor:
															product.color.toLowerCase(),
													}}>
													<span className="sr-only">
														{product.color}
													</span>
												</div>
												<span className="ml-2 text-sm text-gray-700">
													{product.color}
												</span>
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
											{product.stock} items available
										</p>
									</div>

									{/* Action Buttons */}
									<div className="flex flex-col space-y-3">
										<button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center cursor-pointer">
											<ShoppingCart className="mr-2 h-5 w-5" />
											Add to Cart
										</button>

										<div className="grid grid-cols-2 gap-3">
											<button className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center cursor-pointer">
												<Heart className="mr-2 h-5 w-5" />
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
							<InformationDetail />
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
