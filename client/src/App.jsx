// App.js
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { apiGetCurrent, apiLogout } from "./apis";
import { LoadingSpinner, ScrollToTop } from "./components";
import { getCategories } from "./store/app/asyncActions";
import { logout } from "./store/user/userSlice";
import path from "./utils/path";
import { getCurrent } from "./store/user/asyncAction";

// ADMIN
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const CreateProduct = lazy(() => import("./pages/admin/CreateProduct"));
const ManageCategories = lazy(() => import("./pages/admin/ManageCategories"));
const ManageOrders = lazy(() => import("./pages/admin/ManageOrders"));
const ManageProducts = lazy(() => import("./pages/admin/ManageProducts"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));

// MEMBER
const Checkout = lazy(() => import("./pages/member/Checkout"));
const MemberLayout = lazy(() => import("./pages/member/MemberLayout"));
const MyCart = lazy(() => import("./pages/member/MyCart"));
const OrderHistory = lazy(() => import("./pages/member/OrderHistory"));
const Personal = lazy(() => import("./pages/member/Personal"));
const Wishlist = lazy(() => import("./pages/member/Wishlist"));

// PUBLIC
const Blogs = lazy(() => import("./pages/public/Blogs"));
const DetailBlog = lazy(() => import("./pages/public/DetailBlog"));
const DetailProduct = lazy(() => import("./pages/public/DetailProduct"));
const FAQ = lazy(() => import("./pages/public/FAQ"));
const ForgotPassword = lazy(() => import("./pages/public/ForgotPassword"));
const Home = lazy(() => import("./pages/public/Home"));
const Login = lazy(() => import("./pages/public/Login"));
const Products = lazy(() => import("./pages/public/Products"));
const ProductsPage = lazy(() => import("./pages/public/ProductsPage"));
const PublicLayout = lazy(() => import("./pages/public/PublicLayout"));
const ResetPassword = lazy(() => import("./pages/public/ResetPassword"));
const Services = lazy(() => import("./pages/public/Services"));
const NotFound = lazy(() => import("./pages/public/NotFound"));

function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getCategories());
		dispatch(getCurrent());
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
	const isLoginPage = location.pathname === `/${path.LOGIN}`;

	return (
		<div className="min-h-screen font-main">
			<ScrollToTop isLoginPage={isLoginPage} />
			<Suspense fallback={<LoadingSpinner />}>
				<Routes>
					<Route
						path={path.PUBLIC}
						element={<PublicLayout />}>
						<Route
							path={path.CHECKOUT}
							element={<Checkout />}
						/>
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
							path={path.DETAIL_BLOGS}
							element={<DetailBlog />}
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
							path={path.PRODUCTS_ALL}
							element={<ProductsPage />}
						/>
						<Route
							path={path.ALL}
							element={<NotFound />}
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
							path={path.MANAGE_CATEGORIES}
							element={<ManageCategories />}
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
			</Suspense>
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
