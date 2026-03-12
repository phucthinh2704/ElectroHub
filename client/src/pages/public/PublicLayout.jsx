import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
	BackToTop,
	Footer,
	Header,
	Navigation,
	TopHeader,
	Chatbot
} from "../../components";
import path from "../../utils/path";

const PublicLayout = () => {
	const location = useLocation();
	const isLoginPage = location.pathname === `/${path.LOGIN}`;
	const isForgotPasswordPage = location.pathname.includes("password");

	useEffect(() => {
		document.title = "Electro Hub Digital Store - E-Commerce";
		if (isLoginPage) {
			document.title = "Login - Electro Hub Digital Store";
		} else if (isForgotPasswordPage) {
			document.title = "Forgot Password - Electro Hub Digital Store";
		}
	}, [isForgotPasswordPage, isLoginPage]);

	return (
		<div className="w-full flex flex-col items-center">
			<TopHeader />
			<Header />
			{!isLoginPage && !isForgotPasswordPage && <Navigation />}
			<div className="w-full">
				<Outlet />
			</div>
			<Footer />
			<Chatbot />
			<BackToTop />
		</div>
	);
};

export default PublicLayout;
