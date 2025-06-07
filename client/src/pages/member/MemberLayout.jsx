import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import path from "../../utils/path";
import { MemberSidebar } from "../../components";

const MemberLayout = () => {
	const { current, isLoggedIn } = useSelector((state) => state.user);
	if (!isLoggedIn || !current) {
		return (
			<Navigate
				to={`/${path.LOGIN}`}
				replace={true}
			/>
		);
	}
	return (
		<div className="flex bg-black/80 min-h-screen text-white relative">
			<div className="fixed top-0 bottom-0 z-40">
				<MemberSidebar user={current} />
			</div>
			<div className="flex-1 ml-80 transition-all duration-300">
				<Outlet></Outlet>
			</div>
			
		</div>
	);
};

export default MemberLayout;
