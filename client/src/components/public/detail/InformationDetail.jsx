import { memo, useEffect, useState } from "react";
import { tabsDetail } from "../../../utils/constants";
import formatContent from "../../../utils/formatContent";

const InformationDetail = ({ description = [] }) => {
	const [activeTab, setActiveTab] = useState(tabsDetail[0].id);
	const [animateContent, setAnimateContent] = useState(false);

	// Add animation when changing tabs
	useEffect(() => {
		setAnimateContent(false);
		const timer = setTimeout(() => {
			setAnimateContent(true);
		}, 150);
		return () => clearTimeout(timer);
	}, [activeTab]);

	const getActiveTabContent = () => {
		const tab = tabsDetail.find((tab) => tab.id === activeTab);
		if (tab?.title === "DESCRIPTION") {
			return formatContent(description);
		}
		return tab ? formatContent(tab.content) : [];
	};

	const activeTabInfo = tabsDetail.find((tab) => tab.id === activeTab);

	return (
		<div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
			{/* Modern Tab Navigation */}
			<div className="bg-gray-50 border-b border-gray-300">
				<div className="grid grid-cols-4 gap-2 p-4">
					{tabsDetail.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`
                group relative flex items-center justify-center gap-3 px-4 py-6 rounded-xl font-medium               transition-all duration-300 ease-out cursor-pointer
                ${
					activeTab === tab.id
						? "bg-white text-blue-600 shadow-md ring-2 ring-blue-100 border border-blue-400"
						: "text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:shadow-md border border-gray-300"
				}
              `}>
							<div
								className={`
                  transition-transform duration-300
                  ${
						activeTab === tab.id
							? "scale-110"
							: "group-hover:scale-105"
					}
                `}>
								{tab.icon}
							</div>
							<span className="font-semibold">{tab.title}</span>

							{/* Active indicator */}
							{activeTab === tab.id && (
								<div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Tab Content with Enhanced Animation */}
			<div className="relative overflow-hidden">
				<div
					className={`
            p-8 transition-all duration-500 ease-out
            ${
				animateContent
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-4"
			}
          `}>
					{/* Content Header */}
					<div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
						<div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
							{activeTabInfo?.icon}
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								{activeTabInfo?.title}
							</h2>
							<p className="text-gray-500 text-sm mt-1">
								{activeTabInfo?.title === "DESCRIPTION"
									? "Product specifications and details"
									: activeTabInfo?.title === "WARRANTY"
									? "Coverage and terms information"
									: activeTabInfo?.title === "DELIVERY"
									? "Shipping and delivery policies"
									: "Payment methods and procedures"}
							</p>
						</div>
					</div>

					{/* Content Body với CSS cho HTML content */}
					<div className="prose prose-lg max-w-none">
						<div className="space-y-4">{getActiveTabContent()}</div>
					</div>
				</div>

				{/* Loading overlay effect */}
				{!animateContent && (
					<div className="absolute inset-0 bg-white/50 flex items-center justify-center">
						<div className="flex space-x-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
							<div
								className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
								style={{ animationDelay: "0.1s" }}></div>
							<div
								className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
								style={{ animationDelay: "0.2s" }}></div>
						</div>
					</div>
				)}
			</div>

			{/* Decorative bottom border */}
			<div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
		</div>
	);
};

export default memo(InformationDetail);
