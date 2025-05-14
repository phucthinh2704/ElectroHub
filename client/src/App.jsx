// App.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import {
  Home,
  Login,
  Public,
  Products,
  Blogs,
  Services,
  DetailProduct,
  FAQ,
} from "./pages/public";
import { getCategories } from "./store/app/asyncActions";
import path from "./utils/path";

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  
  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.DETAIL_PRODUCT} element={<DetailProduct />} />
          <Route path={path.LOGIN} element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;