import React, { useState } from "react";
import {
	Clock,
	User,
	Eye,
	ArrowRight,
	Calendar,
	Tag,
	Search,
	Heart,
	ThumbsDown,
	Filter,
} from "lucide-react";

const Blogs = () => {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("newest");

	// Sample blog data based on your schema
	const blogPosts = [
		{
			_id: "1",
			title: "iPhone 15 Pro Max: Đánh giá chi tiết camera và hiệu năng mới nhất",
			description:
				"Khám phá những tính năng đột phá của iPhone 15 Pro Max với camera 48MP Pro, chip A17 Pro mạnh mẽ và thiết kế titan cao cấp. Đây có thể là chiếc smartphone hoàn hảo nhất mà Apple từng tạo ra.",
			category: "Smartphone",
			numberViews: 2847,
			likes: ["user1", "user2", "user3", "user4", "user5"],
			dislikes: ["user6"],
			image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop",
			author: "Minh Tuấn",
			createdAt: "2024-06-15T10:30:00Z",
			featured: true,
		},
		{
			_id: "2",
			title: "Top 10 Laptop Gaming 2024: Lựa chọn tốt nhất cho game thủ chuyên nghiệp",
			description:
				"Danh sách chi tiết những laptop gaming mạnh mẽ nhất năm 2024 với GPU RTX 4090, CPU Intel thế hệ 13 và màn hình 240Hz. Phân tích từng sản phẩm để bạn chọn được chiếc máy phù hợp nhất.",
			category: "Laptop",
			numberViews: 3924,
			likes: ["user1", "user3", "user7", "user8"],
			dislikes: [],
			image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=400&fit=crop",
			author: "Phương Anh",
			createdAt: "2024-06-12T14:20:00Z",
			featured: false,
		},
		{
			_id: "3",
			title: "Sony WH-1000XM5: Tai nghe chống ồn tốt nhất thế giới",
			description:
				"Trải nghiệm âm thanh Hi-Res đỉnh cao với công nghệ chống ồn thế hệ mới V1. Sony WH-1000XM5 không chỉ mang đến chất lượng âm thanh tuyệt vời mà còn có thiết kế sang trọng và pin 30 giờ.",
			category: "Audio",
			numberViews: 1687,
			likes: ["user2", "user4", "user9"],
			dislikes: ["user10"],
			image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=400&fit=crop",
			author: "Hoàng Nam",
			createdAt: "2024-06-10T09:15:00Z",
			featured: false,
		},
		{
			_id: "4",
			title: "MacBook Pro M3: Hiệu năng vượt trội cho content creator và developer",
			description:
				"Apple M3 chip với CPU 8-core và GPU 10-core mang đến hiệu năng xử lý video 4K, rendering 3D và lập trình nhanh chóng hơn bao giờ hết. Đây là công cụ hoàn hảo cho các nhà sáng tạo nội dung chuyên nghiệp.",
			category: "Laptop",
			numberViews: 2156,
			likes: ["user1", "user5", "user11", "user12", "user13"],
			dislikes: [],
			image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
			author: "Thu Hà",
			createdAt: "2024-06-08T11:45:00Z",
			featured: true,
		},
		{
			_id: "5",
			title: "Samsung Galaxy S24 Ultra: Camera zoom 100x và S Pen thế hệ mới",
			description:
				"Khám phá khả năng zoom xa đến 100x với AI Super Resolution và những tính năng độc đáo của S Pen trên Galaxy S24 Ultra. Màn hình Dynamic AMOLED 2X 6.8 inch với độ sáng 2600 nits đỉnh cao.",
			category: "Smartphone",
			numberViews: 1893,
			likes: ["user3", "user6", "user14"],
			dislikes: ["user15"],
			image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop",
			author: "Đức Minh",
			createdAt: "2024-06-05T16:30:00Z",
			featured: false,
		},
		{
			_id: "6",
			title: "Setup Gaming 2024: Từ chuột, bàn phím đến màn hình gaming 4K",
			description:
				"Hướng dẫn chi tiết cách setup bộ gaming hoàn hảo với chuột Logitech G Pro X, bàn phím cơ Cherry MX, và màn hình gaming 4K 144Hz. Tất cả những gì bạn cần để trở thành pro gamer.",
			category: "Gaming",
			numberViews: 1456,
			likes: ["user7", "user8", "user16"],
			dislikes: [],
			image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
			author: "Văn Hưng",
			createdAt: "2024-06-03T13:20:00Z",
			featured: false,
		},
	];

	const categories = [
		"all",
		"Smartphone",
		"Laptop",
		"Audio",
		"Gaming",
		"Phụ kiện",
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

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const formatViews = (views) => {
		if (views >= 1000) {
			return (views / 1000).toFixed(1) + "K";
		}
		return views.toString();
	};

	const BlogCard = ({ post, featured = false }) => (
		<article
			className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
				featured ? "lg:col-span-2" : ""
			}`}>
			{/* Image */}
			<div className="relative overflow-hidden">
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
							⭐ Nổi bật
						</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className={`p-6 ${featured ? "lg:p-8" : ""}`}>
				<h3
					className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${
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

				{/* Meta Info */}
				<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
					<div className="flex items-center space-x-4">
						<div className="flex items-center">
							<User className="w-4 h-4 mr-1" />
							<span>{post.author}</span>
						</div>
						<div className="flex items-center">
							<Calendar className="w-4 h-4 mr-1" />
							<span>{formatDate(post.createdAt)}</span>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-100">
					<div className="flex items-center space-x-4 text-sm text-gray-500">
						<div className="flex items-center">
							<Eye className="w-4 h-4 mr-1" />
							<span>
								{formatViews(post.numberViews)} lượt xem
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

					<button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-1 transition-transform duration-300">
						Đọc thêm
						<ArrowRight className="w-4 h-4 ml-1" />
					</button>
				</div>
			</div>
		</article>
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								TechBlog
							</span>
						</h1>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Cập nhật những tin tức mới nhất về công nghệ, đánh
							giá sản phẩm và xu hướng điện tử
						</p>
					</div>

					{/* Search and Filter */}
					<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
						{/* Search */}
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Tìm kiếm bài viết..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
									className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
									{categories.map((category) => (
										<option
											key={category}
											value={category}>
											{category === "all"
												? "Tất cả danh mục"
												: category}
										</option>
									))}
								</select>
							</div>

							{/* Sort Filter */}
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
								<option value="newest">Mới nhất</option>
								<option value="oldest">Cũ nhất</option>
								<option value="popular">Phổ biến nhất</option>
								<option value="liked">Được yêu thích</option>
							</select>
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
								Bài viết nổi bật
							</h2>
							<div className="ml-4 h-1 flex-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
							Tất cả bài viết
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
								Không tìm thấy bài viết
							</h3>
							<p className="text-gray-600">
								Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khác
							</p>
						</div>
					)}
				</div>

				{/* Load More Button */}
				{regularPosts.length > 0 && (
					<div className="text-center mt-12">
						<button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
							Xem thêm bài viết
							<ArrowRight className="w-5 h-5 ml-2" />
						</button>
					</div>
				)}
			</div>

			{/* Newsletter Subscription */}
			<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h3 className="text-3xl font-bold text-white mb-4">
						Đăng ký nhận tin tức mới nhất
					</h3>
					<p className="text-xl text-blue-100 mb-8">
						Cập nhật những xu hướng công nghệ và sản phẩm điện tử
						mới nhất qua email
					</p>
					<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
						<input
							type="email"
							placeholder="Nhập email của bạn"
							className="flex-1 px-6 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
						/>
						<button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
							Đăng ký
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Blogs;
