import DOMPurify from "dompurify";
import { X } from "lucide-react";
import React, { memo } from "react";
import formatMoney from "../../../utils/formatMoney";
import renderRatingStar from "../../../utils/renderRatingStar";

const QuickView = ({ data, onClose }) => {

	return (
		<div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full h-full relative">
			{/* Header */}
			<div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 pt-4 text-white">
				<button
					className="absolute top-1/2 right-4 -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
					onClick={onClose}>
					<X size={24} />
				</button>

				<div>
					<div className="flex items-center gap-2 mb-1">
						<span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium uppercase">
							{data.category}
						</span>
					</div>
					<h2 className="p-1 text-[15px] font-semibold">
						{data.title}
					</h2>
				</div>
			</div>

			{/* Content */}
			<div className="p-3 overflow-y-auto h-full">
				{/* Image Section */}
				<div className="relative mb-4 group">
					<img
						src={data.thumb}
						alt={data.title}
						className="block mx-auto h-44 object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
					/>
				</div>

				{/* Rating Section */}
				<div className="flex items-center gap-2 mb-2">
					<div className="flex items-center gap-1">
						{renderRatingStar(data.totalRatings)}
					</div>
					<span className="text-gray-500">
						({data.ratingCount} reviews)
					</span>
				</div>

				{/* Description Section */}
				<div className="mb-4">
					<h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
						<div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
						Features & Description
					</h3>
					<div className="space-y-1">
						{data.description.map((item, index) => (
							<div
								key={index}
								className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
								<div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
								<p
									className="text-gray-700 leading-relaxed"
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(item),
									}}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Price Section */}
				<div className="bg-gradient-to-r from-gray-50 to-blue-100 p-2 rounded-xl mb-20">
					<div className="flex items-center justify-between">
						<div>
							<div className="flex items-center gap-3">
								<span className="text-lg font-semibold text-gray-800">
									{formatMoney(data.price)} đ
								</span>
								{data.originalPrice && (
									<span className="text-sm text-gray-500 line-through">
										{formatMoney(data.originalPrice)} đ
									</span>
								)}
							</div>
							{data.originalPrice && (
								<span className="text-green-600 font-semibold text-sm">
									Save{" "}
									<span className="text-red-500">
										{formatMoney(
											data.originalPrice - data.price
										)}{" "}
									</span>
									(
									{Math.round(
										((data.originalPrice - data.price) /
											data.originalPrice) *
											100
									)}
									% off)
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(QuickView);
