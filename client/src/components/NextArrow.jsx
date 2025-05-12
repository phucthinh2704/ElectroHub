import { ChevronRight } from "lucide-react";
import React from "react";

const NextArrow = ({ bg = "yellow-400/50", onClick }) => {
	return (
		<div
			className={`absolute right-4 top-1/2 -translate-y-1/2 bg-[#4299E1] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-10 text-white hover:text-main  hover:bg-${bg} transition-all duration-300 shadow-lg`}
			onClick={onClick}>
			<ChevronRight size={24} />
		</div>
	);
};
export default NextArrow;
