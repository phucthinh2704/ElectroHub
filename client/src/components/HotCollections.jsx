import React from "react";
import { ChevronRight } from "lucide-react";

const HotCollections = ({ categories }) => {
	return (
		<div>
			<h3 className="text-[22px] font-semibold uppercase pb-2 mb-6 relative border-b-2 border-main">
				Hot Collections
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
				{categories?.map((category) => (
					<div
						key={category._id}
						className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
						<div className="p-4 flex flex-col items-center">
							{/* Image with hover effect */}
							<div className="w-full overflow-hidden mb-4 rounded-md flex justify-center items-center">
								<img
									src={category.image}
									alt={category.title}
									className="h-[180px] object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>

							<h4 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-main transition-all duration-300">
								{category.title}
							</h4>

							<div className="w-full">
								{category.brand?.map((item, index) => (
									<div
										key={index}
										className="flex items-center py-1.5 text-sm text-gray-600 transition-all duration-200 hover:text-main hover:translate-x-1">
										<ChevronRight
											size={16}
											className="text-gray-400 mr-1"
										/>
										<span className="hover:underline cursor-pointer">
											{item}
										</span>
									</div>
								))}
							</div>

							<button className="w-full mt-auto py-2 bg-gray-100 text-gray-700 rounded-md font-medium text-sm uppercase tracking-wide transition-all duration-200 hover:bg-main hover:text-white cursor-pointer">
								View Collection
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default HotCollections;
