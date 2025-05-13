import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis";
import ProductFeaturedItem from "./ProductFeaturedItem";

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
			<h3 className="text-[22px] mb-6 font-semibold uppercase pb-2 border-b-2 border-main">
				Featured products
			</h3>
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
