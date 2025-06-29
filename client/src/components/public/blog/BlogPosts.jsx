import { ArrowRight, Newspaper } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetAllBlogs } from "../../../apis/blog";
import path from "../../../utils/path";
import BlogCard from "./BlogCard";

const BlogPosts = () => {
	const [blogPosts, setBlogPosts] = useState([]);

	useEffect(() => {
		const fetchBlogs = async () => {
			const response = await apiGetAllBlogs({ limit: 3 });
			if (response.success) {
				setBlogPosts(response.blogs);
			}
		};

		fetchBlogs();
	}, []);

	return (
		<div>
			<div className="relative overflow-hidden rounded-lg shadow-sm bg-gradient-to-r from-violet-50 to-white p-4 border-l-4 border-violet-500 mb-3">
				<div className="flex items-center">
					<Newspaper
						className="text-violet-500 mr-3"
						size={22}
					/>
					<h3 className="text-xl font-bold uppercase text-gray-800">
						Blog Posts
					</h3>
				</div>
				<div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 bg-violet-100 rounded-full opacity-50"></div>
				<div className="absolute bottom-0 right-0 w-8 h-8 mb-1 mr-1 bg-violet-100 rounded-full opacity-70"></div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{blogPosts.map((post) => (
					<BlogCard
						key={post._id}
						post={post}
					/>
				))}
			</div>
			<Link
				to={`/${path.BLOGS}`}
				className="flex justify-center">
				<button className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white text-xl font-medium rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg cursor-pointer mx-auto mt-6">
					See more
					<ArrowRight className="w-4 h-4 ml-1" />
				</button>
			</Link>
		</div>
	);
};

export default memo(BlogPosts);
