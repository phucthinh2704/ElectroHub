import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import path from "../../utils/path";

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
		<div>
			Member nè
			<Outlet></Outlet>
		</div>
	);
};

export default MemberLayout;
