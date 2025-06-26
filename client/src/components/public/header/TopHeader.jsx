import {
	ChevronDown,
	Heart,
	LogOut,
	Phone,
	ShoppingBag,
	ShoppingCart,
	User,
	Menu,
	X,
} from "lucide-react";
import React, { memo, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiLogout } from "../../../apis";
import avatarDefault from "../../../assets/avatarDefault.png";
import { logout } from "../../../store/user/userSlice";
import path from "../../../utils/path";

const TopHeader = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isLoggedIn, current } = useSelector((state) => state.user);
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showUserDropdown, setShowUserDropdown] = useState(false);
	const dropdownRef = useRef(null);
	const mobileMenuRef = useRef(null);

	// Handle click outside để đóng dropdown và mobile menu
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setShowUserDropdown(false);
			}
			if (
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target)
			) {
				setShowMobileMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogoutClick = () => {
		setShowLogoutConfirm(true);
		setShowUserDropdown(false);
		setShowMobileMenu(false);
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

	const toggleUserDropdown = () => {
		setShowUserDropdown(!showUserDropdown);
	};

	const toggleMobileMenu = () => {
		setShowMobileMenu(!showMobileMenu);
	};

	const closeMobileMenu = () => {
		setShowMobileMenu(false);
	};

	return (
		<>
			<div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2 w-full text-white relative">
				<div className="max-w-screen-xl mx-auto flex justify-between items-center px-3 sm:px-4">
					{/* Left side - Contact info */}
					<div className="flex items-center gap-1 sm:gap-2">
						<Phone
							size={14}
							className="animate-bounce flex-shrink-0"
						/>
						<span className="text-xs sm:text-sm font-medium tracking-wide hidden md:inline">
							ORDER ONLINE OR CALL US:
						</span>
						<span className="text-xs sm:text-sm font-medium tracking-wide md:hidden">
							CALL:
						</span>
						<a
							href="tel:+848000808"
							className="text-xs sm:text-sm font-semibold hover:text-blue-200 transition-colors whitespace-nowrap">
							(+84) 8000 8080
						</a>
					</div>

					{/* Right side - User section */}
					<div className="flex items-center gap-2">
						{isLoggedIn && current ? (
							<>
								{/* Desktop User Menu */}
								<div
									className="hidden sm:flex items-center gap-3 relative"
									ref={dropdownRef}>
									<div
										className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/30 transition-all cursor-pointer"
										onClick={toggleUserDropdown}>
										<div className="h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-xs overflow-hidden flex-shrink-0">
											{current.avatar ? (
												<img
													src={current.avatar}
													alt={current.name}
													className="w-full h-full object-cover rounded-full"
												/>
											) : (
												<img
													src={avatarDefault}
													alt={current.name}
													className="w-full h-full object-cover rounded-full"
												/>
											)}
										</div>
										<span className="text-sm font-medium max-w-24 truncate">
											{current.name}
										</span>
										<ChevronDown
											size={14}
											className={`transition-transform ${
												showUserDropdown
													? "rotate-180"
													: ""
											}`}
										/>
									</div>

									{/* Desktop Dropdown menu */}
									{showUserDropdown && (
										<div className="absolute top-full right-0 w-48 mt-1 border border-gray-300 bg-white rounded-lg shadow-xl py-2 z-50">
											<Link
												to={`/${path.MEMBER}/${path.PERSONAL}`}
												className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
												onClick={() =>
													setShowUserDropdown(false)
												}>
												<User size={14} />
												<span className="p-1">
													My Profile
												</span>
											</Link>
											<Link
												to={`/${path.MEMBER}/${path.MY_CART}`}
												className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
												onClick={() =>
													setShowUserDropdown(false)
												}>
												<ShoppingCart size={14} />
												<span className="relative block p-1">
													Cart
													<span className="absolute -right-7 top-1/2 transform -translate-y-1/2 bg-main w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white">
														{current.cart.length}
													</span>
												</span>
											</Link>
											<Link
												to={`/${path.MEMBER}/${path.WISHLIST}`}
												className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
												onClick={() =>
													setShowUserDropdown(false)
												}>
												<Heart size={14} />
												<span className="relative block p-1">
													Wishlist
													<span className="absolute -right-7 top-1/2 transform -translate-y-1/2 bg-main w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white">
														{
															current.wishlist
																.length
														}
													</span>
												</span>
											</Link>
											<Link
												to={`/${path.MEMBER}/${path.ORDER_HISTORY}`}
												className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
												onClick={() =>
													setShowUserDropdown(false)
												}>
												<ShoppingBag size={14} />
												<span className="p-1">
													My Orders
												</span>
											</Link>
											<div className="border-t border-gray-100 my-1"></div>
											<button
												className="flex items-center gap-2 px-4 py-2 cursor-pointer text-red-600 hover:bg-gray-100 w-full text-left text-sm"
												onClick={handleLogoutClick}>
												<LogOut size={14} />
												<span>Logout</span>
											</button>
										</div>
									)}
								</div>

								{/* Mobile User Avatar */}
								<div className="sm:hidden flex items-center gap-2">
									<div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-xs overflow-hidden">
										{current.avatar ? (
											<img
												src={current.avatar}
												alt={current.name}
												className="w-full h-full object-cover rounded-full"
											/>
										) : (
											<img
												src={avatarDefault}
												alt={current.name}
												className="w-full h-full object-cover rounded-full"
											/>
										)}
									</div>
									<button
										onClick={toggleMobileMenu}
										className="p-1 hover:bg-white/20 rounded transition-all cursor-pointer">
										{showMobileMenu ? (
											<X size={18} />
										) : (
											<Menu size={18} />
										)}
									</button>
								</div>
							</>
						) : (
							<Link
								to={`/${path.LOGIN}`}
								className="flex items-center gap-2 bg-white/10 rounded-full px-3 sm:px-4 py-1.5 hover:bg-white/20 transition-all">
								<User size={14} />
								<span className="text-xs sm:text-sm font-medium hidden xs:inline">
									Sign In
								</span>
								<span className="text-xs sm:text-sm font-medium xs:hidden">
									Login
								</span>
							</Link>
						)}
					</div>
				</div>

				{/* Mobile Menu */}
				{showMobileMenu && isLoggedIn && current && (
					<div
						className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t z-50"
						ref={mobileMenuRef}>
						<div className="py-2">
							<div className="px-4 py-3 border-b bg-gray-50">
								<div className="flex items-center gap-3">
									<div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm overflow-hidden">
										{current.avatar ? (
											<img
												src={current.avatar}
												alt={current.name}
												className="w-full h-full object-cover rounded-full"
											/>
										) : (
											<img
												src={avatarDefault}
												alt={current.name}
												className="w-full h-full object-cover rounded-full"
											/>
										)}
									</div>
									<div>
										<p className="font-semibold text-gray-800 text-sm">
											{current.name}
										</p>
										<p className="text-xs text-gray-500">
											Welcome back!
										</p>
									</div>
								</div>
							</div>

							<Link
								to={`/${path.MEMBER}/${path.PERSONAL}`}
								className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
								onClick={closeMobileMenu}>
								<User size={16} />
								<span className="font-medium">My Profile</span>
							</Link>

							<Link
								to={`/${path.MEMBER}/${path.MY_CART}`}
								className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
								onClick={closeMobileMenu}>
								<ShoppingCart size={16} />
								<span className="font-medium">Cart</span>
								<span className="ml-auto bg-main text-white text-xs px-2 py-1 rounded-full">
									{current.cart.length}
								</span>
							</Link>

							<Link
								to={`/${path.MEMBER}/${path.WISHLIST}`}
								className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
								onClick={closeMobileMenu}>
								<Heart size={16} />
								<span className="font-medium">Wishlist</span>
								<span className="ml-auto bg-main text-white text-xs px-2 py-1 rounded-full">
									{current.wishlist.length}
								</span>
							</Link>

							<Link
								to={`/${path.MEMBER}/${path.ORDER_HISTORY}`}
								className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
								onClick={closeMobileMenu}>
								<ShoppingBag size={16} />
								<span className="font-medium">My Orders</span>
							</Link>

							<button
								className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left"
								onClick={handleLogoutClick}>
								<LogOut size={16} />
								<span className="font-medium">Logout</span>
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Logout Confirmation Modal */}
			{showLogoutConfirm && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto overflow-hidden">
						{/* Header với icon */}
						<div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 sm:p-6 border-b border-red-100">
							<div className="flex items-center justify-center mb-3">
								<div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
									<LogOut className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
								</div>
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-center text-gray-800">
								Confirm Logout
							</h3>
						</div>

						{/* Content */}
						<div className="p-4 sm:p-6">
							<p className="text-gray-600 text-center mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
								Are you sure you want to log out of your
								account? You will need to log in again to
								continue using the service.
							</p>

							{/* Buttons */}
							<div className="flex flex-col sm:flex-row gap-3">
								<button
									onClick={handleCancelLogout}
									className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 cursor-pointer text-sm sm:text-base">
									Cancel
								</button>
								<button
									onClick={handleConfirmLogout}
									className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer text-sm sm:text-base">
									Log out
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(TopHeader);
