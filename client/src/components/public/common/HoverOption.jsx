import React, { memo } from "react";

const HoverOption = ({ icon, isFavorite }) => {
	return (
		<div
			className={`p-3 ${
				isFavorite
					? "bg-red-100 text-main"
					: "bg-white hover:bg-[#4299E1] hover:text-white"
			} border border-gray-200 rounded-full shadow-lg transition-all cursor-pointer`}>
			{icon}
		</div>
	);
};

export default memo(HoverOption);
