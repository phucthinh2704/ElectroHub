import { Mail, Phone, ShoppingCart, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import path from "../utils/path";

const Header = () => {
	return (
		<header className="w-(--main-width) py-3 flex justify-between items-center">
			<Link to={`/${path.HOME}`}>
				<img
					src={logo}
					alt="logo"
					className="w-[234px] object-cover"
				/>
			</Link>
			<div className="flex text-[13px]">
				<div className="flex flex-col gap-1 items-center border-r border-gray-300 px-5 py-2">
					<p className="flex items-center gap-2 font-semibold">
						<Phone
							size={16}
							className="text-red-500"
							strokeWidth={2}
						/>

						<span>(+84) 8000 8080</span>
					</p>
					<p className="text-xs text-gray-500">
						Mon-Sat 9:00AM - 8:00PM
					</p>
				</div>
				<div className="flex flex-col gap-1 items-center border-r border-gray-300 px-6 py-2">
					<p className="flex items-center gap-2 font-semibold">
						<Mail
							size={16}
							className="text-red-500"
							strokeWidth={2}
						/>

						<span><a href="mailto: thinhphuc2704@gmail.com">electrohub-digital@support.com</a></span>
					</p>
					<p className="text-xs text-gray-500">Online Support 24/7</p>
				</div>
				<div className="flex flex-col gap-1 items-center border-r border-gray-300 px-6 py-2">
					<ShoppingCart
						size={16}
						className="text-red-500"
						strokeWidth={2}
					/>
					<p className="text-xs text-gray-500">0 item(s)</p>

				</div>
				<div className="flex flex-col gap-1 items-center px-6 py-2">
					<User
						size={16}
						className="text-red-500"
						strokeWidth={2}
					/>
					<p className="text-xs text-gray-500 hover:text-blue-500 cursor-pointer">
						Login / Register
					</p>
				</div>
			</div>
		</header>
	);
};

export default Header;
