import { Mail, Phone, ShoppingCart, User, Menu, X } from "lucide-react";
import React, { memo, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
import path from "../../../utils/path";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../../../store/user/asyncAction";

const Header = () => {
	const { current } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const mobileMenuRef = useRef(null);

	useEffect(() => {
		const setTimeOutId = setTimeout(() => {
			dispatch(getCurrent());
		}, 300);
		return () => clearTimeout(setTimeOutId);
	}, [dispatch]);

	// Handle click outside để đóng mobile menu
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
				setShowMobileMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleMobileMenu = () => {
		setShowMobileMenu(!showMobileMenu);
	};

	const closeMobileMenu = () => {
		setShowMobileMenu(false);
	};

	return (
		<>
			<header className="w-full max-w-screen-xl mx-auto py-2 px-3 sm:px-4 lg:px-6">
				<div className="flex justify-between items-center">
					{/* Logo */}
					<Link to={`/${path.HOME}`} className="flex-shrink-0">
						<img
							src={logo}
							alt="Electro Hub Digital Logo"
							loading="lazy"
							className="w-[160px] sm:w-[200px] lg:w-[234px] object-cover"
						/>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex text-[13px]">
						<div className="flex flex-col gap-1 justify-center items-center border-r border-gray-300 px-5 py-2">
							<p className="flex items-center gap-2 font-semibold">
								<Phone
									size={16}
									className="text-red-500"
									strokeWidth={2}
								/>
								<span>(+84) 8000 8080</span>
							</p>
							<p className="text-xs text-gray-500">
								Mon-Sat 9:00AM - 8:00PM
							</p>
						</div>
						<div
							className={`flex flex-col gap-1 items-center justify-center px-4 py-2 ${
								current ? "-mr-0 border-r border-gray-300" : "-mr-6"
							}`}>
							<p className="flex items-center gap-2 font-semibold">
								<Mail
									size={16}
									className="text-red-500"
									strokeWidth={2}
								/>
								<span>
									<a href="mailto:thinhphuc2704@gmail.com">
										electrohub-digital@support.com
									</a>
								</span>
							</p>
							<p className="text-xs text-gray-500">Online Support 24/7</p>
						</div>
						{current && (
							<>
								<Link 
									to={`/${path.MEMBER}/${path.MY_CART}`} 
									className="flex flex-col gap-1 items-center justify-center border-r border-gray-300 px-6 py-2 hover:bg-gray-50 transition-colors"
								>
									<ShoppingCart
										size={20}
										className="text-red-500"
										strokeWidth={2}
									/>
									<p className="text-xs text-gray-500">{`${current.cart.length || 0} item(s)`}</p>
								</Link>
								<Link
									to={
										current?.role === "admin"
											? `/${path.ADMIN}/${path.DASHBOARD}`
											: current?.role === "user"
											? `/${path.MEMBER}/${path.PERSONAL}`
											: `/${path.LOGIN}`
									}
									className="flex flex-col gap-1 items-center justify-center px-6 py-2 hover:bg-gray-50 transition-colors">
									<User
										size={20}
										className="text-red-500"
										strokeWidth={2}
									/>
									<p className="text-xs text-gray-500 hover:text-blue-500 cursor-pointer">
										{current?.role === "admin"
											? "Admin Panel"
											: "My Profile"}
									</p>
								</Link>
							</>
						)}
					</div>

					{/* Mobile/Tablet Actions */}
					<div className="flex lg:hidden items-center gap-2 sm:gap-4">
						{/* Quick Actions - Tablet */}
						<div className="hidden sm:flex items-center gap-3">
							<a 
								href="tel:+848000808" 
								className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-500 transition-colors"
							>
								<Phone size={16} className="text-red-500" />
								<span className="hidden md:inline">Call</span>
							</a>
							{current && (
								<Link 
									to={`/${path.MEMBER}/${path.MY_CART}`}
									className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-500 transition-colors relative"
								>
									<ShoppingCart size={16} className="text-red-500" />
									<span className="hidden md:inline">Cart</span>
									{current.cart.length > 0 && (
										<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{current.cart.length}
										</span>
									)}
								</Link>
							)}
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={toggleMobileMenu}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
							aria-label="Toggle mobile menu"
						>
							{showMobileMenu ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Contact Info - Always visible on small screens */}
				<div className="flex sm:hidden justify-center mt-3 pt-3 border-t border-gray-200">
					<div className="flex items-center gap-4 text-xs">
						<a 
							href="tel:+848000808" 
							className="flex items-center gap-1 text-gray-600"
						>
							<Phone size={14} className="text-red-500" />
							<span>(+84) 8000 8080</span>
						</a>
						<span className="text-gray-400">|</span>
						<a 
							href="mailto:thinhphuc2704@gmail.com" 
							className="flex items-center gap-1 text-gray-600"
						>
							<Mail size={14} className="text-red-500" />
							<span>Support</span>
						</a>
					</div>
				</div>
			</header>

			{/* Mobile Menu Overlay */}
			{showMobileMenu && (
				<div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={closeMobileMenu}>
					<div 
						className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform"
						onClick={(e) => e.stopPropagation()}
						ref={mobileMenuRef}
					>
						{/* Mobile Menu Header */}
						<div className="flex items-center justify-between p-4 border-b">
							<h2 className="text-lg font-semibold text-gray-800">Menu</h2>
							<button
								onClick={closeMobileMenu}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
							>
								<X size={20} />
							</button>
						</div>

						{/* Mobile Menu Content */}
						<div className="p-4 space-y-4">
							{/* Contact Information */}
							<div className="space-y-3">
								<h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Contact</h3>
								
								<a 
									href="tel:+848000808"
									className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
									onClick={closeMobileMenu}
								>
									<Phone size={18} className="text-red-500" />
									<div>
										<p className="font-medium text-gray-800">(+84) 8000 8080</p>
										<p className="text-xs text-gray-500">Mon-Sat 9:00AM - 8:00PM</p>
									</div>
								</a>

								<a 
									href="mailto:thinhphuc2704@gmail.com"
									className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
									onClick={closeMobileMenu}
								>
									<Mail size={18} className="text-red-500" />
									<div>
										<p className="font-medium text-gray-800 text-sm">electrohub-digital@support.com</p>
										<p className="text-xs text-gray-500">Online Support 24/7</p>
									</div>
								</a>
							</div>

							{/* User Actions */}
							{current && (
								<div className="space-y-3 pt-4 border-t">
									<h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Account</h3>
									
									<Link
										to={`/${path.MEMBER}/${path.MY_CART}`}
										className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
										onClick={closeMobileMenu}
									>
										<ShoppingCart size={18} className="text-red-500" />
										<div className="flex-1">
											<p className="font-medium text-gray-800">Shopping Cart</p>
											<p className="text-xs text-gray-500">{`${current.cart.length || 0} item(s)`}</p>
										</div>
										{current.cart.length > 0 && (
											<span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
												{current.cart.length}
											</span>
										)}
									</Link>

									<Link
										to={
											current?.role === "admin"
												? `/${path.ADMIN}/${path.DASHBOARD}`
												: current?.role === "user"
												? `/${path.MEMBER}/${path.PERSONAL}`
												: `/${path.LOGIN}`
										}
										className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
										onClick={closeMobileMenu}
									>
										<User size={18} className="text-red-500" />
										<div>
											<p className="font-medium text-gray-800">
												{current?.role === "admin" ? "Admin Panel" : "My Profile"}
											</p>
											<p className="text-xs text-gray-500">
												{current?.name || "User Account"}
											</p>
										</div>
									</Link>
								</div>
							)}

							{/* Quick Links */}
							<div className="space-y-3 pt-4 border-t">
								<h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Quick Links</h3>
								
								<Link
									to={`/${path.HOME}`}
									className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-800 font-medium"
									onClick={closeMobileMenu}
								>
									Home
								</Link>
								
								{!current && (
									<Link
										to={`/${path.LOGIN}`}
										className="block p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-600 font-medium"
										onClick={closeMobileMenu}
									>
										Sign In / Register
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(Header);