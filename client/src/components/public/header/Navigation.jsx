import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { navigation } from "../../../utils/constants";

const Navigation = () => {
	return (
		<nav className="w-full max-w-screen-xl mx-auto h-12 py-2 mb-6 border-y border-gray-300 flex items-center">
			{navigation.map((item) => {
				return (
					<NavLink
						key={item.id}
						to={item.path}
						className={({ isActive }) =>
							`group px-4 py-1.5 mx-1 rounded-md transition-colors duration-200 flex items-center gap-2 ${
								isActive
									? "text-blue-600 font-semibold"
									: "text-gray-800 hover:bg-gray-100 hover:text-blue-500"
							}`
						}>
						<item.icon size={20} />
						<span>{item.value}</span>
					</NavLink>
				);
			})}
		</nav>
	);
};

export default memo(Navigation);
