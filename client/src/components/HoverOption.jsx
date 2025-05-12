import React from "react";

const HoverOption = ({ icon }) => {
	return <div	className="p-3 bg-gray-100 rounded-full shadow-lg hover:bg-[#4299E1] hover:text-white transition-all cursor-pointer">{icon}</div>;
};

export default HoverOption;
