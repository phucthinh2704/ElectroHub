import React from "react";
import { Sidebar, Banner } from "../../components";

const Home = () => {
	return (
		<div className="w-(--main-width) flex gap-5">
			<div className="flex flex-col gap-5 w-[25%] flex-auto">
				<Sidebar></Sidebar>
				<span>Deal Daily</span>
			</div>
			<div className="flex flex-col gap-5 w-[75%] flex-auto">
				<Banner></Banner>
				<span>Best Seller</span>
			</div>
		</div>
	);
};

export default Home;
