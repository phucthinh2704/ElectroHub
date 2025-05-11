import React from "react";
import formatMoney from "../utils/formatMoney";
import newLabel from "../assets/new.png";
import trendingLabel from "../assets/trending.png";

const ProductCard = ({ data, isNew }) => {
	return (
		<div className="w-full text-base border border-main p-4">
			<div className="relative">
				<img
					src={data.thumb}
					alt="image product"
					className="h-[243px] object-cover"
				/>
				<img
					src={isNew ? newLabel : trendingLabel}
					alt="label"
					className={`absolute top-[0px] right-[-17px] h-[30px] w-[90px] object-cover`}
				/>
			</div>
			<div className="flex flex-col gap-2 mt-8">
				<p className="line-clamp-1">{data.title}</p>
				<p className="text-gray-700">{formatMoney(data.price)} VND</p>
			</div>
		</div>
	);
};

export default ProductCard;
