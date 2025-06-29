import {
	Calendar,
	Eye,
	MessageCircle,
	Share2,
	Tag,
	ThumbsDown,
	ThumbsUp,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiBlogById } from "../../apis/blog";
import avatarDefault from "../../assets/avatarDefault.png";

const DetailBlog = () => {
	const [isLiked, setIsLiked] = useState(false);
	const [isDisliked, setIsDisliked] = useState(false);
	const [likeCount, setLikeCount] = useState(245);
	const [dislikeCount, setDislikeCount] = useState(12);
	const [readingProgress, setReadingProgress] = useState(0);
	const [blog, setBlog] = useState(null);

	const { blogId } = useParams();

	useEffect(() => {
		const fetchBlogById = async () => {
			const response = await apiBlogById(blogId);
			if (response.success) {
				setBlog(response.blog);
            setLikeCount(response.blog.likes.length);
            setDislikeCount(response.blog.dislikes.length);
				console.log(response.blog);
			}
		};
		fetchBlogById();
	}, [blogId]);
	// Sample blog data
	const blogData = blog || {
		_id: "64f8b2c3d1a2b3c4e5f6g7h8",
		title: "10 Mẹo Tối Ưu Hóa Hiệu Suất Website Cho Năm 2025",
		description:
			"Khám phá những kỹ thuật và công cụ mới nhất để tăng tốc độ website và cải thiện trải nghiệm người dùng trong năm 2025.",
		content: [
			{
				type: "paragraph",
				text: "Trong thời đại công nghệ số hiện nay, tốc độ website không chỉ ảnh hưởng đến trải nghiệm người dùng mà còn tác động trực tiếp đến thứ hạng SEO và tỷ lệ chuyển đổi. Theo nghiên cứu của Google, chỉ cần trang web chậm thêm 1 giây có thể làm giảm 7% tỷ lệ chuyển đổi.",
			},
			{
				type: "heading",
				text: "1. Tối Ưu Hóa Hình Ảnh",
			},
			{
				type: "paragraph",
				text: "Hình ảnh thường chiếm 60-70% dung lượng của một trang web. Việc tối ưu hóa hình ảnh là bước đầu tiên và quan trọng nhất để cải thiện tốc độ tải trang.",
			},
			{
				type: "list",
				items: [
					"Sử dụng định dạng WebP thay vì JPEG/PNG",
					"Nén hình ảnh với công cụ như TinyPNG",
					"Implement lazy loading cho hình ảnh",
					"Sử dụng responsive images với srcset",
				],
			},
			{
				type: "heading",
				text: "2. Minify CSS và JavaScript",
			},
			{
				type: "paragraph",
				text: "Việc loại bỏ khoảng trắng, comment và ký tự không cần thiết có thể giảm đáng kể kích thước file CSS và JavaScript.",
			},
		],
		category: "Web Development",
		numberViews: 1542,
		likes: [],
		dislikes: [],
		image: "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
		featured: true,
		createdAt: "2024-12-15T10:30:00.000Z",
		author: {
			name: "Nguyễn Văn Tech",
			avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
			role: "Senior Developer",
		},
	};

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

	const handleLike = () => {
		if (isDisliked) {
			setIsDisliked(false);
			setDislikeCount((prev) => prev - 1);
		}
		setIsLiked(!isLiked);
		setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
	};

	const handleDislike = () => {
		if (isLiked) {
			setIsLiked(false);
			setLikeCount((prev) => prev - 1);
		}
		setIsDisliked(!isDisliked);
		setDislikeCount((prev) => (isDisliked ? prev - 1 : prev + 1));
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

			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Hero Section */}
				<div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8">
					<img
						src={blogData.image}
						alt={blogData.title}
						className="w-full h-96 object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

					{/* Featured Badge */}
					{blogData.featured && (
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
								{blogData.category}
							</span>
						</div>
						<h1 className="text-4xl font-bold text-white mb-4 leading-tight">
							{blogData.title}
						</h1>
						<p className="text-white/90 text-lg leading-relaxed">
							{blogData.description}
						</p>
					</div>
				</div>

				{/* Author & Meta Info */}
				<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
					<div className="flex items-center justify-between flex-wrap gap-4">
						<div className="flex items-center gap-4">
							<img
								src={blogData.author.avatar || avatarDefault}
								alt={blogData.author.name}
								className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-100"
							/>
							<div>
								<h3 className="font-semibold text-gray-900 text-lg">
									{blogData.author.name}
								</h3>
								<p className="text-blue-600 font-medium">
									{blogData.author.email}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-6 text-gray-600">
							<div className="flex items-center gap-2">
								<Calendar className="w-5 h-5" />
								<span>
									{moment(blogData.createdAt).format(
										"DD/MM/YYYY"
									)}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Eye className="w-5 h-5" />
								<span>
									{blogData.numberViews.toLocaleString()}{" "}
									views
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
					<div className="prose prose-lg max-w-none">
						{renderContent(blogData.content)}
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
								<span className="font-medium">{likeCount}</span>
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
							<button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
								<MessageCircle className="w-5 h-5" />
								<span className="font-medium">Comment</span>
							</button>
							<button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
								<Share2 className="w-5 h-5" />
								<span className="font-medium">Share</span>
							</button>
						</div>
					</div>
				</div>

				{/* Related Articles Preview */}
				<div className="bg-white rounded-xl shadow-lg p-6">
					<h3 className="text-2xl font-bold text-gray-900 mb-6">
						Related Post
					</h3>
					<div className="grid md:grid-cols-2 gap-6">
						{[1, 2].map((item) => (
							<div
								key={item}
								className="group cursor-pointer">
								<div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 overflow-hidden">
									<div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 group-hover:scale-105 transition-transform duration-300" />
								</div>
								<h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
									Bài viết công nghệ thú vị khác {item}
								</h4>
								<p className="text-gray-600 text-sm mt-2">
									5 phút đọc • 1,234 lượt xem
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailBlog;
