import { ShoppingBag } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import Slider from "react-slick";
import { apiGetProducts } from "../../../apis";
import settings from "../../../utils/settingsSlider";
import ProductCard from "../product/ProductCard";
import { useParams } from "react-router-dom";

const OthersProduct = ({ category }) => {
	const [relatedProducts, setRelatedProducts] = useState([]);
	const { productId } = useParams();
	useEffect(() => {
		const fetchRelatedProducts = async () => {
			try {
				const response = await apiGetProducts({ category });
				setRelatedProducts(
					response.products
						.map((product) => {
							if (product._id === productId) return null; // Exclude the current product
							return product;
						})
						.filter(Boolean)
				); // Filter out null values
			} catch (error) {
				console.error("Error fetching related products:", error);
			}
		};
		fetchRelatedProducts();
	}, [category, productId]);

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
				{relatedProducts.length === 0 ? (
					<div className="text-center text-gray-700 bg-white rounded-lg p-4 shadow-md">
						<p>No related products found.</p>
					</div>
				) : relatedProducts.length > 4 ? (
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
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(OthersProduct);
