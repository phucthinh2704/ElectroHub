// App.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ScrollToTop } from "./components";
import {
	AdminDashboard,
	AdminLayout,
	CreateProduct,
	ManageOrders,
	ManageProducts,
	ManageUsers,
} from "./pages/admin";
import {
	MemberLayout,
	Personal,
	MyCart,
	Wishlist,
	OrderHistory,
	Checkout,
} from "./pages/member";
import {
	Blogs,
	DetailProduct,
	FAQ,
	ForgotPassword,
	Home,
	Login,
	Products,
	PublicLayout,
	ResetPassword,
	Services,
} from "./pages/public";
import { getCategories } from "./store/app/asyncActions";
import path from "./utils/path";
import Swal from "sweetalert2";
import { apiGetCurrent, apiLogout } from "./apis";
import { logout } from "./store/user/userSlice";

function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	const { token, isLoggedIn } = useSelector((state) => state.user);

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
								if (response.success) {
									dispatch(logout());
								}
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
		<div className="min-h-screen font-main">
			<ScrollToTop />
			<Routes>
				<Route
					path={path.CHECKOUT}
					element={<Checkout />}
				/>
				<Route
					path={path.PUBLIC}
					element={<PublicLayout />}>
					<Route
						path={path.HOME}
						element={<Home />}
					/>
					<Route
						path={path.PRODUCTS_CATEGORY}
						element={<Products />}
					/>
					<Route
						path={path.BLOGS}
						element={<Blogs />}
					/>
					<Route
						path={path.OUR_SERVICES}
						element={<Services />}
					/>
					<Route
						path={path.FAQ}
						element={<FAQ />}
					/>
					<Route
						path={path.PRODUCTS_DETAIL}
						element={<DetailProduct />}
					/>
					<Route
						path={path.LOGIN}
						element={<Login />}
					/>
					<Route
						path={path.FORGOT_PASSWORD}
						element={<ForgotPassword />}
					/>
					<Route
						path={path.RESET_PASSWORD}
						element={<ResetPassword />}
					/>
					<Route
						path={path.ALL}
						element={<Home />}
					/>
				</Route>
				<Route
					path={path.ADMIN}
					element={<AdminLayout />}>
					<Route
						path={path.DASHBOARD}
						element={<AdminDashboard />}
					/>
					<Route
						path={path.CREATE_PRODUCT}
						element={<CreateProduct />}
					/>
					<Route
						path={path.MANAGE_ORDERS}
						element={<ManageOrders />}
					/>
					<Route
						path={path.MANAGE_USERS}
						element={<ManageUsers />}
					/>
					<Route
						path={path.MANAGE_PRODUCTS}
						element={<ManageProducts />}
					/>
				</Route>
				<Route
					path={path.MEMBER}
					element={<MemberLayout />}>
					<Route
						path={path.PERSONAL}
						element={<Personal />}
					/>
					<Route
						path={path.MY_CART}
						element={<MyCart />}
					/>
					<Route
						path={path.WISHLIST}
						element={<Wishlist />}
					/>
					<Route
						path={path.ORDER_HISTORY}
						element={<OrderHistory />}
					/>
				</Route>
			</Routes>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				style={{
					minWidth: "100px",
					fontSize: "15px",
				}}
				toastStyle={{
					minWidth: "100px",
					padding: "10px",
				}}
			/>
		</div>
	);
}

export default App;
