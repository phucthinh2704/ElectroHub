import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import newLabel from "../../../assets/new.png";
import trendingLabel from "../../../assets/trending.png";
import formatMoney from "../../../utils/formatMoney";
import icons from "../../../utils/icons";
import renderRatingStar from "../../../utils/renderRatingStar";
import HoverOption from "../common/HoverOption";

const { AiFillEye, BsFillSuitHeartFill, IoMdMenu } = icons;

const ProductCard = ({ data, isNew, normal }) => {
	const [isShowOptions, setIsShowOptions] = useState(false);

	return (
		<div
			className="w-full text-base border-2 border-gray-300 p-4 rounded-2xl "
			onMouseEnter={() => setIsShowOptions(true)}
			onMouseLeave={() => setIsShowOptions(false)}>
			<Link
				to={`/products/${data.category.toLowerCase()}/${data._id}/${
					data.slug
				}`}
				className="display-block">
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
						src={
							data.thumb ||
							"https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png"
						}
						alt="image product"
						className="h-[243px] object-cover display-block mx-auto"
					/>
					{!normal && (
						<img
							src={isNew ? newLabel : trendingLabel}
							alt="label"
							className={`absolute top-[0px] right-[-17px] h-[30px] w-[90px] object-cover`}
						/>
					)}
				</div>
				<div className="flex flex-col gap-2 mt-8 border-t border-gray-500 pt-2">
					<p className="line-clamp-1">{data.title}</p>
					<span className="flex">
						{renderRatingStar(data.totalRatings)}
						<span className="text-xs text-gray-500 ml-1">
							({data.ratingCount || 0})
						</span>
					</span>

					<div>
						{data.originalPrice &&
							data.originalPrice > data.price && (
								<p className="text-gray-400 text-xs line-through">
									{formatMoney(data.originalPrice)} VND
								</p>
							)}
						<div className="flex justify-between items-center">
							<p className="text-main font-semibold">
								{formatMoney(data.price)} VND
							</p>
							<p className="text-[14px] text-black font-semibold">
								Sold: {data.sold}
							</p>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default memo(ProductCard);
