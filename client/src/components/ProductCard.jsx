import React, { useState } from "react";
import formatMoney from "../utils/formatMoney";
import newLabel from "../assets/new.png";
import trendingLabel from "../assets/trending.png";
import renderRatingStar from "../utils/renderRatingStar";
import HoverOption from "./HoverOption";
import icons from "../utils/icons";

const { AiFillEye, BsFillSuitHeartFill, IoMdMenu } = icons;

const ProductCard = ({ data, isNew }) => {
	const [isShowOptions, setIsShowOptions] = useState(false);

	return (
		<div
			className="w-full text-base border border-main p-4"
			onMouseEnter={() => setIsShowOptions(true)}
			onMouseLeave={() => setIsShowOptions(false)}>
			<div className="relative">
				<div
					className={`absolute bottom-[-20px] left-0 right-0 flex justify-center gap-3 transition-all duration-200 ${
						isShowOptions
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-[20px]"
					}`}>
					<HoverOption icon={<AiFillEye />} />
					<HoverOption icon={<BsFillSuitHeartFill />} />
					<HoverOption icon={<IoMdMenu />} />
				</div>
				<img
					src={data.thumb || "https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png"}
					alt="image product"
					className="h-[243px] object-cover"
				/>
				<img
					src={isNew ? newLabel : trendingLabel}
					alt="label"
					className={`absolute top-[0px] right-[-17px] h-[30px] w-[90px] object-cover`}
				/>
			</div>
			<div className="flex flex-col gap-2 mt-8 border-t border-gray-400 pt-2">
				<p className="line-clamp-1">{data.title}</p>
				<span className="flex">
					{renderRatingStar(data.totalRatings)}
				</span>
				<p className="text-gray-700">{formatMoney(data.price)} VND</p>
			</div>
		</div>
	);
};

export default ProductCard;
