import React from "react";
import { Sidebar, Banner } from "../../components";

const Home = () => {
	return (
		<div className="w-(--main-width) flex">
			<div className="flex flex-col gap-5 w-[30%] flex-auto border">
				<Sidebar></Sidebar>
				<span>Deal Daily</span>
			</div>
			<div className="flex flex-col gap-5 w-[70%] pl-5 flex-auto border">
				<Banner></Banner>
				<span>Best Seller</span>
			</div>
		</div>
	);
};

export default Home;
