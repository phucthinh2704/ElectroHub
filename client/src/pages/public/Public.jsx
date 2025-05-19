// Public.js
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer, Header, Navigation, TopHeader } from "../../components";
import path from "../../utils/path";

const Public = () => {
	const location = useLocation();
	const isLoginPage = location.pathname === `/${path.LOGIN}`;
	const isForgotPasswordPage = location.pathname === `/${path.FORGOT_PASSWORD}`;
	
	return (
		<div className="w-full flex flex-col items-center">
			<TopHeader />
			<Header />
			{!isLoginPage && !isForgotPasswordPage && <Navigation />}
			<div className="w-(--main-width)">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
};

export default Public;
