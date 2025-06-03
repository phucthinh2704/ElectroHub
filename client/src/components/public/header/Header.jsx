import { Mail, Phone, ShoppingCart, User } from "lucide-react";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
import path from "../../../utils/path";
import { useSelector } from "react-redux";

const Header = () => {
	const { current } = useSelector((state) => state.user);

	return (
		<header className="w-(--main-width) py-2 flex justify-between items-center">
			<Link to={`/${path.HOME}`}>
				<img
					src={logo}
					alt="logo"
					className="w-[234px] object-cover"
				/>
			</Link>
			<div className="flex text-[13px]">
				<div className="flex flex-col gap-1 justify-center items-center border-r border-gray-300 px-5 py-2">
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
				<div
					className={`flex flex-col gap-1 items-center justify-center px-4 py-2  ${
						current ? "-mr-0 border-r border-gray-300" : "-mr-6"
					}`}>
					<p className="flex items-center gap-2 font-semibold">
						<Mail
							size={16}
							className="text-red-500"
							strokeWidth={2}
						/>

						<span>
							<a href="mailto: thinhphuc2704@gmail.com">
								electrohub-digital@support.com
							</a>
						</span>
					</p>
					<p className="text-xs text-gray-500">Online Support 24/7</p>
				</div>
				{current && (
					<>
						<div className="flex flex-col gap-1 items-center justify-center border-r border-gray-300 px-6 py-2">
							<ShoppingCart
								size={20}
								className="text-red-500"
								strokeWidth={2}
							/>
							<p className="text-xs text-gray-500">0 item(s)</p>
						</div>
						<Link
							to={
								current?.role === "admin"
									? `/${path.ADMIN}/${path.DASHBOARD}`
									: current?.role === "user"
									? `/${path.MEMBER}/${path.PERSONAL}`
									: `/${path.LOGIN}`
							}
							className="flex flex-col gap-1 items-center justify-center px-6 py-2">
							<User
								size={20}
								className="text-red-500"
								strokeWidth={2}
							/>
							<p className="text-xs text-gray-500 hover:text-blue-500 cursor-pointer">
								{current?.role === "admin" ? "Admin Panel" : "My Profile"}
							</p>
						</Link>
					</>
				)}
			</div>
		</header>
	);
};

export default memo(Header);
