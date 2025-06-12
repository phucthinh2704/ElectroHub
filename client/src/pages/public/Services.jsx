import React from "react";
import { ServicesCard } from "../../components";
import { services } from "../../utils/constants";

const Services = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			{/* Header Section */}
			<div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
				<div className="absolute inset-0 bg-black/20"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
					<div className="text-center">
						<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
							Our{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
								Services
							</span>
						</h1>
						<p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
							Experience premium electronics shopping with our
							comprehensive range of services designed to make
							your journey seamless and enjoyable.
						</p>
					</div>
				</div>
				{/* Decorative elements */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden">
					<div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
					<div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>
				</div>
			</div>

			{/* Services Grid */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Why Choose{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
							Electro Hub Digital
						</span>
						?
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						We're committed to providing exceptional service and
						support for all your electronics needs.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{services.map((service, index) => (
						<ServicesCard
							key={index}
							service={service}
						/>
					))}
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
				<div className="absolute inset-0 bg-black/20"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
					<div className="text-center">
						<h2 className="text-4xl font-bold text-white mb-6">
							Ready to Experience Premium Service?
						</h2>
						<p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
							Join thousands of satisfied customers who trust
							Electro Hub Digital for their electronics needs.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl">
								Contact Support
							</button>
							<button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-200">
								View Products
							</button>
						</div>
					</div>
				</div>
				{/* Decorative elements */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden">
					<div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
					<div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>
				</div>
			</div>
		</div>
	);
};

export default Services;
