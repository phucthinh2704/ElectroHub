import { ArrowRight, CheckCircle } from "lucide-react";
import React, { memo } from "react";

const ServicesCard = ({ service }) => {
	return (
		<div className="group relative">
			<div
				className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
				style={{
					background: `linear-gradient(135deg, ${
						service.color.split(" ")[1]
					}, ${service.color.split(" ")[3]})`,
				}}></div>
			<div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 group-hover:border-white/80 h-full">
				<div
					className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
					{service.icon}
				</div>
				<h3 className="text-2xl font-bold text-gray-900 mb-4">
					{service.title}
				</h3>
				<p className="text-gray-600 mb-6 leading-relaxed">
					{service.description}
				</p>
				<ul className="space-y-3 mb-6">
					{service.features.map((feature, idx) => (
						<li
							key={idx}
							className="flex items-center text-sm text-gray-600">
							<CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
							{feature}
						</li>
					))}
				</ul>
				<button className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200 group/btn">
					Learn more
					<ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
				</button>
			</div>
		</div>
	);
};

export default memo(ServicesCard);
