import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import { apiGetProducts } from "../apis";
import ProductCard from "./ProductCard";
import NextArrow from "./NextArrow";
import PrevArrow from "./PrevArrow";

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
		speed: 800,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
		// fade: true,
		cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
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
				<div
					key={product._id}
					className="">
					<ProductCard data={product} />
				</div>
			));
		}
		if (activeTab === 2 && newProducts.success) {
			return newProducts.products.map((product) => (
				<div
					key={product._id}
					className="">
					<ProductCard
						data={product}
						isNew
					/>
				</div>
			));
		}
		return null;
	};

	return (
		<div>
			<nav className="flex items-center text-[20px] border-b-2 border-main">
				{tabs.map((tab, index) => (
					<React.Fragment key={tab.id}>
						<p
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
					</React.Fragment>
				))}
			</nav>
			<div className="mt-4 -mx-2">
				<Slider {...settings}>{renderProducts()}</Slider>
			</div>
			<div className="w-full flex mt-4 gap-4">
				<img
					src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
					alt=""
					className="flex-1 object-contain"
				/>
				<img
					src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
					alt=""
					className="flex-1 object-contain"
				/>
			</div>
		</div>
	);
};

export default BestSeller;
