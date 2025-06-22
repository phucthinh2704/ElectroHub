import { Loader2, Star, TrendingUp } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import Slider from "react-slick";

import { apiGetProducts } from "../../../apis";
import settings from "../../../utils/settingsSlider";
import ProductCard from "../product/ProductCard";
import { Link } from "react-router-dom";

const BestSeller = () => {
	const [products, setProducts] = useState({
		bestSeller: [],
		newArrivals: [],
	});
	const [activeTab, setActiveTab] = useState(1);
	const [loading, setLoading] = useState(true);

	const tabs = [
		{
			id: 1,
			name: "Best Seller",
			icon: <TrendingUp size={18} />,
			color: "#ee3131",
		},
		{
			id: 2,
			name: "New Arrivals",
			icon: <Star size={18} />,
			color: "#4f46e5",
		},
	];

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);

			try {
				const [bestSellerResponse, newProductsResponse] =
					await Promise.all([
						apiGetProducts({ sort: "-sold", limit: 10 }),
						apiGetProducts({ sort: "-createdAt", limit: 10 }),
					]);

				if (
					!bestSellerResponse.success ||
					!newProductsResponse.success
				) {
					throw new Error("Failed to fetch products");
				}

				setProducts({
					bestSeller: bestSellerResponse,
					newArrivals: newProductsResponse,
				});
				setLoading(false);
			} catch (err) {
				console.log(`Failed to fetch products`, err);
			}
		};

		fetchProducts();
	}, []);

	const renderProducts = () => {
		const currentProducts =
			activeTab === 1
				? products.bestSeller?.products
				: products.newArrivals?.products;

		return currentProducts.map((product) => (
			<div
				key={product._id}
				className="px-2">
				<ProductCard
					data={product}
					isNew={activeTab === 2}
				/>
			</div>
		));
	};

	return (
		<div>
			<nav className="flex items-center text-[20px] border-b-2 border-gray-300">
				{tabs.map((tab, index) => (
					<React.Fragment key={tab.id}>
						<div
							className={`font-semibold uppercase px-5 py-3 cursor-pointer flex items-center gap-2 transition-all duration-300 relative ${
								activeTab === tab.id
									? "text-main"
									: "text-gray-500 hover:text-gray-700"
							}`}
							onClick={() => setActiveTab(tab.id)}>
							{tab.icon}
							{tab.name}
							{activeTab === tab.id && (
								<span
									className="absolute bottom-0 left-0 w-full h-[3px] bg-main"
									style={{
										transform: "translateY(2px)",
									}}
								/>
							)}
						</div>
						{index < tabs.length - 1 && (
							<div className="h-6 w-[1px] bg-gray-300"></div>
						)}
					</React.Fragment>
				))}
			</nav>
			<div className="mt-4 -mx-3">
				{loading ? (
					<div className="flex items-center justify-center py-16">
						<Loader2
							size={40}
							className="animate-spin text-main"
						/>
					</div>
				) : (
					<Slider
						{...settings}
						slidesToShow={3}>
						{renderProducts()}
					</Slider>
				)}
			</div>
			<div className="w-full flex justify-between mt-2 gap-2">
				<Link
					className="flex-1"
					to={`/products/laptop/682348a77df1af2f6077893d/dell-inspiron-7460-q7xh6dt7`}>
					<img
						src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
						alt="Laptop Dell Inspiron 7460"
						className="object-contain w-full"
						loading="lazy"
						decoding="async"
					/>
				</Link>
				<Link
					className="flex-1"
					to={`/products/laptop/682348a77df1af2f60778941/apple-macbook-pro-13"`}>
					<img
						src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
						alt="Laptop Apple MacBook Pro 13"
						className="object-contain w-full"
						loading="lazy"
						decoding="async"
					/>
				</Link>
			</div>
		</div>
	);
};

export default memo(BestSeller);
