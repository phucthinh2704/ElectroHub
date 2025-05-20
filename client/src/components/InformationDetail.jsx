import React, { memo, useState, useEffect } from "react";
import { tabs } from "../utils/constants";
import formatContent from "../utils/formatContent";

const InformationDetail = () => {
	const [activeTab, setActiveTab] = useState(tabs[0].id);

	const [animateContent, setAnimateContent] = useState(false);

	// Add animation when changing tabs
	useEffect(() => {
		setAnimateContent(false);
		const timer = setTimeout(() => {
			setAnimateContent(true);
		}, 200);
		return () => clearTimeout(timer);
	}, [activeTab]);

	const getActiveTabContent = () => {
		const tab = tabs.find((tab) => tab.id === activeTab);
		return tab ? formatContent(tab.content) : [];
	};

	return (
		<div className="bg-white rounded-lg shadow-lg overflow-hidden">
			{/* Modern Card-style Tab Navigation */}
			<div className="grid grid-cols-5 gap-2 p-4 bg-gray-0 border-b border-gray-200">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex flex-col items-center justify-center cursor-pointer p-3 rounded-lg transition-all duration-200 ${
							activeTab === tab.id
								? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
								: "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
						}
            `}>
						<div
							className={`
              p-2 rounded-full mb-2
              ${
					activeTab === tab.id
						? "bg-blue-100 text-blue-600"
						: "bg-gray-100 text-gray-500"
				}
            `}>
							{tab.icon}
						</div>
						<span className="text-xs font-medium">{tab.title}</span>
					</button>
				))}
			</div>

			{/* Tab Content with Animation */}
			<div className="p-6 max-h-96 overflow-auto">
				<div
					className={`transition-all duration-300 transform ${
						animateContent
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-4"
					}`}>
					{/* Tab Header */}
					<div className="flex items-center mb-6 pb-3 border-b border-gray-100">
						<div
							className={`p-2 mr-3 rounded-full bg-blue-100 text-blue-600`}>
							{tabs.find((tab) => tab.id === activeTab)?.icon}
						</div>
						<h3 className="text-xl font-semibold text-gray-800">
							{tabs.find((tab) => tab.id === activeTab)?.title}
						</h3>
					</div>

					{/* Tab Content */}
					<div className="prose max-w-none">
						{getActiveTabContent()}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(InformationDetail);
