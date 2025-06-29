import { ArrowRight, Filter, Pen, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetAllBlogs } from "../../apis/blog";
import { AddBlogModal } from "../../components";
import BlogCard from "../../components/public/blog/BlogCard";
import { categoriesBlog } from "../../utils/constants";

const Blogs = () => {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("newest");
	const [blogPosts, setBlogPosts] = useState([]);

	const { current } = useSelector((state) => state.user);

	const fetchBlogs = async () => {
		const response = await apiGetAllBlogs();
		if (response.success) {
			setBlogPosts(response.blogs);
		}
	};
	useEffect(() => {
		fetchBlogs();
	}, []);

	const categories = [
		"all",
		...categoriesBlog,
	];

	// Filter and sort posts
	const filteredPosts = blogPosts
		.filter((post) => {
			const matchesCategory =
				selectedCategory === "all" ||
				post.category === selectedCategory;
			const matchesSearch =
				post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.description
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			return matchesCategory && matchesSearch;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "newest":
					return new Date(b.createdAt) - new Date(a.createdAt);
				case "oldest":
					return new Date(a.createdAt) - new Date(b.createdAt);
				case "popular":
					return b.numberViews - a.numberViews;
				case "liked":
					return b.likes.length - a.likes.length;
				default:
					return 0;
			}
		});

	const featuredPosts = filteredPosts.filter((post) => post.featured);
	const regularPosts = filteredPosts.filter((post) => !post.featured);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			{/* Header */}
			<div className="bg-white shadow-sm border-b border-gray-300">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								TechBlog
							</span>
						</h1>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Update the latest news on technology, product
							reviews, and electronic trends
						</p>
					</div>

					{/* Search and Filter */}
					<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
						{/* Search */}
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Search posts..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full outline-none pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
							/>
						</div>

						{/* Filters */}
						<div className="flex flex-wrap gap-3 items-center">
							{/* Category Filter */}
							<div className="flex items-center space-x-2">
								<Filter className="w-5 h-5 text-gray-500" />
								<select
									value={selectedCategory}
									onChange={(e) =>
										setSelectedCategory(e.target.value)
									}
									className="px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
									{categories.map((category) => (
										<option
											key={category}
											value={category}>
											{category === "all"
												? "All Categories"
												: category}
										</option>
									))}
								</select>
							</div>

							{/* Sort Filter */}
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
								<option value="newest">Newest</option>
								<option value="oldest">Oldest</option>
								<option value="popular">Popular</option>
								<option value="liked">Liked</option>
							</select>
							{current?.role === "admin" && (
								<AddBlogModal fetchBlogs={fetchBlogs} />
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Featured Posts */}
				{featuredPosts.length > 0 && (
					<div className="mb-16">
						<div className="flex items-center mb-8">
							<h2 className="text-3xl font-bold text-gray-900">
								Featured Posts
							</h2>
							<div className="ml-4 h-1 flex-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{featuredPosts.map((post) => (
								<BlogCard
									key={post._id}
									post={post}
									featured={true}
								/>
							))}
						</div>
					</div>
				)}
				{/* Regular Posts */}
				<div>
					<div className="flex items-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900">
							Another Posts
						</h2>
						<div className="ml-4 h-1 flex-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
					</div>

					{regularPosts.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{regularPosts.map((post) => (
								<BlogCard
									key={post._id}
									post={post}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-16">
							<div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
								<Search className="w-12 h-12 text-gray-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No results found
							</h3>
							<p className="text-gray-600">
								Try adjusting your search or filter criteria.
							</p>
						</div>
					)}
				</div>

				{/* Load More Button */}
				{regularPosts.length > 0 && (
					<div className="text-center mt-12">
						<button className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
							Load more articles
							<ArrowRight className="w-5 h-5 ml-2" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Blogs;
