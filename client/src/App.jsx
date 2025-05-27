// App.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import {
	Home,
	Login,
	PublicLayout,
	Products,
	Blogs,
	Services,
	DetailProduct,
	FAQ,
	ForgotPassword,
	ResetPassword,
} from "./pages/public";
import {
	AdminLayout,
	AdminDashboard,
	CreateProduct,
	ManageOrders,
	ManageUsers,
	ManageProducts,
} from "./pages/admin";
import { MemberLayout, Personal } from "./pages/member";
import { getCategories } from "./store/app/asyncActions";
import path from "./utils/path";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScrollToTop } from "./components";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	return <div className="min-h-screen font-main">
    <ScrollToTop />
      <Routes>
        <Route path={path.PUBLIC} element={<PublicLayout />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.PRODUCTS_CATEGORY} element={<Products />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.PRODUCTS_DETAIL} element={<DetailProduct />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.ALL} element={<Home />} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<AdminDashboard />} />
          <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
          <Route path={path.MANAGE_ORDERS} element={<ManageOrders />} />
          <Route path={path.MANAGE_USERS} element={<ManageUsers />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
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
        theme="dark"
      />
  </div>;
}

export default App;
