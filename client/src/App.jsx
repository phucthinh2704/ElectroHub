import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Home, Login, Public } from "./pages/public";
import { getCategories } from "./store/asyncActions";
import path from "./utils/path";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);
	
	return (
		<div className="min-h-screen font-main">
			<Routes>
				<Route
					path={path.PUBLIC}
					element={<Public />}>
					<Route
						path={path.HOME}
						element={<Home />}
					/>

					<Route
						path={path.LOGIN}
						element={<Login />}
					/>
				</Route>
			</Routes>
		</div>
	);
}

export default App;
