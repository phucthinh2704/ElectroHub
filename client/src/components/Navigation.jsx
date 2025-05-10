import React from "react";
import { NavLink } from "react-router-dom";
import { navigation } from "../utils/constants";

const Navigation = () => {
	return (
		<div className="w-(--main-width) h-[50px] py-2 mb-6 border-y text-[15px] flex items-center">
			{navigation.map((item) => (
				<NavLink
					key={item.id}
					to={item.path}
					className={({ isActive }) =>
						isActive
							? "text-main font-semibold px-6 py-2"
							: "text-[#000] font-normal px-6 py-2 hover:text-main"
					}>
					<span className="flex items-center gap-2">
						{<item.icon size={18}/>} {item.value}
					</span>
				</NavLink>
			))}
		</div>
	);
};

export default Navigation;
