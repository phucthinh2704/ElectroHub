import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home, Public, Login } from "./pages/public";
import path from "./utils/path";

function App() {
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
