import { LogOut } from "lucide-react";
import React, { memo, useState } from "react";
import { AiOutlineGift, AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiLogout } from "../../../apis";
import avatarDefault from "../../../assets/avatarDefault.png";
import { logout } from "../../../store/user/userSlice";
import { memberSidebar } from "../../../utils/constants";
import path from "../../../utils/path";

const MemberSidebar = ({ user }) => {
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogoutClick = () => {
		setShowLogoutConfirm(true);
	};

	const handleConfirmLogout = async () => {
		const response = await apiLogout();
		if (!response.success) {
			return toast.error(response.message);
		}
		toast.success(response.message);
		dispatch(logout());
		navigate(`/${path.LOGIN}`);
		setShowLogoutConfirm(false);
	};

	const handleCancelLogout = () => {
		setShowLogoutConfirm(false);
	};

	return (
		<div className="bg-gradient-to-b from-slate-50 to-white h-full w-80 border-r border-gray-200 shadow-lg relative">
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
								<img
									src={avatarDefault}
									alt={user.name}
									className="w-full h-full object-cover"
								/>
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
							<NavLink
								to={item.path}
								className={({ isActive }) =>
									`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer  ${
										isActive
											? "text-blue-600 bg-blue-50"
											: "text-gray-600"
									} hover:text-blue-600 hover:bg-blue-50 hover:scale-102`
								}>
								<span className="flex-shrink-0 transition-all duration-300 group-hover:scale-110">
									{item.icon}
								</span>
								<span className="font-medium transition-all duration-300">
									{item.text}
								</span>
								<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
								</div>
							</NavLink>
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
				<button
					className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 group cursor-pointer"
					onClick={handleLogoutClick}>
					<AiOutlineLogout
						size={20}
						className="transition-transform duration-300 group-hover:scale-110"
					/>
					<span className="font-medium">Log out</span>
				</button>
			</div>

			{showLogoutConfirm && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-52 p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
						{/* Header với icon */}
						<div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-red-100">
							<div className="flex items-center justify-center mb-3">
								<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
									<LogOut className="w-8 h-8 text-red-500" />
								</div>
							</div>
							<h3 className="text-xl font-bold text-center text-gray-800">
								Confirm Logout
							</h3>
						</div>

						{/* Content */}
						<div className="p-6">
							<p className="text-gray-600 text-center mb-8 leading-relaxed">
								Are you sure you want to log out of your
								account? You will need to log in again to
								continue using the service.
							</p>

							{/* Buttons */}
							<div className="flex gap-3">
								<button
									onClick={handleCancelLogout}
									className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 cursor-pointer">
									Cancel
								</button>
								<button
									onClick={handleConfirmLogout}
									className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
									Log out
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(MemberSidebar);
