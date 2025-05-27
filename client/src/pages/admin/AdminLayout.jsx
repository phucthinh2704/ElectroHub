import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { AdminSidebar } from "../../components";
import path from "../../utils/path";

const AdminLayout = () => {
	const { current, isLoggedIn } = useSelector((state) => state.user);

	if (!isLoggedIn || !current) {
		return (
			<Navigate
				to={`/${path.LOGIN}`}
				replace={true}
			/>
		);
	}

	if (current.role !== "admin") {
		Swal.fire({
			title: "Access Denied!",
			text: "You do not have permission to access this page. Please log in with the appropriate permissions to continue.",
			icon: "error",
			confirmButtonText: "OK",
		});
		return (
			<Navigate
				to={`/${path.HOME}`}
				replace={true}
			/>
		);
	}

	return (
		<div className="flex bg-black/80 min-h-screen text-white relative">
			{/* Sidebar */}
			<div className="fixed top-0 bottom-0 z-40">
				<AdminSidebar admin={current} />
			</div>

			{/* Main Content */}
			<div className="flex-1 ml-72 transition-all duration-300">
				{/* Top Bar */}
				<div className="bg-slate-800 border-b border-slate-700/50 px-6 py-4 sticky top-0 z-30">
					<h2 className="text-xl font-semibold text-white uppercase">
						Dashboard
					</h2>
					<p className="text-slate-400 text-sm">
						Welcome back to your admin panel
					</p>
				</div>

				{/* Page Content */}
				<div className="p-2">
					<div className="bg-slate-800/90 rounded-lg p-6">
						<Outlet></Outlet>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLayout;
