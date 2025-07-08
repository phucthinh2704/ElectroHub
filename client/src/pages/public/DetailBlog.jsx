import {
	Calendar,
	Eye,
	Heart,
	MessageCircle,
	Reply,
	Send,
	Share2,
	Tag,
	ThumbsDown,
	ThumbsUp,
	Trash2,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
	apiBlogById,
	apiCommentBlog,
	apiDeleteCommentBlog,
	apiDislikeBlog,
	apiGetAllBlogs,
	apiLikeBlog,
	apiLikeCommentBlog,
} from "../../apis/blog";
import avatarDefault from "../../assets/avatarDefault.png";
import BlogCard from "../../components/public/blog/BlogCard";
import path from "../../utils/path";
import LoadingSpinner from "../../components/public/loading/LoadingSpinner";

const DetailBlog = () => {
	const [isLiked, setIsLiked] = useState(false);
	const [isDisliked, setIsDisliked] = useState(false);
	const [likeCount, setLikeCount] = useState(0);
	const [dislikeCount, setDislikeCount] = useState(0);
	const [readingProgress, setReadingProgress] = useState(0);
	const [blog, setBlog] = useState({});
	const [relatedBlogs, setRelatedBlogs] = useState([]);

	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const navigate = useNavigate();
	const { current } = useSelector((state) => state.user);
	const { blogId } = useParams();

	const fetchBlogById = useCallback(async () => {
		try {
			const response = await apiBlogById(blogId);
			if (response.success) {
				setBlog(response.blog);
				setIsLiked(
					response.blog.likes.find(
						(user) =>
							current?._id?.toString() === user._id.toString()
					) !== undefined
				);
				setIsDisliked(
					response.blog.dislikes.find(
						(user) =>
							current?._id?.toString() === user._id.toString()
					) !== undefined
				);
				setLikeCount(response.blog.likes.length);
				setDislikeCount(response.blog.dislikes.length);
				setComments(
					response.blog.comments
						.filter((comment) => comment.postedBy?._id)
						.sort((a, b) => new Date(b.date) - new Date(a.date))
				);
			}
			setIsLoading(false);
		} catch (error) {
			console.log("Error fetching blog by ID:", error);
			setIsLoading(false);
		}
	}, [blogId, current]);
	useEffect(() => {
		fetchBlogById();
	}, [fetchBlogById]);

	useEffect(() => {
		const fetchRelatedBlogs = async () => {
			if (blog) {
				// Assuming you have an API to fetch related blogs by category
				const response = await apiGetAllBlogs({
					category: blog.category,
					limit: 4,
				});
				if (response.success) {
					setRelatedBlogs(
						response.blogs
							.map((blog) => (blog._id !== blogId ? blog : null))
							.filter(Boolean)
					);
				}
			}
		};
		fetchRelatedBlogs();
	}, [blog, blogId]);

	// Sample blog data
	// const blog = blog || {
	// 	_id: "64f8b2c3d1a2b3c4e5f6g7h8",
	// 	title: "10 Mẹo Tối Ưu Hóa Hiệu Suất Website Cho Năm 2025",
	// 	description:
	// 		"Khám phá những kỹ thuật và công cụ mới nhất để tăng tốc độ website và cải thiện trải nghiệm người dùng trong năm 2025.",
	// 	content: [
	// 		{
	// 			type: "paragraph",
	// 			text: "Trong thời đại công nghệ số hiện nay, tốc độ website không chỉ ảnh hưởng đến trải nghiệm người dùng mà còn tác động trực tiếp đến thứ hạng SEO và tỷ lệ chuyển đổi. Theo nghiên cứu của Google, chỉ cần trang web chậm thêm 1 giây có thể làm giảm 7% tỷ lệ chuyển đổi.",
	// 		},
	// 		{
	// 			type: "heading",
	// 			text: "1. Tối Ưu Hóa Hình Ảnh",
	// 		},
	// 		{
	// 			type: "paragraph",
	// 			text: "Hình ảnh thường chiếm 60-70% dung lượng của một trang web. Việc tối ưu hóa hình ảnh là bước đầu tiên và quan trọng nhất để cải thiện tốc độ tải trang.",
	// 		},
	// 		{
	// 			type: "list",
	// 			items: [
	// 				"Sử dụng định dạng WebP thay vì JPEG/PNG",
	// 				"Nén hình ảnh với công cụ như TinyPNG",
	// 				"Implement lazy loading cho hình ảnh",
	// 				"Sử dụng responsive images với srcset",
	// 			],
	// 		},
	// 		{
	// 			type: "heading",
	// 			text: "2. Minify CSS và JavaScript",
	// 		},
	// 		{
	// 			type: "paragraph",
	// 			text: "Việc loại bỏ khoảng trắng, comment và ký tự không cần thiết có thể giảm đáng kể kích thước file CSS và JavaScript.",
	// 		},
	// 	],
	// 	category: "Web Development",
	// 	numberViews: 1542,
	// 	likes: [],
	// 	dislikes: [],
	// 	image: "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
	// 	featured: true,
	// 	createdAt: "2024-12-15T10:30:00.000Z",
	// 	author: {
	// 		name: "Nguyễn Văn Tech",
	// 		avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
	// 		role: "Senior Developer",
	// 	},
	// };

	// Handle scroll for reading progress
	useEffect(() => {
		const handleScroll = () => {
			const totalHeight =
				document.documentElement.scrollHeight -
				document.documentElement.clientHeight;
			const progress = (window.scrollY / totalHeight) * 100;
			setReadingProgress(Math.min(progress, 100));
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleLike = async () => {
		try {
			const response = await apiLikeBlog(blog._id);
			if (response.success) {
				if (isDisliked) {
					setIsDisliked(false);
					setDislikeCount((prev) => prev - 1);
				}
				setIsLiked(!isLiked);
				setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
			} else {
				Swal.fire({
					icon: "warning",
					title: "",
					text: "Please login to like on this blog!",
					showCancelButton: true,
					confirmButtonText: "Login",
					cancelButtonText: "Cancel",
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
				}).then((result) => {
					if (result.isConfirmed) {
						navigate(`/${path.LOGIN}`, {
							state: window.location.pathname,
						});
					}
				});
			}
		} catch (error) {
			console.log("Error liking blog:", error);
		}
	};

	const handleDislike = async () => {
		try {
			const response = await apiDislikeBlog(blog._id);
			if (response.success) {
				if (isLiked) {
					setIsLiked(false);
					setLikeCount((prev) => prev - 1);
				}
				setIsDisliked(!isDisliked);
				setDislikeCount((prev) => (isDisliked ? prev - 1 : prev + 1));
			} else {
				Swal.fire({
					icon: "warning",
					title: "",
					text: "Please login to dislike on this blog!",
					showCancelButton: true,
					confirmButtonText: "Login",
					cancelButtonText: "Cancel",
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
				}).then((result) => {
					if (result.isConfirmed) {
						navigate(`/${path.LOGIN}`, {
							state: window.location.pathname,
						});
					}
				});
			}
		} catch (error) {
			console.log("Error disliking blog:", error);
		}
	};

	const handleComment = () => {
		setShowComments(!showComments);
	};

	const handleSubmitComment = async (e) => {
		if (e) e.preventDefault();
		if (newComment.trim()) {
			const comment = {
				comment: newComment.trim(),
			};
			try {
				const response = await apiCommentBlog(blog._id, comment);
				if (response.success) {
					setNewComment("");
					fetchBlogById();
				} else {
					Swal.fire({
						icon: "warning",
						title: "",
						text: "Please login to comment on this blog!",
						showCancelButton: true,
						confirmButtonText: "Login",
						cancelButtonText: "Cancel",
						confirmButtonColor: "#3085d6",
						cancelButtonColor: "#d33",
					}).then((result) => {
						if (result.isConfirmed) {
							navigate(`/${path.LOGIN}`, {
								state: window.location.pathname,
							});
						}
					});
				}
			} catch (error) {
				console.log("Error submitting comment:", error);
			}
		}
	};
	const handleDeleteComment = async (commentId) => {
		Swal.fire({
			title: "Delete Comment",
			text: "Are you sure you want to delete this comment?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Delete",
			cancelButtonText: "Cancel",
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await apiDeleteCommentBlog(
						blog._id,
						commentId
					);
					if (response.success) {
						fetchBlogById();
					}
				} catch (error) {
					console.log("Error deleting comment:", error);
				}
			}
		});
	};

	const handleLikeComment = async (commentId) => {
		try {
			const response = await apiLikeCommentBlog(blog._id, commentId);
			if (response.success) {
				fetchBlogById();
			} else {
				Swal.fire({
					icon: "warning",
					title: "",
					text: "Please login to like this comment!",
				});
			}
		} catch (error) {
			console.log("Error liking comment:", error);
		}
	};

	const renderContent = (contentArray) => {
		return contentArray.map((item, index) => {
			switch (item.type) {
				case "paragraph":
					return (
						<p
							key={index}
							className="text-gray-700 leading-relaxed mb-6 text-lg">
							{item.text}
						</p>
					);
				case "heading":
					return (
						<h2
							key={index}
							className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-l-4 border-blue-500 pl-4">
							{item.text}
						</h2>
					);
				case "list":
					return (
						<ul
							key={index}
							className="list-disc list-inside space-y-2 mb-6 ml-4">
							{item.items.map((listItem, listIndex) => (
								<li
									key={listIndex}
									className="text-gray-700 text-lg">
									{listItem}
								</li>
							))}
						</ul>
					);
				case "image": {
					return (
						<div
							key={index}
							className="mb-6">
							<img
								src={item.src}
								alt={item.alt || "Image"}
								className="w-full h-auto rounded-lg shadow-md"
							/>
							{item.caption && (
								<p className="text-gray-600 text-sm mt-2 text-center">
									{item.caption}
								</p>
							)}
						</div>
					);
				}
				default:
					return null;
			}
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			{/* Reading Progress Bar */}
			<div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
				<div
					className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
					style={{ width: `${readingProgress}%` }}
				/>
			</div>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className="max-w-4xl mx-auto px-4 py-8">
					{/* Hero Section */}
					<div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8">
						<img
							src={blog.image}
							alt={blog.title}
							className="w-full h-96 object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

						{/* Featured Badge */}
						{blog.featured && (
							<div className="absolute top-6 left-6">
								<span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
									⭐ Featured
								</span>
							</div>
						)}

						{/* Title Overlay */}
						<div className="absolute bottom-0 left-0 right-0 p-8">
							<div className="flex items-center gap-3 mb-4">
								<span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
									<Tag className="w-3 h-3 inline mr-1" />
									{blog.category}
								</span>
							</div>
							<h1 className="text-4xl font-bold text-white mb-4 leading-tight">
								{blog.title}
							</h1>
							<p className="text-white/90 text-lg leading-relaxed">
								{blog.description}
							</p>
						</div>
					</div>

					{/* Author & Meta Info */}
					<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
						<div className="flex items-center justify-between flex-wrap gap-4">
							<div className="flex items-center gap-4">
								<img
									src={blog.author.avatar || avatarDefault}
									alt={blog.author.name}
									className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-100"
								/>
								<div>
									<h3 className="font-semibold text-gray-900 text-lg">
										{blog.author.name}
									</h3>
									<p className="text-blue-600 font-medium">
										{blog.author.email}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-6 text-gray-600">
								<div className="flex items-center gap-2">
									<Calendar className="w-5 h-5" />
									<span>
										{moment(blog.createdAt).format(
											"DD/MM/YYYY"
										)}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Eye className="w-5 h-5" />
									<span>
										{blog.numberViews.toLocaleString()}{" "}
										views
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
						<div className="prose prose-lg max-w-none">
							{renderContent(blog.content)}
						</div>
					</div>

					{/* Interaction Section */}
					<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
						<div className="flex items-center justify-between flex-wrap gap-4">
							<div className="flex items-center gap-4">
								<button
									onClick={handleLike}
									className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${
										isLiked
											? "bg-blue-500 text-white shadow-lg"
											: "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
									}`}>
									<ThumbsUp
										className={`w-5 h-5 ${
											isLiked ? "fill-current" : ""
										}`}
									/>
									<span className="font-medium">
										{likeCount}
									</span>
								</button>

								<button
									onClick={handleDislike}
									className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-full transition-all duration-300 ${
										isDisliked
											? "bg-red-500 text-white shadow-lg"
											: "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
									}`}>
									<ThumbsDown
										className={`w-5 h-5 ${
											isDisliked ? "fill-current" : ""
										}`}
									/>
									<span className="font-medium">
										{dislikeCount}
									</span>
								</button>
							</div>

							<div className="flex items-center gap-3">
								<button
									onClick={handleComment}
									className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors cursor-pointer ${
										showComments
											? "bg-green-500 text-white shadow-lg"
											: "bg-green-100 text-green-700 hover:bg-green-200"
									}`}>
									<MessageCircle className="w-5 h-5" />
									<span className="font-medium">
										Comment ({comments.length})
									</span>
								</button>
								<button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
									<Share2 className="w-5 h-5" />
									<span className="font-medium">Share</span>
								</button>
							</div>
						</div>
					</div>

					{/* Comments Section */}
					{showComments && (
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-6">
								Comments ({comments.length})
							</h3>

							{/* Comment Form */}
							<div className="mb-6">
								<div className="flex gap-3">
									<img
										src={current?.avatar || avatarDefault}
										alt={current?.name}
										className="w-10 h-10 rounded-full object-cover"
									/>
									<div className="flex-1">
										<textarea
											value={newComment}
											onChange={(e) =>
												setNewComment(e.target.value)
											}
											placeholder="Write your feeling about this post..."
											className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											rows="3"
											maxLength="500"
											onKeyDown={(e) => {
												if (
													e.key === "Enter" &&
													(e.ctrlKey || e.metaKey)
												) {
													e.preventDefault();
													handleSubmitComment(e);
												}
											}}
										/>
										<div className="flex items-center justify-between mt-2">
											<span className="text-sm text-gray-500">
												{newComment.length}/500
												characters
											</span>
											<button
												onClick={handleSubmitComment}
												disabled={!newComment.trim()}
												className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
												<Send className="w-4 h-4" />
												Submit
											</button>
										</div>
									</div>
								</div>
							</div>

							{/* Comments List */}
							<div className="space-y-4">
								{comments.map((comment) => (
									<div
										key={comment._id}
										className="flex gap-3 p-4 bg-gray-50 rounded-lg">
										<div className="flex-shrink-0">
											<img
												src={
													comment.postedBy?.avatar ||
													avatarDefault
												}
												alt={comment.postedBy?.name}
												className="w-10 h-10 rounded-full object-cover"
											/>
										</div>

										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<h5 className="font-medium text-gray-900">
													{comment.postedBy?.name}
												</h5>
												<span className="text-sm text-gray-500">
													{moment(
														comment.date
													).format(
														"DD/MM/YYYY HH:mm"
													)}
												</span>
											</div>

											<p className="text-gray-700 mb-3 leading-relaxed">
												{comment.comment}
											</p>

											<div className="flex items-center gap-4">
												<button
													onClick={() =>
														handleLikeComment(
															comment._id
														)
													}
													className={`flex items-center gap-1 text-sm transition-colors cursor-pointer ${
														comment.likes.includes(
															current?._id
														)
															? "text-red-500"
															: "text-gray-500 hover:text-red-500"
													}`}>
													<Heart
														className={`w-4 h-4 ${
															comment.likes.includes(
																current?._id
															)
																? "fill-current"
																: ""
														}`}
													/>
													<span>
														{comment.likes.length}
													</span>
												</button>

												<button className="flex gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
													Reply
													<Reply className="w-4 h-4" />
												</button>

												{(comment.postedBy?._id ===
													current?._id ||
													current?.role ===
														"admin") && (
													<button
														className="flex gap-1 text-sm text-red-500 hover:text-red-700 hover:scale-105 transition-all cursor-pointer"
														onClick={() =>
															handleDeleteComment(
																comment._id
															)
														}>
														<Trash2 className="w-4 h-4" />
														Delete
													</button>
												)}
											</div>
										</div>
									</div>
								))}
							</div>

							{comments.length === 0 && (
								<div className="text-center py-8 text-gray-500">
									<MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
									<p>
										No comments yet. Be the first to
										comment!
									</p>
								</div>
							)}
						</div>
					)}

					{/* Related Articles Preview */}
					<div className="bg-white rounded-xl shadow-lg p-6 mt-6">
						<h3 className="text-2xl font-bold text-gray-900 mb-6">
							Related Post
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							{relatedBlogs.map((relatedBlog) => (
								<BlogCard
									key={relatedBlog._id}
									post={relatedBlog}
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DetailBlog;
