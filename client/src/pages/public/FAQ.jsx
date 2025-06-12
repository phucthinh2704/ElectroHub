import { Search, Zap } from "lucide-react";
import React, { useState } from "react";
import { FAQItem } from "../../components";
import { categoriesFAQ, faqData } from "../../utils/constants";

const FAQ = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [openItems, setOpenItems] = useState(new Set());
	const [activeCategory, setActiveCategory] = useState("all");

	const toggleItem = (id) => {
		const newOpenItems = new Set(openItems);
		if (newOpenItems.has(id)) {
			newOpenItems.delete(id);
		} else {
			newOpenItems.add(id);
		}
		setOpenItems(newOpenItems);
	};

	const filteredFAQs = faqData.filter((item) => {
		const matchesSearch =
			item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.answer.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			activeCategory === "all" || item.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center">
						<div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 shadow-md border border-blue-200">
							<Zap className="w-5 h-5 text-blue-600" />
							<span className="text-blue-900 font-medium">
								Electro Hub Digital
							</span>
						</div>
						<h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
							Frequently Asked
							<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
								{" "}
								Questions
							</span>
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
							Find answers to common questions about our products,
							services, and policies. Can't find what you're
							looking for? Our support team is here to help!
						</p>

						{/* Search Bar */}
						<div className="relative max-w-2xl mx-auto">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Search for answers..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-lg"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-16">
				<div className="grid lg:grid-cols-4 gap-8">
					{/* Categories Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200 shadow-lg sticky top-8">
							<h3 className="text-lg font-semibold text-gray-800 mb-6">
								Categories
							</h3>
							<div className="space-y-2">
								{categoriesFAQ.map((category) => {
									const IconComponent = category.icon;
									return (
										<button
											key={category.id}
											onClick={() =>
												setActiveCategory(category.id)
											}
											className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-300 ${
												activeCategory === category.id
													? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105"
													: "text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
											}`}>
											<IconComponent className="w-5 h-5" />
											<span className="font-medium">
												{category.name}
											</span>
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* FAQ Items */}
					<div className="lg:col-span-3">
						<div className="space-y-4">
							{filteredFAQs.length === 0 ? (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
										<Search className="w-8 h-8 text-gray-400" />
									</div>
									<h3 className="text-xl font-semibold text-gray-800 mb-2">
										No results found
									</h3>
									<p className="text-gray-600">
										Try adjusting your search terms or
										browse different categories.
									</p>
								</div>
							) : (
								filteredFAQs.map((item, index) => (
									<FAQItem
										key={item.id}
										item={item}
										index={index}
										toggleItem={toggleItem}
										openItems={openItems}
									/>
								))
							)}
						</div>

						{/* Contact Support CTA */}
						<div className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 text-center shadow-xl">
							<h3 className="text-2xl font-bold text-white mb-4">
								Still have questions?
							</h3>
							<p className="text-blue-100 mb-6">
								Our expert support team is available 24/7 to
								help you with any questions or concerns.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<a target="_blank" href="https://zalo.me/0916660387" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
									Zalo Support
								</a>
								<a target="_blank" href="mailto: thinhphuc2704@gmail.com" className="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50">
									Email Support
								</a>	
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FAQ;
