import React, { memo, useState } from "react";
import { adminSidebar } from "../../../utils/constants";
import { AiOutlineCaretDown } from "react-icons/ai";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ admin }) => {
	const [active, setActive] = useState([]);

	const handleShowTabs = (tabId) => {
		if (active.some((id) => id === tabId)) {
			setActive(active.filter((id) => id !== tabId));
		} else {
			setActive([...active, tabId]);
		}
	};

	return (
		<div
			className={`bg-gray-800 h-full w-72 border-r border-slate-700/50 backdrop-blur-xl`}>
			{/* Header */}
			<div className="p-4 border-b border-white">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
							<span className="text-white font-bold text-lg">
								A
							</span>
						</div>
						<div>
							<h1 className="text-white font-semibold text-lg">
								Admin Panel
							</h1>
							<p className="text-slate-400 text-sm">Workspace</p>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<div className="p-3 space-y-2 select-none">
				{adminSidebar.map((item) => (
					<React.Fragment key={item.id}>
						{item.type === "SINGLE" && (
							<NavLink
								to={item.path}
								className="group flex items-center gap-2 px-4 py-3 rounded-xl text-slate-300 transition-all duration-200 hover:text-white bg-gradient-to-r from-blue-600 to-purple-600">
								<span className="flex-shrink-0 transition-transform group-hover:scale-110">
									{item.icon}
								</span>

								<span className="font-medium group-hover:font-semibold">
									{item.text}
								</span>
							</NavLink>
						)}

						{item.type === "PARENT" && (
							<div className="space-y-1">
								<div
									className="group bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden flex items-center justify-between px-4 py-3 text-slate-300 cursor-pointer hover:text-white transition-all duration-200"
									onClick={() => handleShowTabs(item.id)}>
									<div className="flex items-center gap-2">
										<span className="flex-shrink-0 transition-transform group-hover:scale-110">
											{item.icon}
										</span>

										<span className="font-medium group-hover:font-semibold">
											{item.text}
										</span>
									</div>

									<div
										className={`transition-transform duration-200 ${
											active.includes(item.id)
												? "rotate-180"
												: ""
										}`}>
										<AiOutlineCaretDown className="text-sm" />
									</div>
								</div>

								{active.includes(item.id) && (
									<div>
										{item.submenu.map((subItem) => (
											<NavLink
												to={subItem.path}
												key={subItem.text}
												className="group flex items-center gap-2 px-8 rounded-2xl my-1 py-2.5 transition-all duration-200 text-white bg-gradient-to-r from-slate-600 to-slate-900 hover:from-slate-600 hover:to-slate-500"
												onClick={(e) =>
													e.stopPropagation()
												}>
												<div className="w-2 h-2 rounded-full bg-white group-hover:scale-115"></div>
												<span className="text-sm font-medium group-hover:font-semibold">
													{subItem.text}
												</span>
											</NavLink>
										))}
									</div>
								)}
							</div>
						)}
					</React.Fragment>
				))}
			</div>

			{/* User Profile Section */}
			<div className="absolute bottom-6 left-4 right-4">
				<div className="bg-gray-200 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
							<img
								src={admin.avatar}
								alt=""
							/>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-black text-sm font-medium">
								{admin.name}
							</p>
							<p className="text-black text-xs truncate">
								{admin.email}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AdminSidebar);
