import {
	ArrowLeft,
	Cpu,
	Home,
	Search,
	ShoppingCart,
	Smartphone,
	Wifi,
	Zap
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
	const navigate = useNavigate();
	const handleGoHome = () => {
		navigate("/");
	};

	const handleGoBack = () => {
		window.history.back();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
				<div className="absolute top-60 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
				<div className="absolute bottom-32 left-1/3 w-40 h-40 bg-cyan-200 rounded-full opacity-30 animate-pulse delay-2000"></div>
				<div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-200 rounded-full opacity-30 animate-pulse delay-500"></div>
			</div>

			{/* Floating tech icons */}
			<div className="absolute inset-0 pointer-events-none">
				<Cpu
					className="absolute top-1/4 left-1/4 w-8 h-8 text-blue-400 opacity-40 animate-bounce"
					style={{ animationDelay: "0s" }}
				/>
				<Smartphone
					className="absolute top-1/3 right-1/4 w-6 h-6 text-purple-400 opacity-40 animate-bounce"
					style={{ animationDelay: "1s" }}
				/>
				<Wifi
					className="absolute bottom-1/3 left-1/3 w-7 h-7 text-cyan-400 opacity-40 animate-bounce"
					style={{ animationDelay: "2s" }}
				/>
				<Zap
					className="absolute top-1/2 right-1/3 w-6 h-6 text-orange-400 opacity-40 animate-bounce"
					style={{ animationDelay: "1.5s" }}
				/>
			</div>

			<div className="text-center max-w-4xl mx-auto relative z-10">
				{/* Logo/Brand */}
				<div className="flex items-center justify-center mb-8">
					<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
						<Zap className="w-10 h-10 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-800 ml-4">
						Electro<span className="text-blue-500">Hub</span>
					</h1>
				</div>

				{/* 404 Number */}
				<div className="relative mb-8">
					<h2 className="text-9xl md:text-[12rem] font-black text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text leading-none">
						404
					</h2>
					<div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-blue-200 opacity-20 blur-sm">
						404
					</div>
				</div>

				{/* Main message */}
				<div className="mb-8">
					<h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
						Oops! Page Not Found
					</h3>
					<p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
						Looks like this page got disconnected from our circuit!
						The page you're looking for might have been moved,
						deleted, or never existed.
					</p>
				</div>

				{/* Suggestions */}
				<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200 shadow-xl mb-8">
					<h4 className="text-xl font-semibold text-gray-800 mb-6">
						What can you do?
					</h4>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-xl">
							<div className="bg-blue-500 p-3 rounded-full mb-3">
								<Search className="w-6 h-6 text-white" />
							</div>
							<span className="text-gray-700 font-medium">
								Check the URL
							</span>
							<span className="text-gray-500 text-sm mt-1">
								Look for typos
							</span>
						</div>
						<div className="flex flex-col items-center text-center p-4 bg-purple-50 rounded-xl">
							<div className="bg-purple-500 p-3 rounded-full mb-3">
								<ShoppingCart className="w-6 h-6 text-white" />
							</div>
							<span className="text-gray-700 font-medium">
								Browse Products
							</span>
							<span className="text-gray-500 text-sm mt-1">
								Explore our store
							</span>
						</div>
						<div className="flex flex-col items-center text-center p-4 bg-cyan-50 rounded-xl">
							<div className="bg-cyan-500 p-3 rounded-full mb-3">
								<Home className="w-6 h-6 text-white" />
							</div>
							<span className="text-gray-700 font-medium">
								Go Home
							</span>
							<span className="text-gray-500 text-sm mt-1">
								Return to homepage
							</span>
						</div>
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
					<button
						onClick={handleGoHome}
						className="group bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer">
						<Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
						Back to Home
					</button>

					<button
						onClick={handleGoBack}
						className="group bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-xl border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer">
						<ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
						Go Back
					</button>
				</div>

				{/* Popular categories */}
				<div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
					<p className="text-gray-600 mb-4 font-medium">
						Or explore our popular categories:
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						{[
							{
								name: "Smartphone",
								color: "bg-blue-100 text-blue-700 border-blue-200",
								gif: "https://digital-world-2.myshopify.com/cdn/shop/files/wifi_300x.gif?v=1750770575",
							},
							{
								name: "Tablet",
								color: "bg-purple-100 text-purple-700 border-purple-200",
								gif: "https://digital-world-2.myshopify.com/cdn/shop/files/tablet_300x.gif?v=1750770574",
							},
							{
								name: "Laptop",
								color: "bg-cyan-100 text-cyan-700 border-cyan-200",
								gif: "https://digital-world-2.myshopify.com/cdn/shop/files/laptop_300x.gif?v=1750770574",
							},
							{
								name: "Accessories",
								color: "bg-orange-100 text-orange-700 border-orange-200",
								gif: "https://digital-world-2.myshopify.com/cdn/shop/files/music_300x.gif?v=1750770575",
							},
							{
								name: "Television",
								color: "bg-green-100 text-green-700 border-green-200",
								gif: "https://digital-world-2.myshopify.com/cdn/shop/files/applications_300x.gif?v=1750770575",
							},
							{
								name: "Printer",
								color: "bg-pink-100 text-pink-700 border-pink-200",
								gif: "https://digital-world-2.myshopify.com/cdn/shop/files/printer_300x.gif?v=1750770574",
							},
						].map((category) => {
							return (
								<Link
									key={category.name}
									to={`/products/${category.name.toLowerCase()}`}
									className="flex items-center justify-center">
									<button
										className={`${category.color} flex items-center justify-center gap-2 hover:scale-105 px-4 py-2 rounded-lg border font-medium transition-all duration-300 text-sm shadow-sm hover:shadow-md cursor-pointer`}>
										<img
											src={category.gif}
											alt={category.name}
											className="w-10 h-10 rounded-lg object-cover"
											loading="lazy"
											decoding="async"
										/>
										{category.name}
									</button>
								</Link>
							);
						})}
					</div>
				</div>

				{/* Bottom decorative text */}
				<div className="mt-8 text-gray-400 text-sm">
					<p>ElectroHub - Your trusted electronics partner</p>
				</div>
			</div>

			{/* Decorative grid pattern */}
			<div className="absolute inset-0 opacity-5">
				<div
					className="w-full h-full"
					style={{
						backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
						backgroundSize: "20px 20px",
					}}></div>
			</div>
		</div>
	);
}
