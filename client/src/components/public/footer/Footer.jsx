import React, { memo } from "react";
import {
	Mail,
	MapPin,
	Phone,
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	Youtube,
} from "lucide-react";

const Footer = () => {
	const socials = [<Facebook />, <Twitter />, <Instagram />, <Linkedin />];
	return (
		<footer className="w-full flex flex-col justify-between text-white">
			{/* Newsletter Section */}
			<div className="w-full py-8 md:py-10 bg-main">
				<div className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between items-center px-4 sm:px-6 gap-6 lg:gap-8">
					<div className="w-full lg:w-1/2 text-center lg:text-left">
						<h2 className="uppercase font-medium text-xl sm:text-2xl mb-2">
							Sign up to Newsletter
						</h2>
						<span className="text-gray-100 text-sm sm:text-base block">
							Subscribe now and receive weekly newsletter with
							exclusive offers
						</span>
					</div>
					<div className="w-full lg:w-1/2 relative max-w-md lg:max-w-none">
						<input
							type="email"
							className="bg-white/20 w-full rounded-full outline-none py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base pr-12 sm:pr-14 border border-white/30 focus:border-white transition-all duration-300"
							placeholder="Enter your email address"
							style={{
								boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
							}}
						/>
						<button className="absolute right-2 top-[50%] translate-y-[-50%] bg-white rounded-full h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 text-main cursor-pointer">
							<Mail size={16} className="sm:hidden" />
							<Mail size={18} className="hidden sm:block" />
						</button>
					</div>
				</div>
			</div>

			{/* Main Footer Section */}
			<div className="bg-[#191919] w-full py-8 sm:py-12">
				<div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 px-4 sm:px-6">
					{/* About Section */}
					<div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
						<h4 className="uppercase text-sm sm:text-base font-medium mb-2 border-l-4 pl-3 border-main">
							ABOUT US
						</h4>
						<div className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
							<MapPin
								size={18}
								className="mt-1 text-main sm:w-5 sm:h-5 flex-shrink-0"
							/>
							<div>
								<span className="font-medium text-white text-sm sm:text-base">
									Address:
								</span>
								<p className="text-xs sm:text-sm mt-1 leading-relaxed">
									474 Ontario St Toronto, ON M4X 1M7 Canada
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
							<Phone
								size={16}
								className="text-main flex-shrink-0"
							/>
							<span className="font-medium text-white text-sm sm:text-base">
								Phone:
							</span>
							<a 
								href="https://zalo.me/0916660387" 
								className="hover:underline text-sm sm:text-base break-all"
							>
								(+84) 8000 8080
							</a>
						</div>
						<div className="flex items-start sm:items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
							<Mail
								size={18}
								className="mt-0.5 sm:mt-0 text-main flex-shrink-0"
							/>
							<span className="font-medium text-white text-sm sm:text-base">
								Email:
							</span>
							<a
								href="mailto:electrohub-digital@support.com"
								className="hover:underline text-xs sm:text-sm break-all">
								electrohub-digital@support.com
							</a>
						</div>
						
						{/* Social Media Icons */}
						<div className="flex items-center gap-3 sm:gap-4 mt-4 flex-wrap justify-center sm:justify-start">
							<a
								href="https://www.facebook.com/phuc.thinh.2704"
								className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Facebook size={18} className="sm:w-5 sm:h-5" />
							</a>
							<a
								href="#"
								className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Twitter size={18} className="sm:w-5 sm:h-5" />
							</a>
							<a
								href="https://www.instagram.com/phucthinh_2704/"
								className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Instagram size={18} className="sm:w-5 sm:h-5" />
							</a>
							<a
								href="https://www.linkedin.com/in/phuc-thinh-089b6929a/"
								className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Linkedin size={18} className="sm:w-5 sm:h-5" />
							</a>
							<a
								href="#"
								className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Youtube size={18} className="sm:w-5 sm:h-5" />
							</a>
						</div>
					</div>

					{/* Information Section */}
					<div className="flex flex-col gap-3">
						<h4 className="uppercase text-sm sm:text-base font-medium mb-3 border-l-4 pl-3 border-main">
							INFORMATION
						</h4>
						{[
							"Typography",
							"Gallery",
							"Store",
							"Location",
							"Today's Deals",
							"Contact",
						].map((item, index) => (
							<a
								key={index}
								href="#"
								className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm group">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors duration-200 bg-[#666] flex-shrink-0"></span>
								<span className="group-hover:translate-x-1 transition-transform duration-200">
									{item}
								</span>
							</a>
						))}
					</div>

					{/* Who We Are Section */}
					<div className="flex flex-col gap-3">
						<h4 className="uppercase text-sm sm:text-base font-medium mb-3 border-l-4 pl-3 border-main">
							WHO WE ARE
						</h4>
						{[
							"Help",
							"Free Shipping",
							"FAQs",
							"Return & Exchange",
							"Testimonials",
						].map((item, index) => (
							<a
								key={index}
								href="#"
								className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm group">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors duration-200 bg-[#666] flex-shrink-0"></span>
								<span className="group-hover:translate-x-1 transition-transform duration-200">
									{item}
								</span>
							</a>
						))}
					</div>

					{/* Digital World Store Section */}
					<div className="flex flex-col gap-4 sm:gap-5 sm:col-span-2 lg:col-span-1">
						<h4 className="uppercase text-sm sm:text-base font-medium mb-3 border-l-4 pl-3 border-main">
							#ELECTROHUBSTORE
						</h4>
						<div className="grid grid-cols-2 gap-2 max-w-xs sm:max-w-none mx-auto sm:mx-0">
							{socials.map((item, index) => (
								<div
									key={index}
									className="aspect-square rounded overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
									<div className="w-full h-full bg-gray-800 flex items-center justify-center">
										<div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-main">
											{item}
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="p-3 sm:p-4 rounded text-xs sm:text-sm bg-[#222]">
							<p className="text-gray-300 leading-relaxed">
								Follow our store on social media and get{" "}
								<span className="font-semibold text-main break-words">
									10% discount
								</span>{" "}
								on your next purchase!
							</p>
							<a
								href="#"
								className="mt-2 inline-block text-xs sm:text-sm font-medium hover:underline text-main">
								Learn More →
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Copyright Section */}
			<div className="bg-black w-full py-3 sm:py-4">
				<div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-xs gap-3 sm:gap-0">
					<p className="text-center sm:text-left">
						© {new Date().getFullYear()} ElectroHub Digital. All
						Rights Reserved.
					</p>
					<div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-end">
						<a
							href="#"
							className="hover:text-white transition-colors duration-200 whitespace-nowrap">
							Privacy Policy
						</a>
						<a
							href="#"
							className="hover:text-white transition-colors duration-200 whitespace-nowrap">
							Terms of Service
						</a>
						<a
							href="#"
							className="hover:text-white transition-colors duration-200 whitespace-nowrap">
							Cookie Policy
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default memo(Footer);