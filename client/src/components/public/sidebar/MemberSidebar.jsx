import React, { memo, useState } from "react";
import {
	AiOutlineCaretDown,
	AiOutlineGift,
	AiOutlineLogout,
} from "react-icons/ai";
import { memberSidebar } from "../../../utils/constants";
import { Link } from "react-router-dom";

const MemberSidebar = ({ user }) => {
	const [active, setActive] = useState([]);

	const handleShowTabs = (tabId) => {
		if (active.some((id) => id === tabId)) {
			setActive(active.filter((id) => id !== tabId));
		} else {
			setActive([...active, tabId]);
		}
	};

	return (
		<div className="bg-gradient-to-b from-slate-50 to-white h-full w-80 border-r border-gray-200 shadow-lg">
			{/* Header with User Profile */}
			<div className="p-6 border-b border-gray-100">
				<div className="flex items-center gap-4">
					<div className="relative">
						<div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-blue-100 shadow-lg">
							{user.avatar && (
								<img
									src={user.avatar}
									alt={user.name}
									className="w-full h-full object-cover"
								/>
							)}
							{!user.avatar && (
								<div className="w-full h-full flex items-center justify-center bg-blue-200 text-blue-700 font-bold text-lg">
									{user.name.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
						{/* Online indicator */}
						<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
					</div>
					<div className="flex-1 min-w-0">
						<h2 className="text-gray-900 font-bold text-lg truncate">
							{user.name}
						</h2>
						<p className="text-gray-500 text-sm truncate">
							{user.email}
						</p>
						{/* <div className="flex items-center gap-2 mt-1">
							<span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
								{user.membershipLevel}
							</span>
							<span className="text-blue-600 text-xs font-semibold">
								{user.points} điểm
							</span>
						</div> */}
					</div>
				</div>
			</div>

			{/* Navigation Menu */}
			<div className="p-4 space-y-2 flex-1 overflow-y-auto">
				<div className="mb-4">
					<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
						Main Menu
					</h3>
				</div>

				{memberSidebar.map((item) => (
					<React.Fragment key={item.id}>
						{item.type === "SINGLE" && (
							<Link
								to={item.path}
								className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50/70 hover:scale-102">
								<span className="flex-shrink-0 transition-all duration-300 group-hover:scale-110">
									{item.icon}
								</span>
								<span className="font-medium transition-all duration-300">
									{item.text}
								</span>
								<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
								</div>
							</Link>
						)}

						{item.type === "PARENT" && (
							<div className="space-y-1">
								<div
									className="group flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 cursor-pointer hover:text-blue-600 hover:bg-blue-50/70 transition-all duration-300"
									onClick={() => handleShowTabs(item.id)}>
									<div className="flex items-center gap-3">
										<span className="flex-shrink-0 transition-all duration-300 group-hover:scale-110">
											{item.icon}
										</span>
										<span className="font-medium">
											{item.text}
										</span>
									</div>
									<div
										className={`transition-all duration-300 ${
											active.includes(item.id)
												? "rotate-180 text-blue-600"
												: "text-gray-400"
										}`}>
										<AiOutlineCaretDown className="text-sm" />
									</div>
								</div>

								{/* Submenu with smooth animation */}
								<div
									className={`overflow-hidden transition-all duration-300 ${
										active.includes(item.id)
											? "max-h-96 opacity-100"
											: "max-h-0 opacity-0"
									}`}>
									<div className="pl-4 space-y-1 mt-1">
										{item.submenu.map((subItem) => (
											<div
												key={subItem.text}
												className="group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 hover:translate-x-1"
												onClick={(e) =>
													e.stopPropagation()
												}>
												<span className="flex-shrink-0 transition-all duration-300 group-hover:scale-110">
													{subItem.icon}
												</span>
												<span className="text-sm font-medium">
													{subItem.text}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</React.Fragment>
				))}
			</div>

			{/* Quick Actions */}
			<div className="p-4 border-t border-gray-100">
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
							<AiOutlineGift
								size={20}
								className="text-white"
							/>
						</div>
						<div>
							<p className="text-gray-800 font-semibold text-sm mb-1">
								Special Offer for You!
							</p>
							<p className="text-gray-500 text-xs">
								Get 20% off on the first order
							</p>
						</div>
					</div>
				</div>

				{/* Logout Button */}
				<button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50/70 transition-all duration-300 group">
					<AiOutlineLogout
						size={20}
						className="transition-transform duration-300 group-hover:scale-110"
					/>
					<span className="font-medium">Log out</span>
				</button>
			</div>
		</div>
	);
};

export default memo(MemberSidebar);
