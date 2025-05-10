import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import icons from "../utils/icons";
import path from "../utils/path";
const Header = () => {
	const { RiPhoneFill, MdEmail, FaCartPlus, FaUserAlt } = icons;
	return (
		<div className="w-(--main-width) py-[15px] flex justify-between items-center">
			<Link to={`/${path.HOME}`}>
				<img
					src={logo}
					alt="logo"
					className="w-[234px] object-cover"
				/>
			</Link>
			<div className="flex text-[13px]">
				<div className="flex flex-col items-center border-r px-6 py-2">
					<p className="flex items-center gap-2 font-semibold">
						<RiPhoneFill
							color="#ee3131"
							size={18}
						/>
						<span>(+84) 8000 8080</span>
					</p>
					<p className="text-[12px]">Mon-Sat 9:00AM - 8:00PM</p>
				</div>
				<div className="flex flex-col items-center border-r px-6 py-2">
					<p className="flex items-center gap-2 font-semibold">
						<MdEmail
							color="#ee3131"
							size={18}
						/>
						<span>electrohub-digital@support.com</span>
					</p>
					<p className="text-[12px]">Online Support 24/7</p>
				</div>
				<div className="flex flex-col items-center border-r px-6 py-2">
					<FaCartPlus
						color="#ee3131"
						size={18}
					/>
					<span>0 items(s)</span>
				</div>
				<div className="flex flex-col items-center px-6 py-2">
					<FaUserAlt
						color="#ee3131"
						size={18}
					/>
					<span>Login</span>
				</div>
			</div>
		</div>
	);
};

export default Header;
