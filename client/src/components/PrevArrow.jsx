import { ChevronLeft } from "lucide-react";
import React from "react";

const PrevArrow = ({ onClick }) => {
	return (
		<div
			className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-11 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700
		  text-white shadow-lg transform transition-all duration-300 
		  hover:scale-105 hover:shadow-xl group overflow-hidden"
			onClick={onClick}>
			<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
			<ChevronLeft
				size={24}
				className="transition-transform duration-300 group-hover:translate-x-1"
			/>
		</div>
	);
};

export default PrevArrow;
