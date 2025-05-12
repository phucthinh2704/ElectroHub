import React from "react";
import { Banner, BestSeller, Sidebar, DealDaily } from "../../components";

const Home = () => {
	return (
		<div className="w-(--main-width) flex gap-5 min-h-[2000px]">
			<div className="flex flex-col gap-5 w-[25%] flex-auto">
				<Sidebar></Sidebar>
				<DealDaily></DealDaily>
			</div>
			<div className="flex flex-col gap-5 w-[75%] flex-auto">
				<Banner></Banner>
				<BestSeller></BestSeller>
			</div>
		</div>
	);
};

export default Home;
