import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
import productSlice from "./products/productSlice";

const store = configureStore({
	reducer: {
		app: appSlice,
		products: productSlice,
	},
});
export default store;
