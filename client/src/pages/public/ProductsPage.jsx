import { Filter, Grid, List, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { apiGetProducts } from "../../apis";
import {
	Breadcrumbs,
	Pagination,
	ProductCard,
	ProductListItem,
} from "../../components";
import { priceRanges } from "../../utils/constants";
import getPaginationInfo from "../../utils/getPaginationInfo";

const ProductsPage = () => {
	const categories = [
		"All",
		"Smartphone",
		"Laptop",
		"Headphones",
		"Speaker",
		"Tablet",
		"Smartwatch",
	];
	const brands = [
		"All",
		"APPLE",
		"SAMSUNG",
		"SONY",
		"DELL",
		"JBL",
		"XIAOMI",
		"HUAWEI",
	];
	const [products, setProducts] = useState([]);

	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedBrand, setSelectedBrand] = useState("All");
	const [searchTerm, setSearchTerm] = useState("");
	const priceRangesWithAll = [
		{ label: "All", min: 0, max: Infinity },
		...priceRanges,
	];
	const [selectedPriceRange, setSelectedPriceRange] = useState(
		priceRangesWithAll[0]
	);
	const [sortBy, setSortBy] = useState("newest");
	const [viewMode, setViewMode] = useState("grid");
	const [showFilters, setShowFilters] = useState(false);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = import.meta.VITE_LIMIT_PRODUCTS || 12;

	useEffect(() => {
		const fetchAllProducts = async () => {
			try {
				const response = await apiGetProducts();
				if (response.success) {
					setProducts(response.products);
				}
			} catch (error) {
				console.log("Error fetching products:", error);
			}
		};
		fetchAllProducts();
	}, []);

	const filteredProducts = useMemo(() => {
		let filtered = products.filter((product) => {
			const matchesSearch =
				product.title
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				product.brand
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				product.color
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				product.variants.some((variant) =>
					variant.color
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
				) ||
				product.category
					.toLowerCase()
					.includes(searchTerm.toLowerCase());

			const matchesCategory =
				selectedCategory === "All" ||
				product.category === selectedCategory;
			const matchesBrand =
				selectedBrand === "All" || product.brand === selectedBrand;
			const matchesPrice =
				product.price >= selectedPriceRange.min &&
				product.price <= selectedPriceRange.max;

			return (
				matchesSearch && matchesCategory && matchesBrand && matchesPrice
			);
		});

		// Sort products
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "price-low":
					return a.price - b.price;
				case "price-high":
					return b.price - a.price;
				case "rating":
					return b.totalRatings - a.totalRatings;
				case "sold":
					return b.sold - a.sold;
				case "newest":
					return new Date(b.createdAt) - new Date(a.createdAt);
				default:
					return a.title.localeCompare(b.title);
			}
		});

		return filtered;
	}, [
		products,
		searchTerm,
		selectedCategory,
		selectedBrand,
		selectedPriceRange,
		sortBy,
	]);
	const indexOfLastProduct = currentPage * pageSize;
	const indexOfFirstProduct = indexOfLastProduct - pageSize;
	const currentProducts = filteredProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	);

	const { startItem, endItem } = getPaginationInfo(
		currentPage,
		pageSize,
		filteredProducts.length
	);

	return (
		<div className="min-h-screen bg-white max-w-7xl mx-auto">
			{/* Header */}
			<div className="flex items-end justify-between rounded-lg shadow-sm p-4 mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800 uppercase">
						All Products
					</h1>
					<nav className="mt-2">
						<Breadcrumbs
							title={"All Products"}
							category={""}
						/>
					</nav>
				</div>
				{/* Search Bar */}
				<div className="relative md:w-1/2 lg:w-1/3 w-full">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={20}
					/>
					<input
						type="text"
						placeholder="Search products..."
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="max-w-7xl mx-auto">
				<div className="flex gap-6 items-start">
					{/* Filters Sidebar */}
					<div
						className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${
							showFilters ? "block" : "hidden"
						} lg:block lg:w-72 flex-shrink-0 h-fit sticky top-6`}>
						<div className="flex items-center gap-2 mb-6">
							<Filter
								className="text-blue-600"
								size={20}
							/>
							<h3 className="font-bold text-gray-800 text-lg">
								Filters
							</h3>
						</div>

						{/* Category Filter */}
						<div className="mb-8">
							<h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
								Category
							</h4>
							<div className="relative">
								<select
									className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer appearance-none"
									value={selectedCategory}
									onChange={(e) =>
										setSelectedCategory(e.target.value)
									}>
									{categories.map((category) => (
										<option
											key={category}
											value={category}
											className="py-2">
											{category}
										</option>
									))}
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
									<svg
										className="w-4 h-4 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"></path>
									</svg>
								</div>
							</div>
						</div>

						{/* Brand Filter */}
						<div className="mb-8">
							<h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
								Brand
							</h4>
							<div className="relative">
								<select
									className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer appearance-none"
									value={selectedBrand}
									onChange={(e) =>
										setSelectedBrand(e.target.value)
									}>
									{brands.map((brand) => (
										<option
											key={brand}
											value={brand}
											className="py-2">
											{brand}
										</option>
									))}
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
									<svg
										className="w-4 h-4 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"></path>
									</svg>
								</div>
							</div>
						</div>

						{/* Price Range Filter */}
						<div className="mb-6">
							<h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
								Price Range
							</h4>
							<div className="relative">
								<select
									className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer appearance-none"
									value={selectedPriceRange.label}
									onChange={(e) =>
										setSelectedPriceRange(
											priceRangesWithAll.find(
												(range) =>
													range.label ===
													e.target.value
											)
										)
									}>
									{priceRangesWithAll.map((range) => (
										<option
											key={range.label}
											value={range.label}
											className="py-2">
											{range.label}
										</option>
									))}
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
									<svg
										className="w-4 h-4 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"></path>
									</svg>
								</div>
							</div>
						</div>

						{/* Clear Filters Button */}
						<button
							onClick={() => {
								setSelectedCategory("All");
								setSelectedBrand("All");
								setSelectedPriceRange(priceRangesWithAll[0]);
								setSearchTerm("");
							}}
							className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border border-gray-300 hover:border-gray-400 cursor-pointer">
							Clear All Filters
						</button>
					</div>

					{/* Main Content */}
					<div className="flex-1">
						{/* Toolbar */}
						<div className="bg-white rounded-lg shadow-md p-4 mb-6">
							<div className="flex items-center justify-between flex-wrap gap-4">
								<div className="flex items-center gap-4">
									<button
										className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded"
										onClick={() =>
											setShowFilters(!showFilters)
										}>
										<Filter size={16} />
										Filters
									</button>

									<span className="text-gray-700 font-semibold">
										{filteredProducts.length} products found
									</span>
								</div>

								<div className="flex items-center gap-4">
									<select
										className="p-2 border border-gray-300 rounded"
										value={sortBy}
										onChange={(e) =>
											setSortBy(e.target.value)
										}>
										<option value="name">
											Sort by Name
										</option>
										<option value="price-low">
											Price: Low to High
										</option>
										<option value="price-high">
											Price: High to Low
										</option>
										<option value="rating">
											Highest Rated
										</option>
										<option value="sold">
											Best Selling
										</option>
										<option value="newest">Newest</option>
									</select>

									<div className="flex border border-gray-300 rounded">
										<button
											className={`p-2 ${
												viewMode === "grid"
													? "bg-blue-600 text-white"
													: "bg-white text-gray-600"
											}`}
											onClick={() => setViewMode("grid")}>
											<Grid size={16} />
										</button>
										<button
											className={`p-2 ${
												viewMode === "list"
													? "bg-blue-600 text-white"
													: "bg-white text-gray-600"
											}`}
											onClick={() => setViewMode("list")}>
											<List size={16} />
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Products Grid/List */}
						{filteredProducts.length === 0 ? (
							<div className="bg-white rounded-lg shadow-md p-8 text-center">
								<p className="text-gray-500">
									No products found matching your criteria.
								</p>
							</div>
						) : (
							<div
								className={
									viewMode === "grid"
										? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
										: "space-y-4"
								}>
								{currentProducts.map((product) =>
									viewMode === "grid" ? (
										<ProductCard
											key={product._id}
											data={product}
										/>
									) : (
										<ProductListItem
											key={product._id}
											product={product}
										/>
									)
								)}
							</div>
						)}
					</div>
				</div>
				<div className="flex items-center justify-between px-10 py-5 bg-slate-100 max-w-[76%] mt-3 mb-6 ml-auto rounded-lg">
					<div>
						{products.length > 0 && (
							<div className="text-sm text-gray-500">
								Showing {filteredProducts.length} product
								{filteredProducts.length !== 1 ? "s" : ""}
							</div>
						)}
						<div className="text-sm text-slate-600">
							Show products {startItem} - {endItem} of{" "}
							{filteredProducts.length}
						</div>
					</div>
					<Pagination
						totalCount={filteredProducts.length}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						pageSize={pageSize}
						siblingCount={1}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductsPage;
