import { X, Eye, Heart, Calendar, User, Tag, Clock } from "lucide-react";
import moment from "moment";
import React, { memo, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const BlogDetail = ({ post, onClose }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);

	// Mock data structure based on your provided fields
	const blogPost = post || {
		_id: "685d6a429f17f99ac933609e",
		title: "iPhone 15 Pro Max: Đánh giá chi tiết camera và hiệu năng mới nhất",
		description: "Khám phá những tính năng độc đáo phá của iPhone 15 Pro Max với camera 48MP...",
		category: "Smartphone",
		numberViews: 999,
		likes: [],
		dislikes: [],
		image: "https://images.unsplash.com/photo-1695048133142-1a20484d25639?w=600&h=400",
		author: "ADMIN",
		featured: true,
		createdAt: "2025-06-26T15:41:54.717+00:00",
		updatedAt: "2025-06-26T15:41:54.717+00:00",
		content: ["123456", "999999"],
		v: 0
	};

	const handleLike = () => {
		setIsLiked(!isLiked);
		setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
	};

	const formatContent = (content) => {
		if (Array.isArray(content)) {
			return content.join('\n\n');
		}
		return content || '';
	};

	return (
		<div className="w-4xl mx-auto bg-white rounded-lg shadow-2xl text-black relative max-h-screen overflow-y-auto">
			{/* Close button */}
			<button
				onClick={onClose}
				className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer z-10 bg-white rounded-full shadow-md"
				type="button">
				<X size={24} />
			</button>

			{/* Hero Image */}
			<div className="relative h-96 overflow-hidden rounded-t-lg">
				<Zoom>
					<img
						src={blogPost.image}
						alt={blogPost.title}
						className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
						loading="lazy"
						decoding="async"
					/>
				</Zoom>
				{blogPost.featured && (
					<div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
						✨ Featured
					</div>
				)}
			</div>

			<div className="p-8">
				{/* Header Section */}
				<div className="mb-6">
					<div className="flex items-center gap-2 mb-3">
						<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
							<Tag size={14} className="inline mr-1" />
							{blogPost.category}
						</span>
					</div>
					
					<h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
						{blogPost.title}
					</h1>
					
					<p className="text-xl text-gray-600 mb-6 leading-relaxed">
						{blogPost.description}
					</p>
				</div>

				{/* Meta Information */}
				<div className="bg-gray-50 p-6 rounded-xl mb-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						<div className="flex items-center gap-2">
							<User className="text-blue-600" size={20} />
							<div>
								<p className="text-sm text-gray-500">Author</p>
								<p className="font-semibold text-gray-800">{blogPost.author}</p>
							</div>
						</div>
						
						<div className="flex items-center gap-2">
							<Calendar className="text-green-600" size={20} />
							<div>
								<p className="text-sm text-gray-500">Published</p>
								<p className="font-semibold text-gray-800">
									{moment(blogPost.createdAt).format("MMM DD, YYYY")}
								</p>
							</div>
						</div>
						
						<div className="flex items-center gap-2">
							<Eye className="text-purple-600" size={20} />
							<div>
								<p className="text-sm text-gray-500">Views</p>
								<p className="font-semibold text-gray-800">{blogPost.numberViews?.toLocaleString()}</p>
							</div>
						</div>
						
						<div className="flex items-center gap-2">
							<Clock className="text-orange-600" size={20} />
							<div>
								<p className="text-sm text-gray-500">Last Updated</p>
								<p className="font-semibold text-gray-800">
									{moment(blogPost.updatedAt).format("MMM DD, YYYY")}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Content Section */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
						Article Content
					</h2>
					
					<div className="prose prose-lg max-w-none">
						<div className="bg-white border-l-4 border-blue-500 pl-6 py-4 rounded-r-lg shadow-sm">
							<div className="whitespace-pre-line text-gray-700 leading-relaxed text-lg">
								{formatContent(blogPost.content)}
							</div>
						</div>
					</div>
				</div>

				{/* Engagement Section */}
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-6">
							<button
								onClick={handleLike}
								className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
									isLiked
										? "bg-red-500 text-white shadow-lg"
										: "bg-white text-gray-600 hover:bg-red-50 border border-gray-300"
								}`}>
								<Heart
									size={20}
									className={isLiked ? "fill-current" : ""}
								/>
								<span className="font-medium">{likeCount}</span>
							</button>
							
							<div className="flex items-center gap-2 text-gray-600">
								<Eye size={20} />
								<span className="font-medium">{blogPost.numberViews?.toLocaleString()} views</span>
							</div>
						</div>
						
						<div className="text-sm text-gray-500">
							Post ID: <span className="font-mono">{blogPost._id}</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
					<button
						type="button"
						className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
						Edit Post
					</button>
					
					<button
						type="button"
						className="px-6 py-3 cursor-pointer bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
						Share Post
					</button>
					
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-3 cursor-pointer bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(BlogDetail);