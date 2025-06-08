import { ChevronDown, LogOut, Phone, User } from "lucide-react";
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../store/user/userSlice";
import path from "../../../utils/path";
import { apiLogout } from "../../../apis";
import { toast } from "react-toastify";

const TopHeader = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isLoggedIn, current } = useSelector((state) => state.user);
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

	// Không sử dụng vì khi render lại sẽ hiện giao diện khi chưa đăng nhập
	// Khi component được mount mới gọi action getCurrent và render lại giao diện đã đăng nhập
	// useEffect(() => {
	//   const setTimeOutid = setTimeout(() => {
	//     if (isLoggedIn && !current) {
	//       dispatch(getCurrent());
	//     }
	//   }, 1000);
	// }, [current, dispatch, isLoggedIn]);

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
		<div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2 w-full text-white">
			<div className="max-w-screen-xl mx-auto flex justify-between items-center px-4">
				{/* Left side - Contact info */}
				<div className="flex items-center gap-2">
					<Phone
						size={14}
						className="animate-bounce"
					/>
					<span className="text-sm font-medium tracking-wide hidden sm:inline">
						ORDER ONLINE OR CALL US:
					</span>
					<a
						href="tel:+848000808"
						className="text-sm font-semibold hover:text-blue-200 transition-colors">
						(+84) 8000 8080
					</a>
				</div>

				{/* Right side - User section */}
				{isLoggedIn && current ? (
					<div className="flex items-center gap-3 group relative">
						<div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/30 transition-all cursor-pointer">
							<div className="h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-xs overflow-hidden">
								{current.avatar ? (
									<img
										src={current.avatar}
										alt={current.name}
										className="w-full h-full object-cover rounded-full"
									/>
								) : (
									<span className="text-lg">
										{current.name.charAt(0).toUpperCase()}
									</span>
								)}
							</div>
							<span className="text-sm font-medium">
								{current.name}
							</span>
							<ChevronDown size={14} />
						</div>

						{/* Dropdown menu */}
						<div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
							<Link
								to={`/${path.MEMBER}/${path.PERSONAL}`}
								className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
								<User size={14} />
								<span>My Profile</span>
							</Link>
							<Link
								to="/orders"
								className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
								<svg
									className="w-3.5 h-3.5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
								<span>My Orders</span>
							</Link>
							<div className="border-t border-gray-100 my-1"></div>
							<button
								className="flex items-center gap-2 px-4 py-2 cursor-pointer text-red-600 hover:bg-gray-100 w-full text-left text-sm"
								onClick={handleLogoutClick}>
								<LogOut size={14} />
								<span>Logout</span>
							</button>
						</div>
					</div>
				) : (
					<Link
						to={`/${path.LOGIN}`}
						className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 hover:bg-white/20 transition-all">
						<User size={14} />
						<span className="text-sm font-medium">
							Sign In or Create Account
						</span>
					</Link>
				)}
			</div>

			{showLogoutConfirm && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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

export default memo(TopHeader);
