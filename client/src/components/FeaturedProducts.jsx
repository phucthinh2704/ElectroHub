import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis";
import ProductFeaturedItem from "./ProductFeaturedItem";
import { BadgeCheck } from "lucide-react";

const FeaturedProducts = () => {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		const fetchProducts = async () => {
			const response = await apiGetProducts({
				limit: 9,
				totalRatings: 5,
			});
			if (response.success && response.products?.length > 0) {
				setProducts(response.products);
			}
		};
		fetchProducts();
	}, []);
	return (
		<>
			<div className="relative overflow-hidden rounded-lg shadow-sm bg-gradient-to-r from-amber-50 to-white p-4 border-l-4 border-amber-500 mb-2">
				<div className="flex items-center">
					<BadgeCheck
						className="text-amber-500 mr-3"
						size={22}
					/>
					<h3 className="text-xl font-bold uppercase text-gray-800">
						Featured Products
					</h3>
				</div>
				<div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-amber-100 rounded-full opacity-50"></div>
				<div className="absolute bottom-0 right-0 w-8 h-8 mb-1 mr-1 bg-amber-100 rounded-full opacity-70"></div>
			</div>
			<div className="grid grid-cols-3 gap-4">
				{products?.map((product) => (
					<ProductFeaturedItem
						key={product._id}
						product={product}
					/>
				))}
			</div>
			<div className="flex justify-evenly mt-8">
				<img
					src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
					alt=""
				/>
				<div className="flex flex-col justify-between">
					<img
						src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_600x.jpg?v=1613166661"
						alt=""
					/>
					<img
						src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
						alt=""
					/>
				</div>
				<img
					src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
					alt=""
				/>
			</div>
		</>
	);
};

export default FeaturedProducts;
