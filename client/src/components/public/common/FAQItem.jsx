import { ChevronDown } from "lucide-react";
import React, { memo } from "react";

const FAQItem = ({ item, index, toggleItem, openItems }) => {
	return (
		<div
			className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden hover:scale-105"
			style={{
				animationDelay: `${index * 0.1}s`,
			}}>
			<button
				onClick={() => toggleItem(item.id)}
				className="w-full px-6 py-6 text-left flex items-center justify-between group cursor-pointer">
				<h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
					{item.question}
				</h3>
				<ChevronDown
					className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
						openItems.has(item.id) ? "rotate-180 text-blue-600" : ""
					}`}
				/>
			</button>

			<div
				className={`overflow-hidden transition-all duration-500 ease-in-out cursor-pointer ${
					openItems.has(item.id)
						? "max-h-96 opacity-100"
						: "max-h-0 opacity-0"
				}`}>
				<div className="px-6 pb-6">
					<div className="h-px bg-gradient-to-r from-blue-200 to-indigo-200 mb-4"></div>
					<p className="text-gray-700 leading-relaxed">
						{item.answer}
					</p>
				</div>
			</div>
		</div>
	);
};

export default memo(FAQItem);
