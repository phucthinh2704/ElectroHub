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
			<div className="w-full py-10 bg-main">
				<div className="w-full max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-6">
					<div className="w-full md:w-1/2">
						<h2 className="uppercase font-medium text-2xl mb-1">
							Sign up to Newsletter
						</h2>
						<span className="text-gray-100 text-sm">
							Subscribe now and receive weekly newsletter with
							exclusive offers
						</span>
					</div>
					<div className="w-full md:w-1/2 relative">
						<input
							type="email"
							className="bg-white/20 w-full rounded-full outline-none py-4 px-6 text-base pr-12 border border-white/30 focus:border-white transition-all duration-300"
							placeholder="Enter your email address"
							style={{
								boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
							}}
						/>
						<button className="absolute right-2 top-[50%] translate-y-[-50%] bg-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 text-main cursor-pointer">
							<Mail size={18} />
						</button>
					</div>
				</div>
			</div>

			{/* Main Footer Section */}
			<div className="bg-[#191919] w-full py-12">
				<div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
					{/* About Section */}
					<div className="flex flex-col gap-4">
						<h4 className="uppercase text-base font-medium mb-2 border-l-4 pl-3 border-main">
							ABOUT US
						</h4>
						<div className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
							<MapPin
								size={22}
								className="mt-1 text-main"
							/>
							<div>
								<span className="font-medium text-white">
									Address:
								</span>
								<p className="text-sm mt-1">
									474 Ontario St Toronto, ON M4X 1M7 Canada
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
							<Phone
								size={16}
								className="text-main"
							/>
							<span className="font-medium text-white">
								Phone:
							</span>
							<span>(+84) 8000 8080</span>
						</div>
						<div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
							<Mail
								size={22}
								className="text-main"
							/>
							<span className="font-medium text-white">
								Email:
							</span>
							<a
								href="mailto:electrohub-digital@support.com"
								className="hover:underline">
								electrohub-digital@support.com
							</a>
						</div>
						<div className="flex items-center gap-4 mt-2">
							<a
								href="https://www.facebook.com/phuc.thinh.2704"
								className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Facebook size={20} />
							</a>
							<a
								href="#"
								className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Twitter size={20} />
							</a>
							<a
								href="https://www.instagram.com/phucthinh_2704/"
								className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Instagram size={20} />
							</a>
							<a
								href="https://www.linkedin.com/in/phuc-thinh-089b6929a/"
								className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Linkedin size={20} />
							</a>
							<a
								href="#"
								className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-gray-300 hover:text-white">
								<Youtube size={20} />
							</a>
						</div>
					</div>

					{/* Information Section */}
					<div className="flex flex-col gap-3">
						<h4 className="uppercase text-base font-medium mb-3 border-l-4 pl-3 border-main">
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
								className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm group">
								<span className="w-1.5 h-1.5 rounded-full transition-colors duration-200 bg-[#666]"></span>
								<span className="group-hover:translate-x-1 transition-transform duration-200">
									{item}
								</span>
							</a>
						))}
					</div>

					{/* Who We Are Section */}
					<div className="flex flex-col gap-3">
						<h4 className="uppercase text-base font-medium mb-3 border-l-4 pl-3 border-main">
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
								className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm group">
								<span className="w-1.5 h-1.5 rounded-full transition-colors duration-200 bg-[#666]"></span>
								<span className="group-hover:translate-x-1 transition-transform duration-200">
									{item}
								</span>
							</a>
						))}
					</div>

					{/* Digital World Store Section */}
					<div className="flex flex-col gap-5">
						<h4 className="uppercase text-base font-medium mb-3 border-l-4 pl-3 border-main">
							#ELECTROHUBSTORE
						</h4>
						<div className="grid grid-cols-2 gap-2">
							{socials.map((item, index) => (
								<div
									key={index}
									className="aspect-square rounded overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
									<div className="w-full h-full bg-gray-800 flex items-center justify-center">
										<div className="w-8 h-8 flex items-center justify-center text-main">
											{item}
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="p-4 rounded text-sm bg-[#222]">
							<p className="text-gray-300">
								Follow our store on social media and get{" "}
								<span className="font-semibold text-main">
									10% discount
								</span>{" "}
								on your next purchase!
							</p>
							<a
								href="#"
								className="mt-2 inline-block text-sm font-medium hover:underline text-main">
								Learn More →
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Copyright Section */}
			<div className="bg-black w-full py-4">
				<div className="w-full max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
					<p>
						© {new Date().getFullYear()} ElectroHub Digital. All
						Rights Reserved.
					</p>
					<div className="flex gap-6 mt-2 md:mt-0">
						<a
							href="#"
							className="hover:text-white transition-colors duration-200">
							Privacy Policy
						</a>
						<a
							href="#"
							className="hover:text-white transition-colors duration-200">
							Terms of Service
						</a>
						<a
							href="#"
							className="hover:text-white transition-colors duration-200">
							Cookie Policy
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default memo(Footer);
