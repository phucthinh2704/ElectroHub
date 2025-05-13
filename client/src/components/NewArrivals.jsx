import React from "react";
import Slider from "react-slick";
import settings from "../utils/settingsSlider";
import ProductCard from "./ProductCard";

const NewArrivals = ({ products }) => {
	return (
		<div>
			<h3 className="text-[22px] font-semibold uppercase pb-2 border-b-2 border-main">
				new arrivals
			</h3>
			<div className="my-4 -mx-2">
			   <Slider {...settings} slidesToShow={4}>
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
