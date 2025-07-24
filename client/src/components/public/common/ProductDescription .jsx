import DOMPurify from "dompurify";
import { memo } from "react";

const ProductDescription = ({ description }) => {
	const formatDescription = (desc) => {
		if (!desc) return [];

		if (Array.isArray(desc)) {
			return desc.filter((item) => item && item.trim() !== "");
		}

		if (typeof desc === "string") {
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = desc;
			const paragraphs = tempDiv.querySelectorAll("p");

			return Array.from(paragraphs)
				.map((p) => p.textContent.trim())
				.filter((text) => text !== "");
		}

		return [];
	};

	const descriptionArray = formatDescription(description);

	if (descriptionArray.length === 0) {
		return (
			<div className="bg-gray-50 rounded-lg p-4 my-4">
				<p className="text-gray-500 italic text-center">
					No description available
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 my-4">
			<h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
				<svg
					className="w-6 h-6 mr-2 text-blue-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				Description
			</h3>
			<div className="space-y-4 max-h-80 overflow-y-auto">
				{descriptionArray.map((desc, index) => (
					<div
						key={index}
						className="flex items-start group">
						<div className="mr-4 mt-2">
							<div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
						</div>
						<p
							className="text-gray-700 leading-relaxed flex-1 group-hover:text-gray-900 transition-colors duration-200"
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(desc),
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
};
export default memo(ProductDescription);
