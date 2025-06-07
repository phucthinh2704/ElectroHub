// Public.js
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer, Header, Navigation, TopHeader } from "../../components";
import path from "../../utils/path";

const PublicLayout = () => {
	const location = useLocation();
	const isLoginPage = location.pathname === `/${path.LOGIN}`;
	const isForgotPasswordPage = location.pathname.includes("password");

	return (
		<div className="w-full flex flex-col items-center">
			<TopHeader />
			<Header />
			{!isLoginPage && !isForgotPasswordPage && <Navigation />}
			<div className="w-full">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
};

export default PublicLayout;
