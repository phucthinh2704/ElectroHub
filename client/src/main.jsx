import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import App from "./App.jsx";
import "./index.css";
import store, { persistor } from "./store/store.js";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<PersistGate
				loading={null}
				persistor={persistor}>
				<BrowserRouter
					future={{
						v7_relativeSplatPath: true,
						v7_startTransition: true,
					}}>
					<App />
				</BrowserRouter>
			</PersistGate>
		</Provider>
	</StrictMode>
);
