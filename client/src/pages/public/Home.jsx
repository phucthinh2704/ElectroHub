import React, { useEffect } from "react";
import {
	Banner,
	BestSeller,
	Sidebar,
	DealDaily,
	FeaturedProducts,
	NewArrivals,
	HotCollections,
	BlogPosts
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { getNewProducts } from "../../store/products/asyncAction";

const Home = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getNewProducts());
	}, [dispatch]);
	const { newProducts } = useSelector((state) => state.products);
	const { categories } = useSelector((state) => state.app);
	
	return (
		<>
			<div className="w-(--main-width) flex gap-5">
				<div className="flex flex-col gap-5 w-[25%] flex-auto">
					<Sidebar></Sidebar>
					<DealDaily></DealDaily>
				</div>
				<div className="flex flex-col gap-5 w-[75%] flex-auto">
					<Banner></Banner>
					<BestSeller></BestSeller>
				</div>
			</div>
			<div className="my-16">
				<FeaturedProducts></FeaturedProducts>
			</div>
			<div className="my-16">
				<NewArrivals products={newProducts}></NewArrivals>
			</div>
			<div className="my-16">
				<HotCollections categories={categories}></HotCollections>
			</div>
			<div className="my-16">
				<BlogPosts></BlogPosts>
			</div>
			<div className="h-[100px]"></div>
		</>
	);
};

export default Home;
