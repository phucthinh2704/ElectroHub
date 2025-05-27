import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Trophy } from "lucide-react";

const HotCollections = ({ categories }) => {
	return (
		<div>
			<div className="relative overflow-hidden rounded-lg shadow-sm bg-gradient-to-r from-red-50 to-white p-4 border-l-4 border-red-500 mb-3">
				<div className="flex items-center">
					<Trophy
						className="text-red-500 mr-3"
						size={22}
					/>
					<h3 className="text-xl font-bold uppercase text-gray-800">
						Hot Collections
					</h3>
				</div>
				<div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-red-100 rounded-full opacity-50"></div>
				<div className="absolute bottom-0 right-0 w-8 h-8 mb-1 mr-1 bg-red-100 rounded-full opacity-70"></div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
				{categories?.map((category) => (
					<div
						key={category._id}
						className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
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
								<Link
									to={`/products/${category.title.toLowerCase()}`}>
									View Collection
								</Link>
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(HotCollections);
