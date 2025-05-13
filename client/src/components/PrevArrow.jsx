import { ChevronLeft } from "lucide-react";
import React from "react";

const PrevArrow = ({ onClick }) => {
	return (
		<div
			className={`absolute left-4 top-1/2 -translate-y-1/2 bg-[#4299E1] backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-10 text-white hover:text-main hover:bg-[#eee] transition-all duration-300 shadow-lg`}
			onClick={onClick}>
			<ChevronLeft size={24} />
		</div>
	);
};

export default PrevArrow;
