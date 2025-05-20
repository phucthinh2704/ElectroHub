import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis";
import settings from "../utils/settingsSlider";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import { ShoppingBag } from "lucide-react";

const OthersProduct = ({ category }) => {
	const [relatedProducts, setRelatedProducts] = useState([]);
	useEffect(() => {
		const fetchRelatedProducts = async () => {
			try {
				const response = await apiGetProducts({ category });
				setRelatedProducts(response.products);
			} catch (error) {
				console.error("Error fetching related products:", error);
			}
		};
		fetchRelatedProducts();
	}, [category]);
	return (
		<div>
			<div className="mb-4 flex items-center">
				<ShoppingBag
					className="mr-3 text-indigo-600"
					size={24}
				/>
				<h2 className="text-2xl font-semibold">
					Customers Also Bought
				</h2>
			</div>
			<div className="mt-4">
				<Slider
					{...settings}
					slidesToShow={4}>
					{relatedProducts.map((product) => (
						<div
							key={product._id}
							className="bg-white overflow-hidden rounded-lg shadow-md p-2">
							<ProductCard
								data={product}
								isNew={false}
								normal
							/>
						</div>
					))}
				</Slider>
			</div>
		</div>
	);
};

export default OthersProduct;
