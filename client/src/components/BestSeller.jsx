import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import { apiGetProducts } from "../apis";
import ProductCard from "./ProductCard";

const BestSeller = () => {
	const [bestSeller, setBestSeller] = useState([]);
	const [newProducts, setNewProducts] = useState([]);
	const [activeTab, setActiveTab] = useState(1);

	const tabs = [
		{
			id: 1,
			name: "Best Seller",
		},
		{
			id: 2,
			name: "New Arrivals",
		},
	];

	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
	};

	useEffect(() => {
		const fetchProducts = async () => {
			const [bestSeller, newProducts] = await Promise.all([
				apiGetProducts({ sort: "-sold" }),
				apiGetProducts({ sort: "-createdAt" }),
			]);

			if (!bestSeller.success || !newProducts.success) {
				return alert("Error fetching products");
			}
			setBestSeller(bestSeller);
			setNewProducts(newProducts);
		};
		fetchProducts();
	}, []);

	const renderProducts = () => {
		if (activeTab === 1 && bestSeller.success) {
			return bestSeller.products.map((product) => (
				<div key={product._id} className="">
					<ProductCard data={product} />
				</div>
			));
		}
		if (activeTab === 2 && newProducts.success) {
			return newProducts.products.map((product) => (
				<div key={product._id} className="">
					<ProductCard data={product} isNew />
				</div>
			));
		}
		return null;
	};

	return (
		<div>
			<nav className="flex items-center text-[20px] border-b-2 border-main">
				{tabs.map((tab, index) => (
					<>
						<p
							key={tab.id}
							className={`font-semibold uppercase px-3 py-2 cursor-pointer ${
								activeTab === tab.id
									? "text-black"
									: "text-gray-400"
							}`}
							onClick={() => setActiveTab(tab.id)}>
							{tab.name}
						</p>
						{index < tabs.length - 1 && (
							<div className="h-6 w-[1px] bg-gray-300"></div>
						)}
					</>
				))}
			</nav>
			<div className="mt-4 -mx-2">
				<Slider {...settings}>
					{renderProducts()}
				</Slider>
			</div>
		</div>
	);
};

export default BestSeller;
