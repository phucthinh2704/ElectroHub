// Public.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiGetCurrent, apiLogout } from "../../apis";
import { Footer, Header, Navigation, TopHeader } from "../../components";
import { logout } from "../../store/user/userSlice";
import path from "../../utils/path";
import { toast } from "react-toastify";

const Public = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isLoginPage = location.pathname === `/${path.LOGIN}`;
	const isForgotPasswordPage = location.pathname.includes("password");
	const { token, isLoggedIn } = useSelector((state) => state.user);

	console.log("Token: ", token);
	console.log("Is Logged In: ", isLoggedIn);
	useEffect(() => {
		const checkToken = () => {
			setTimeout(async () => {
				if (token && isLoggedIn) {
					try {
						const response = await apiGetCurrent();
						if (!response.success) {
							Swal.fire({
								icon: "error",
								title: "Session Expired",
								text: "Your session has expired. Please log in again to continue.",
								showCancelButton: true,
								confirmButtonText: "Login",
								cancelButtonText: "Cancel",
							}).then(async (result) => {
								const response = await apiLogout();
								if (!response.success) {
									return toast.error(response.message);
								}
								dispatch(logout());
								if (result.isConfirmed) {
									scrollTo(0, 0);
									navigate(`/${path.LOGIN}`);
								}
							});
						}
					} catch (error) {
						dispatch(logout());
						navigate(`/${path.LOGIN}`);
						console.log("Error verifying token:", error);
					}
				}
			}, 1000);
		};

		checkToken();
	}, [dispatch, isLoggedIn, navigate, token]);

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

export default Public;
