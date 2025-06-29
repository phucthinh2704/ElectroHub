import {
	ArrowRight,
	Calendar,
	Eye,
	Heart,
	Tag,
	ThumbsDown,
	User,
} from "lucide-react";
import moment from "moment";
import { memo } from "react";
import { Link } from "react-router-dom";
const BlogCard = ({ post, featured = false }) => {
	const formatViews = (views) => {
		if (views >= 1000) {
			return (views / 1000).toFixed(1) + "K";
		}
		return views.toString();
	};
	return (
		<article
			className={`h-full group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col`}>
			{/* Image */}
			<Link to={`/blogs/${post._id}`}>
				<div className="relative overflow-hidden cursor-pointer">
					<img
						src={post.image}
						alt={post.title}
						className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
							featured ? "h-64 lg:h-80" : "h-48"
						}`}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

					{/* Category Badge */}
					<div className="absolute top-4 left-4">
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-lg">
							<Tag className="w-3 h-3 mr-1" />
							{post.category}
						</span>
					</div>

					{/* Featured Badge */}
					{featured && (
						<div className="absolute top-4 right-4">
							<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
								⭐ Highlighted
							</span>
						</div>
					)}
				</div>
			</Link>

			{/* Content */}
			<div className={`p-6 flex-1 flex flex-col`}>
				<Link to={`/blogs/${post._id}`}>
					<h3
						className={`font-bold cursor-pointer text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300 ${
							featured ? "text-xl lg:text-2xl" : "text-lg"
						}`}>
						{post.title}
					</h3>
	
					<p
						className={`text-gray-600 mb-4 line-clamp-3 leading-relaxed ${
							featured ? "text-base" : "text-sm"
						}`}>
						{post.description}
					</p>
				</Link>

				{/* Meta Info */}
				<div className="flex flex-col justify-end mt-auto">
					<div className="flex items-center justify-between text-sm text-gray-500 mb-2 space-x-4">
						<div className="flex items-center">
							<User className="w-4 h-4 mr-1" />
							<span>{post.author.name}</span>
						</div>
						<div className="flex items-center">
							<Calendar className="w-4 h-4 mr-1" />
							<span>
								{moment(post.createdAt).format("MMM D, YYYY")}
							</span>
						</div>
					</div>

					{/* Stats */}
					<div className="flex items-center justify-between pt-4 border-t border-gray-100">
						<div className="flex items-center space-x-4 text-sm text-gray-500">
							<div className="flex items-center">
								<Eye className="w-4 h-4 mr-1" />
								<span>
									{formatViews(post.numberViews)} views
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="flex items-center">
									<Heart className="w-4 h-4 mr-1 text-red-500" />
									<span>{post.likes.length}</span>
								</div>
								{post.dislikes.length > 0 && (
									<div className="flex items-center">
										<ThumbsDown className="w-4 h-4 mr-1 text-gray-400" />
										<span>{post.dislikes.length}</span>
									</div>
								)}
							</div>
						</div>

						<Link to={`/blogs/${post._id}`}>
							<button className="inline-flex cursor-pointer items-center text-blue-600 hover:text-red-700 font-semibold group-hover:translate-x-1 group-hover:text-red-600 transition-transform duration-300">
								Read more
								<ArrowRight className="w-4 h-4 ml-1" />
							</button>
						</Link>
					</div>
				</div>
			</div>
		</article>
	);
};
export default memo(BlogCard);
