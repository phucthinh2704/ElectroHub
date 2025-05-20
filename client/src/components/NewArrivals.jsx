import React from "react";
import Slider from "react-slick";
import settings from "../utils/settingsSlider";
import ProductCard from "./ProductCard";
import { PackagePlus } from "lucide-react";

const NewArrivals = ({ products }) => {
	return (
		<div>
			<div className="relative overflow-hidden rounded-lg shadow-sm bg-gradient-to-r from-cyan-50 to-white p-4 border-l-4 border-cyan-500 mb-2">
				<div className="flex items-center">
					<PackagePlus
						className="text-cyan-500 mr-3"
						size={22}
					/>
					<h3 className="text-xl font-bold uppercase text-gray-800">
						New Arrivals
					</h3>
				</div>
				<div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-cyan-100 rounded-full opacity-50"></div>
				<div className="absolute bottom-0 right-0 w-8 h-8 mb-1 mr-1 bg-cyan-100 rounded-full opacity-70"></div>
			</div>
			<div className="-mx-2 pb-2">
				<Slider
					{...settings}
					slidesToShow={4}>
					{products.map((product) => (
						<div
							key={product._id}
							className="">
							<ProductCard
								data={product}
								isNew
							/>
						</div>
					))}
				</Slider>
			</div>
		</div>
	);
};

export default NewArrivals;
