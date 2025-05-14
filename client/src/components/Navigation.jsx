import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, ShoppingCart, User, Heart, Settings } from "lucide-react";
import { navigation } from "../utils/constants";

const Navigation = () => {
	const [activeId, setActiveId] = useState(1);

	return (
		<nav className="w-full max-w-screen-xl mx-auto h-12 py-2 mb-6 border-y border-gray-300 flex items-center">
			{navigation.map((item) => {
				const isActive = activeId === item.id;
				return (
					<NavLink
						key={item.id}
						to={item.path}
						className={`group px-4 py-1.5 mx-1 rounded-md transition-colors duration-200 flex items-center gap-2 ${
							isActive
								? "text-blue-600 font-semibold"
								: "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
						}`}
						onClick={() => {
							setActiveId(item.id);
						}}>
						<item.icon
							size={18}
							strokeWidth={isActive ? 2.5 : 2}
							className={`${
								isActive ? "text-blue-600" : "text-gray-600"
							} group-hover:text-blue-500`}
						/>
						<span>{item.value}</span>
					</NavLink>
				);
			})}
		</nav>
	);
};

export default Navigation;
