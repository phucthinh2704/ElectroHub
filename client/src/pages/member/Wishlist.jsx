import { Filter, Heart, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CartHeader, Pagination, WishlistItem } from "../../components";
import getPaginationInfo from "../../utils/getPaginationInfo";

const Wishlist = () => {
	const { current } = useSelector((state) => state.user);
	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("newest");
	const [wishlistItems, setWishlistItems] = useState(current?.wishlist || []);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [wishlistItemPerPage] = useState(4); // Number of orders per page

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const page = params.get("page") || 1;
		setCurrentPage(Number(page));
	}, []);

	const removeFromWishlist = (id) => {
		setWishlistItems((items) => items.filter((item) => item._id !== id));
	};

	const handleSearchTerm = (e) => {
		setSearchTerm(e.target.value);
		const params = new URLSearchParams(window.location.search);
		params.set("page", 1);
		setCurrentPage(1);
		navigate({
			pathname: window.location.pathname,
			search: params.toString(),
		});
	};
	const handleSortBy = (e) => {
		setSortBy(e.target.value);
		const params = new URLSearchParams(window.location.search);
		params.set("page", 1);
		setCurrentPage(1);
		navigate({
			pathname: window.location.pathname,
			search: params.toString(),
		});
	};

	const filteredItems = wishlistItems.filter((item) =>
		item.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedItems = [...filteredItems].sort((a, b) => {
		switch (sortBy) {
			case "price-low":
				return a.price - b.price;
			case "price-high":
				return b.price - a.price;
			case "name":
				return a.title.localeCompare(b.title);
			case "rating":
				return b.totalRatings - a.totalRatings;
			default:
				return new Date(b.createdAt) - new Date(a.createdAt);
		}
	});

	const indexOfWishlistItem = currentPage * wishlistItemPerPage;
	const indexOfFirstWishlistItem = indexOfWishlistItem - wishlistItemPerPage;
	const currentWishlistItem = sortedItems.slice(
		indexOfFirstWishlistItem,
		indexOfWishlistItem
	);

	const { startItem, endItem } = getPaginationInfo(
		currentPage,
		wishlistItemPerPage,
		wishlistItems.length
	);

	return (
		<div className="min-h-screen p-4 bg-white shadow-lg text-slate-900">
			{/* Header */}
			<CartHeader
				icon={<Heart className="w-6 h-6 text-white" />}
				title={"My Wishlist"}
			/>

			{/* Controls */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
				<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
					{/* Search */}
					<div className="relative flex-1 max-w-md">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							size={20}
						/>
						<input
							type="text"
							placeholder="Search wishlist items..."
							value={searchTerm}
							onChange={(e) => handleSearchTerm(e)}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
						/>
					</div>

					<div className="flex items-center gap-4">
						{/* Sort */}
						<div className="flex items-center gap-2">
							<Filter
								size={20}
								className="text-gray-400"
							/>
							<select
								value={sortBy}
								onChange={(e) => handleSortBy(e)}
								className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
								<option value="newest">Newest First</option>
								<option value="price-low">
									Price: Low to High
								</option>
								<option value="price-high">
									Price: High to Low
								</option>
								<option value="name">Name A-Z</option>
								<option value="rating">Highest Rated</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Wishlist Items */}
			{sortedItems.length > 0 ? (
				<>
					<div
						className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
						{currentWishlistItem.map((item) => (
							<Link
								to={`/products/${item.category.toLowerCase()}/${
									item._id
								}/${item.slug}`}
								className="group"
								key={item._id}>
								<WishlistItem
									item={item}
									removeFromWishlist={removeFromWishlist}
									currentWishlistItem={currentWishlistItem}
									currentPage={currentPage}
									setCurrentPage={setCurrentPage}
								/>
							</Link>
						))}
					</div>
					<div className="flex items-center justify-between px-10 py-5 bg-slate-100 rounded-lg mt-3">
						<div>
							{wishlistItems.length > 0 && (
								<div className="text-sm text-gray-500">
									Showing {filteredItems.length} product
									{filteredItems.length !== 1 ? "s" : ""}
								</div>
							)}
							<div className="text-sm text-slate-600">
								Show products {startItem} - {endItem} of{" "}
								{filteredItems.length}
							</div>
						</div>
						<Pagination
							currentPage={currentPage}
							totalCount={filteredItems.length}
							onPageChange={setCurrentPage}
							pageSize={wishlistItemPerPage}
							siblingCount={1}
						/>
					</div>
				</>
			) : (
				<div className="text-center py-16">
					<div className="mb-4">
						<Heart
							size={64}
							className="text-gray-300 mx-auto"
						/>
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						{searchTerm
							? "No items found"
							: "Your wishlist is empty"}
					</h3>
					<p className="text-gray-600 mb-6">
						{searchTerm
							? `No items match your search "${searchTerm}"`
							: "Start adding items to your wishlist to see them here"}
					</p>
					{searchTerm && (
						<button
							onClick={() => setSearchTerm("")}
							className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
							Clear Search
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default Wishlist;
