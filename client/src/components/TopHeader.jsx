import React, { memo } from "react";
import { Link } from "react-router-dom";
import path from "../utils/path";

const TopHeader = () => {
	return (
		<div className="bg-main p-2 w-full text-white text-xs">
			<div className="w-(--main-width) mx-auto flex justify-between items-center">
				<p>ORDER ONLINE OR CALL US (+84) 8000 8080</p>
				<Link to={`/${path.LOGIN}`}>Sign In or Create Account</Link>
			</div>
		</div>
	);
};

export default memo(TopHeader);
