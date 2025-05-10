import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { createSlug } from "../utils/slug";

const Sidebar = () => {
   const { categories } = useSelector((state) => state.app);
   
	return (
		<div className="flex flex-col border justify-center">
         <div className="bg-main text-white text-[16px] uppercase font-normal px-4 py-3">All collections</div>
			{categories.map((category) => (
				<NavLink
					key={category._id}
					to={createSlug(category.title)}
					className={({ isActive }) =>
						isActive
							? "bg-main text-white text-[15px] font-semibold px-6 py-2"
							: "text-[#000] text-[15px] font-normal px-4 py-3 hover:bg-main hover:text-white mt-1"
					}>
					<span className="flex items-center gap-2">
						{category.title}
					</span>
				</NavLink>
			))}
		</div>
	);
};

export default Sidebar;
