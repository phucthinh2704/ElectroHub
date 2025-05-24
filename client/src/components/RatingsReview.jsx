import React, { memo, useState } from "react";
import {
	Star,
	ThumbsUp,
	ThumbsDown,
	User,
	Calendar,
	Filter,
	ChevronDown,
	X,
	Camera,
} from "lucide-react";
import Swal from "sweetalert2";
import formatDate from "../utils/formatDate";

const RatingsReview = ({ product = {} }) => {
	const [sortBy, setSortBy] = useState("newest");
	const [filterRating, setFilterRating] = useState("all");
	const [showAllReviews, setShowAllReviews] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [selectedRating, setSelectedRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [reviewComment, setReviewComment] = useState("");
	// const [reviewerName, setReviewerName] = useState("");
	// const [reviewerPhone, setReviewerPhone] = useState("");

	const ratingLabels = {
		1: "Very Poor",
		2: "Poor",
		3: "Average",
		4: "Good",
		5: "Excellent",
	};

	// Mock review data - in real app, this would come from API
	// const mockReviews = [
	// 	{
	// 		id: 1,
	// 		userName: "Nguyễn Văn A",
	// 		rating: 5,
	// 		date: "2025-05-20",
	// 		comment:
	// 			"Sản phẩm rất tốt, chất lượng vượt mong đợi. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua lại!",
	// 		helpful: 12,
	// 		images: [
	// 			"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-tecno-camon-40-pro_2_.png",
	// 			"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-tecno-camon-40-pro_2_.png",
	// 		],
	// 		verified: true,
	// 	},
	// 	{
	// 		id: 2,
	// 		userName: "Trần Thị B",
	// 		rating: 4,
	// 		date: "2025-05-18",
	// 		comment:
	// 			"Sản phẩm đúng như mô tả, chỉ có điều màu sắc hơi khác một chút so với hình ảnh. Nhìn chung vẫn hài lòng.",
	// 		helpful: 8,
	// 		verified: true,
	// 	},
	// 	{
	// 		id: 3,
	// 		userName: "Lê Minh C",
	// 		rating: 5,
	// 		date: "2025-05-15",
	// 		comment:
	// 			"Tuyệt vời! Chất lượng premium, thiết kế đẹp mắt. Đã giới thiệu cho bạn bè và họ cũng rất thích.",
	// 		helpful: 15,
	// 		verified: true,
	// 	},
	// 	{
	// 		id: 4,
	// 		userName: "Phạm Thị D",
	// 		rating: 3,
	// 		date: "2025-05-12",
	// 		comment:
	// 			"Sản phẩm ổn nhưng không xuất sắc như kỳ vọng. Giá có hơi cao so với chất lượng thực tế.",
	// 		helpful: 3,
	// 		verified: false,
	// 	},
	// 	{
	// 		id: 5,
	// 		userName: "Hoàng Văn E",
	// 		rating: 5,
	// 		date: "2025-05-10",
	// 		comment:
	// 			"Mua lần thứ 2 rồi, vẫn rất hài lòng. Dịch vụ khách hàng tốt, hỗ trợ nhiệt tình.",
	// 		helpful: 6,
	// 		verified: true,
	// 	},
	// ];

	// Calculate rating statistics
	const totalReviews = product.ratingCount || 3;
	const averageRating = product.totalRatings || 11 / 3;

	// Rating distribution (mock data)
	const ratings = product.ratings;

	const ratingDistribution = {
		5: ratings?.reduce(
			(acc, rating) => acc + (rating.star == 5 ? 1 : 0),
			0
		), // Example counts
		4: ratings?.reduce(
			(acc, rating) => acc + (rating.star == 4 ? 1 : 0),
			0
		),
		3: ratings?.reduce(
			(acc, rating) => acc + (rating.star == 3 ? 1 : 0),
			0
		),
		2: ratings?.reduce(
			(acc, rating) => acc + (rating.star == 2 ? 1 : 0),
			0
		),
		1: ratings?.reduce(
			(acc, rating) => acc + (rating.star == 1 ? 1 : 0),
			0
		),
	};

	const renderStars = (rating, size = "w-4 h-4", interactive = false) => {
		return [...Array(5)].map((_, index) => (
			<Star
				key={index}
				className={`${size} cursor-pointer transition-colors ${
					index <
					(interactive ? hoverRating || selectedRating : rating)
						? "text-yellow-400 fill-current"
						: "text-gray-300"
				}`}
				onMouseEnter={
					interactive ? () => setHoverRating(index + 1) : undefined
				}
				onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
				onClick={
					interactive ? () => setSelectedRating(index + 1) : undefined
				}
			/>
		));
	};

	const handleSubmitReview = () => {
		if (!selectedRating || !reviewComment.trim()) {
			Swal.fire(
				"Warning",
				"Please select the star rating and leave your review.",
				"warning"
			);
			return;
		}

		// Handle review submission logic here
		console.log({
			rating: selectedRating,
			comment: reviewComment,
			// name: reviewerName,
			// phone: reviewerPhone,
		});
		Swal.fire({
			title: "Review Submitted",
			text: "Thank you for your feedback!",
			icon: "success",
		});

		// Reset form and close modal
		setSelectedRating(0);
		setReviewComment("");
		// setReviewerName("");
		// setReviewerPhone("");
		setShowModal(false);
	};

	// const filteredReviews = mockReviews.filter((review) => {
	// 	if (filterRating === "all") return true;
	// 	return review.rating === parseInt(filterRating);
	// });
	const filteredReviews =
		product.ratings?.filter((review) => {
			if (filterRating === "all") return true;
			return review.star === parseInt(filterRating);
		}) || [];

	const sortedReviews = [...filteredReviews].sort((a, b) => {
		if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
		if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
		if (sortBy === "highest") return b.rating - a.rating;
		if (sortBy === "lowest") return a.rating - b.rating;
		if (sortBy === "helpful") return b.helpful - a.helpful;
		return 0;
	});

	const displayedReviews = showAllReviews
		? sortedReviews
		: sortedReviews.slice(0, 3);

	return (
		<>
			<div className="bg-white rounded-xl shadow-lg p-6">
				{/* Header */}
				<div className="flex items-center mb-6">
					<Star className="h-6 w-6 text-yellow-400 mr-2" />
					<h2 className="text-2xl font-bold text-gray-900">
						Reviews
					</h2>
				</div>

				{/* Rating Summary */}
				<div className="grid md:grid-cols-3 gap-6 mb-8">
					{/* Overall Rating */}
					<div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
						<div className="text-4xl font-bold text-gray-900 mb-2">
							{parseFloat(averageRating).toFixed(1)}/5.0
						</div>
						<div className="flex justify-center mb-2">
							{renderStars(Math.round(averageRating), "w-5 h-5")}
						</div>
						<p className="text-gray-600">
							Based on {totalReviews} reviews
						</p>
					</div>

					{/* Rating Distribution */}
					<div className="md:col-span-2">
						<h3 className="font-semibold mb-4 text-gray-900">
							Review distribution
						</h3>
						{[5, 4, 3, 2, 1].map((star) => (
							<div
								key={star}
								className="flex items-center mb-2">
								<span className="text-sm text-gray-600 w-8 -mr-4">
									{star}
								</span>
								<Star className="w-4 h-4 text-yellow-400 fill-current mr-5" />
								<div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
									<div
										className="w-0 bg-main h-2 rounded-full transition-all duration-300"
										style={{
											width: `${
												(ratingDistribution[star] /
													totalReviews) *
												100
											}%`,
										}}></div>
								</div>
								<span className="text-sm text-gray-600 w-8">
									{ratingDistribution[star]}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Filter and Sort */}
				<div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
					<div className="flex items-center">
						<Filter className="w-4 h-4 mr-2 text-gray-600" />
						<select
							value={filterRating}
							onChange={(e) => setFilterRating(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="all">All reviews</option>
							<option value="5">5 stars</option>
							<option value="4">4 stars</option>
							<option value="3">3 stars</option>
							<option value="2">2 stars</option>
							<option value="1">1 stars</option>
						</select>
					</div>

					<div className="flex items-center">
						<span className="text-sm text-gray-600 mr-2">
							Sort:
						</span>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="newest">Latest</option>
							<option value="oldest">Oldest</option>
							<option value="highest">Highest score</option>
							<option value="lowest">Lowest score</option>
							<option value="helpful">Most useful</option>
						</select>
					</div>
				</div>

				{/* Reviews List */}
				<div className="space-y-6">
					{console.log(displayedReviews)}
					{displayedReviews.map((review) => (
						<div
							key={review._id}
							className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
							{/* Review Header */}
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-center">
									<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
										<User className="w-5 h-5" />
									</div>
									<div className="ml-3">
										<div className="flex items-center">
											<span className="font-medium text-gray-900">
												{review.postedBy}
											</span>

											<span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
												Verified
											</span>
										</div>
										<div className="flex items-center mt-1">
											<div className="flex mr-2">
												{renderStars(review.star)}
											</div>
											<div className="flex items-center text-sm text-gray-500">
												<Calendar className="w-3 h-3 mr-1" />
												{formatDate(review.date)}
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Review Content */}
							<p className="text-gray-700 mb-4 leading-relaxed">
								{review.comment}
							</p>

							{/* Review Images */}
							{review.images && (
								<div className="flex gap-2 mb-4">
									{review.images.map((image, index) => (
										<img
											key={index}
											src={image}
											alt={`Review image ${index + 1}`}
											className="w-16 h-16 object-cover rounded-lg border"
										/>
									))}
								</div>
							)}

							{/* Review Actions */}
							{/* <div className="flex items-center justify-between pt-4 border-t border-gray-100">
								<div className="flex items-center space-x-4">
									<button className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
										<ThumbsUp className="w-4 h-4 mr-1" />
										Hữu ích ({review.helpful})
									</button>
									<button className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
										<ThumbsDown className="w-4 h-4 mr-1" />
										Không hữu ích
									</button>
								</div>
								<button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
									Trả lời
								</button>
							</div> */}
						</div>
					))}
				</div>

				{/* Show More Button */}
				{sortedReviews.length > 3 && (
					<div className="text-center mt-6">
						<button
							onClick={() => setShowAllReviews(!showAllReviews)}
							className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
							{showAllReviews
								? "Thu gọn"
								: `Xem thêm ${
										sortedReviews.length - 3
								  } đánh giá`}
							<ChevronDown
								className={`w-4 h-4 ml-2 transition-transform ${
									showAllReviews ? "rotate-180" : ""
								}`}
							/>
						</button>
					</div>
				)}

				{/* Write Review Button */}
				<div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-center">
					<h3 className="text-lg font-semibold mb-2 text-gray-900">
						Share your experience
					</h3>
					<p className="text-gray-600 mb-4">
						Leave a review to help other customers
					</p>
					<button
						onClick={() => setShowModal(true)}
						className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
						Write a review
					</button>
				</div>
			</div>

			{showModal && (
				<div
					className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
					onClick={(e) => {
						// Close modal when clicking outside the content
						if (e.target === e.currentTarget) {
							setShowModal(false);
						}
					}}>
					<div className="bg-white rounded-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-6 border-b">
							<h2 className="text-xl font-semibold text-gray-900">
								Product Review
							</h2>
							<button
								onClick={() => setShowModal(false)}
								className="text-gray-400 hover:text-gray-600 cursor-pointer">
								<X className="w-6 h-6" />
							</button>
						</div>

						{/* Modal Content */}
						<div className="p-6">
							{/* Product Info */}
							<div className="text-center mb-6">
								<div className="w-3/10 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
									{/* <div className="w-16 h-12 bg-gray-800 rounded"></div>
									<div className="w-14 h-10 bg-blue-500 rounded ml-1"></div> */}
									<img
										src={product.thumb}
										alt={product.title}
										className="w-full h-full object-cover rounded-lg"
									/>
								</div>
								<h3 className="font-semibold text-gray-900 text-sm mb-2">
									{product.title}
								</h3>
							</div>

							{/* Star Rating */}
							<div className="text-center mb-6">
								<div className="flex justify-center items-center mb-2">
									{renderStars(
										selectedRating,
										"w-8 h-8",
										true
									)}
								</div>
								<p className="text-lg font-medium text-yellow-600">
									{selectedRating > 0
										? ratingLabels[selectedRating]
										: ""}
								</p>
							</div>

							{/* Comment */}
							<div className="mb-6">
								<textarea
									value={reviewComment}
									onChange={(e) =>
										setReviewComment(e.target.value)
									}
									placeholder="Please share more of your feelings..."
									className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Photo Upload */}
							<div className="mb-6">
								<div className="flex items-center text-blue-600 mb-2">
									<Camera className="w-4 h-4 mr-2" />
									<span className="text-sm">
										Upload photos (up to 3 images).
									</span>
								</div>
							</div>

							{/* Contact Info */}
							{/* <div className="grid grid-cols-2 gap-3 mb-4">
								<input
									type="text"
									placeholder="Họ tên (bắt buộc)"
									value={reviewerName}
									onChange={(e) =>
										setReviewerName(e.target.value)
									}
									className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<input
									type="text"
									placeholder="Số điện thoại (bắt buộc)"
									value={reviewerPhone}
									onChange={(e) =>
										setReviewerPhone(e.target.value)
									}
									className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div> */}

							{/* Submit Button */}
							<button
								onClick={handleSubmitReview}
								className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors cursor-pointer">
								Submit Review
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(RatingsReview);
