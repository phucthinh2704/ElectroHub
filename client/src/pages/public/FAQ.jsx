import React, { useState } from "react";
import { ChevronDown, Search, Zap, Shield, Truck, CreditCard, Users, Headphones } from "lucide-react";

const FAQ = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [openItems, setOpenItems] = useState(new Set());
	const [activeCategory, setActiveCategory] = useState("all");

	const categories = [
		{ id: "all", name: "All Questions", icon: Users },
		{ id: "orders", name: "Orders & Shipping", icon: Truck },
		{ id: "products", name: "Products", icon: Zap },
		{ id: "payment", name: "Payment", icon: CreditCard },
		{ id: "warranty", name: "Warranty", icon: Shield },
		{ id: "support", name: "Support", icon: Headphones },
	];

	const faqData = [
		{
			id: 1,
			category: "orders",
			question: "How long does shipping take?",
			answer: "Standard shipping takes 3-7 business days within the continental US. Express shipping (1-3 days) and overnight shipping options are also available. International shipping times vary by destination, typically 7-21 business days.",
		},
		{
			id: 2,
			category: "orders",
			question: "Do you offer free shipping?",
			answer: "Yes! We offer free standard shipping on orders over $50 within the US. For orders under $50, shipping costs $5.99. Premium members enjoy free shipping on all orders regardless of amount.",
		},
		{
			id: 3,
			category: "orders",
			question: "Can I track my order?",
			answer: "Absolutely! Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order in real-time through your account dashboard or our mobile app.",
		},
		{
			id: 4,
			category: "products",
			question: "Are all products authentic and new?",
			answer: "Yes, we guarantee that all products sold on Electro Hub Digital are 100% authentic and brand new. We work directly with manufacturers and authorized distributors to ensure product authenticity.",
		},
		{
			id: 5,
			category: "products",
			question: "Do you test products before shipping?",
			answer: "While we don't test every individual item, all our products undergo quality control checks. Our suppliers perform rigorous testing, and we have a comprehensive quality assurance process in place.",
		},
		{
			id: 6,
			category: "products",
			question: "What if I receive a defective product?",
			answer: "If you receive a defective product, contact us within 48 hours of delivery. We'll arrange a free return and send you a replacement immediately. No questions asked - your satisfaction is our priority.",
		},
		{
			id: 7,
			category: "payment",
			question: "What payment methods do you accept?",
			answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. We also offer financing options through Klarna and Affirm for eligible purchases.",
		},
		{
			id: 8,
			category: "payment",
			question: "Is my payment information secure?",
			answer: "Absolutely. We use industry-standard SSL encryption and are PCI DSS compliant. Your payment information is never stored on our servers and is processed through secure, encrypted channels.",
		},
		{
			id: 9,
			category: "payment",
			question: "Can I get a refund?",
			answer: "Yes, we offer a 30-day money-back guarantee on most items. Products must be in original condition with all accessories and packaging. Refunds are processed within 5-7 business days after we receive the returned item.",
		},
		{
			id: 10,
			category: "warranty",
			question: "What warranty do you provide?",
			answer: "All products come with manufacturer warranties, which vary by brand and product type. Additionally, we offer extended warranty options for added peace of mind. Warranty details are clearly listed on each product page.",
		},
		{
			id: 11,
			category: "warranty",
			question: "How do I claim warranty service?",
			answer: 'To claim warranty service, log into your account and navigate to your order history. Select the item and click "Warranty Claim." You can also contact our support team directly with your order number and product details.',
		},
		{
			id: 12,
			category: "support",
			question: "How can I contact customer support?",
			answer: "Our customer support team is available 24/7 via live chat, email (support@electrohub.com), or phone (1-800-ELECTRO). We also have a comprehensive help center with tutorials and troubleshooting guides.",
		},
		{
			id: 13,
			category: "support",
			question: "Do you offer technical support?",
			answer: "Yes! Our certified technicians provide free technical support for all products purchased from us. This includes setup assistance, troubleshooting, and product education. Support is available via phone, chat, or video call.",
		},
	];

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
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
					<div className="text-center">
						<div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-8 shadow-md border border-blue-200">
							<Zap className="w-5 h-5 text-blue-600" />
							<span className="text-blue-900 font-medium">
								Electro Hub Digital
							</span>
						</div>
						<h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
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
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid lg:grid-cols-4 gap-8">
					{/* Categories Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200 shadow-lg sticky top-8">
							<h3 className="text-lg font-semibold text-gray-800 mb-6">
								Categories
							</h3>
							<div className="space-y-2">
								{categories.map((category) => {
									const IconComponent = category.icon;
									return (
										<button
											key={category.id}
											onClick={() =>
												setActiveCategory(category.id)
											}
											className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
									<div
										key={item.id}
										className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
										style={{
											animationDelay: `${index * 0.1}s`,
										}}>
										<button
											onClick={() => toggleItem(item.id)}
											className="w-full px-6 py-6 text-left flex items-center justify-between group">
											<h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
												{item.question}
											</h3>
											<ChevronDown
												className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
													openItems.has(item.id)
														? "rotate-180 text-blue-600"
														: ""
												}`}
											/>
										</button>

										<div
											className={`overflow-hidden transition-all duration-500 ease-in-out ${
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
								<button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
									Start Live Chat
								</button>
								<button className="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50">
									Email Support
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FAQ;