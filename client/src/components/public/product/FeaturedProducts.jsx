import { BadgeCheck } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { apiGetProducts } from "../../../apis";
import ProductFeaturedItem from "./ProductFeaturedItem";

const FeaturedProducts = () => {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		const fetchProducts = async () => {
			const response = await apiGetProducts({
				limit: 9,
				sort: "-totalRatings",
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
			<div className="grid grid-cols-3 gap-3">
				{products?.map((product) => (
					<ProductFeaturedItem
						key={product._id}
						product={product}
					/>
				))}
			</div>
			<div className="grid grid-cols-4 grid-rows-2 gap-2 mt-8">
				<img
					src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
					alt="Laptop Asus"
					className="w-full h-full object-cover col-span-2 row-span-2 rounded-lg shadow-sm border border-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out transform hover:shadow-lg hover:border-amber-500 cursor-pointer"
					loading="lazy"
					decoding="async"
				/>
				<img
					src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_600x.jpg?v=1613166661"
					alt="Samsung Gear S3"
					className="w-full h-full object-cover col-span-1 row-span-1 rounded-lg shadow-sm border border-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out transform hover:shadow-lg hover:border-amber-500 cursor-pointer"
					loading="lazy"
					decoding="async"
				/>
				<img
					src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
					alt="IPhone 16 Pro Max"
					className="w-full h-full object-cover col-span-1 row-span-2 rounded-lg shadow-sm border border-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out transform hover:shadow-lg hover:border-amber-500 cursor-pointer"
					loading="lazy"
					decoding="async"
				/>
				<img
					src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
					alt="Sales"
					className="w-full h-full object-cover col-span-1 row-span-1 rounded-lg shadow-sm border border-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out transform hover:shadow-lg hover:border-amber-500 cursor-pointer"
					loading="lazy"
					decoding="async"
				/>
			</div>
		</>
	);
};

export default memo(FeaturedProducts);
