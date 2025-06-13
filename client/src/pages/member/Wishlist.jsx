import { Filter, Grid, Heart, List, Search } from "lucide-react";
import React, { useState } from "react";
import { CartHeader, WishlistItem } from "../../components";

const Wishlist = () => {
	const [viewMode, setViewMode] = useState("grid");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("newest");
	const [wishlistItems, setWishlistItems] = useState([
		{
			id: 1,
			name: "Wireless Bluetooth Headphones",
			price: 199.99,
			originalPrice: 249.99,
			image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
			category: "Electronics",
			rating: 4.5,
			inStock: true,
			dateAdded: "2024-01-15",
		},
		{
			id: 2,
			name: "Minimalist Watch",
			price: 129.99,
			originalPrice: 159.99,
			image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
			category: "Accessories",
			rating: 4.8,
			inStock: true,
			dateAdded: "2024-01-12",
		},
		{
			id: 3,
			name: "Premium Coffee Maker",
			price: 299.99,
			originalPrice: 349.99,
			image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
			category: "Home & Kitchen",
			rating: 4.3,
			inStock: false,
			dateAdded: "2024-01-10",
		},
		{
			id: 4,
			name: "Ergonomic Office Chair",
			price: 449.99,
			originalPrice: 549.99,
			image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
			category: "Furniture",
			rating: 4.6,
			inStock: true,
			dateAdded: "2024-01-08",
		},
		{
			id: 5,
			name: "Fitness Tracker",
			price: 89.99,
			originalPrice: 119.99,
			image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop",
			category: "Electronics",
			rating: 4.2,
			inStock: true,
			dateAdded: "2024-01-05",
		},
		{
			id: 6,
			name: "Designer Sunglasses",
			price: 179.99,
			originalPrice: 220.0,
			image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
			category: "Accessories",
			rating: 4.7,
			inStock: true,
			dateAdded: "2024-01-03",
		},
	]);

	const removeFromWishlist = (id) => {
		setWishlistItems((items) => items.filter((item) => item.id !== id));
	};

	const filteredItems = wishlistItems.filter((item) =>
		item.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedItems = [...filteredItems].sort((a, b) => {
		switch (sortBy) {
			case "price-low":
				return a.price - b.price;
			case "price-high":
				return b.price - a.price;
			case "name":
				return a.name.localeCompare(b.name);
			case "rating":
				return b.rating - a.rating;
			default:
				return new Date(b.dateAdded) - new Date(a.dateAdded);
		}
	});

	return (
		<div className="min-h-screen p-4 bg-white shadow-lg text-slate-900">
			{/* Header */}
			<CartHeader
				icon={<Heart className="w-6 h-6 text-white" />}
				title={"My Wishlist"}
			/>

			{/* Controls */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
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
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
								onChange={(e) => setSortBy(e.target.value)}
								className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
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

						{/* View Mode */}
						<div className="flex bg-gray-100 rounded-xl p-1">
							<button
								onClick={() => setViewMode("grid")}
								className={`p-2 rounded-lg transition-all ${
									viewMode === "grid"
										? "bg-white shadow-sm text-blue-600"
										: "text-gray-500"
								}`}>
								<Grid size={20} />
							</button>
							<button
								onClick={() => setViewMode("list")}
								className={`p-2 rounded-lg transition-all ${
									viewMode === "list"
										? "bg-white shadow-sm text-blue-600"
										: "text-gray-500"
								}`}>
								<List size={20} />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Wishlist Items */}
			{sortedItems.length > 0 ? (
				<div
					className={`grid gap-6 ${
						viewMode === "grid"
							? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
							: "grid-cols-1"
					}`}>
					{sortedItems.map((item) => (
						<WishlistItem
							key={item.id}
							item={item}
							viewMode={viewMode}
							removeFromWishlist={removeFromWishlist}
						/>
					))}
				</div>
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
