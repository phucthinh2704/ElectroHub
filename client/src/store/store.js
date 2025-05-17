import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
import productSlice from "./products/productSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userSlice from "./user/userSlice";

const commonConfig = {
	key: "shop/user",
	storage,
};

const userConfig = {
	...commonConfig,
	whitelist: ["isLoggedIn", "token"],		// là những trường localStorage sẽ lưu
}

const store = configureStore({
	reducer: {
		app: appSlice,
		products: productSlice,
		user: persistReducer(userConfig, userSlice), // Wrap the user slice with persistReducer
	},
});
export const persistor = persistStore(store);
export default store;
