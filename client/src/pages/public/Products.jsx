import { ChevronDown, Filter, Grid2x2, Grid3x3, Loader2 } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import getPaginationInfo from "../../utils/getPaginationInfo";

import { apiGetProducts } from "../../apis";
import {
	Breadcrumbs,
	FilterItem,
	Pagination,
	ProductCard,
} from "../../components";
import formatMoney from "../../utils/formatMoney";

const Products = () => {
	const dispatch = useDispatch();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(null);
	const [sortOption, setSortOption] = useState("newest");
	const [gridView, setGridView] = useState(4); // 3 or 4 columns
	const [showFilters, setShowFilters] = useState(false); // for mobile view
	const [colorsFilter, setColorsFilter] = useState([]);
	const [brandsFilter, setBrandsFilter] = useState([]);
	const [activeFilters, setActiveFilters] = useState({});
	const { category } = useParams();
	const [params] = useSearchParams();

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [totalProducts, setTotalProducts] = useState(0);
	const pageSize = import.meta.VITE_LIMIT_PRODUCTS || 12;

	useEffect(() => {
		const fetchProductsByCategory = async (queries) => {
			setLoading(true);
			try {
				const response = await apiGetProducts(queries);
				if (response.success) {
					setProducts(response.products);
					setTotalProducts(response.count);
					setCurrentPage(response.currentPage);
				}
			} catch (error) {
				console.error("Error fetching products:", error);
			}
			setLoading(false);
		};

		const queries = {};
		const filters = {};
		for (const [key, value] of params.entries()) {
			switch (key) {
				case "color":
					queries.color = value; // "green,blue,red"
					filters.color = value.split(",");
					break;
				case "price": {
					// Handle price range: "100-500" or "100-" or "-500"
					const [min, max] = value.split("-");
					if (min) queries.minPrice = parseInt(min);
					if (max) queries.maxPrice = parseInt(max);
					filters.price = { min: min || "", max: max || "" };
					break;
				}
				case "brands":
					queries.brands = value;
					filters.brands = value.split(",");
					break;
				case "sort":
					queries.sort = value;
					break;
				default:
					// Add other supported parameters
					if (["page", "limit", "fields"].includes(key)) {
						queries[key] = value;
					}
			}
		}
		setActiveFilters(filters);
		queries.category = category.charAt(0).toUpperCase() + category.slice(1);
		// queries.page = 1; // Đã set mặc định bên controller
		queries.limit = pageSize; // Set page size for pagination
		fetchProductsByCategory(queries);
	}, [dispatch, category, params, pageSize]);

	useEffect(() => {
		const fetchAllProducts = async () => {
			setLoading(true);
			try {
				const response = await apiGetProducts({ category });
				if (response.success) {
					const products = response.products;
					const colors = [...new Set(products.map((p) => p.color))];
					const brands = [...new Set(products.map((p) => p.brand))];
					setBrandsFilter(brands.map((b) => b.toLowerCase()));
					setColorsFilter(colors.map((c) => c.toLowerCase()));
				}
			} catch (error) {
				console.error("Error fetching products:", error);
			}
			setLoading(false);
		};
		fetchAllProducts();
	}, [category]);

	// Sort products
	const sortProducts = () => {
		let sortedProducts = [...products];

		switch (sortOption) {
			case "best-seller":
				sortedProducts.sort((a, b) => b.sold - a.sold);
				break;
			case "price-asc":
				sortedProducts.sort((a, b) => a.price - b.price);
				break;
			case "price-desc":
				sortedProducts.sort((a, b) => b.price - a.price);
				break;
			case "name-asc":
				sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "name-desc":
				sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
				break;
			default:
				// newest first (default)
				sortedProducts.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				);
		}
		return sortedProducts;
	};

	const getActiveFilterCount = () => {
		let count = 0;
		if (activeFilters.color?.length > 0) count++;
		if (activeFilters.price?.min || activeFilters.price?.max) count++;
		if (activeFilters.brands?.length > 0) count++;
		return count;
	};

	const activeFilterCount = getActiveFilterCount();

	// Toggle mobile filters
	const toggleFilters = () => {
		setShowFilters(!showFilters);
	};

	const { startItem, endItem } = getPaginationInfo(
		currentPage,
		pageSize,
		totalProducts
	);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header with category name and breadcrumbs */}
			<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					{category ? category.toUpperCase() : "All Products"}
				</h1>
				<nav className="mt-2">
					<Breadcrumbs
						title={
							category
								? category.charAt(0).toUpperCase() +
								  category.slice(1)
								: "All Products"
						}
						category={category ? category.toUpperCase() : ""}
					/>
				</nav>
			</div>

			{activeFilterCount > 0 && (
				<div className="bg-white rounded-lg shadow-sm p-4 mb-4">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium text-gray-700">
							Filters applied:
						</span>

						{/* Color filters */}
						{activeFilters.color?.map((color) => (
							<span
								key={color}
								className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								Color:{" "}
								{color.charAt(0).toUpperCase() + color.slice(1)}
							</span>
						))}
						{activeFilters.brands?.map((brand) => (
							<span
								key={brand}
								className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
								Brand:{" "}
								{brand.charAt(0).toUpperCase() + brand.slice(1)}
							</span>
						))}

						{/* Price filter */}
						{(activeFilters.price?.min ||
							activeFilters.price?.max) && (
							<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
								Price:{" "}
								{formatMoney(activeFilters.price.min) || "0"} -{" "}
								{activeFilters.price.max
									? `${formatMoney(activeFilters.price.max)}`
									: "Any"}
							</span>
						)}
					</div>
				</div>
			)}

			{/* Filters and sorting */}
			<div className="mb-8">
				{/* Mobile filter button */}
				<div className="block lg:hidden mb-4">
					<button
						onClick={toggleFilters}
						className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-150 cursor-pointer">
						<Filter size={16} />
						Filters
						<ChevronDown
							size={16}
							className={`transition-transform ${
								showFilters ? "rotate-180" : ""
							}`}
						/>
					</button>
				</div>

				{/* Filter and sort container */}
				<div
					className={`animate-fade-in ${
						showFilters ? "block" : "hidden"
					} lg:block bg-white rounded-lg shadow-sm p-4`}>
					<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
						{/* Filters */}
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-2 text-gray-700">
								<Filter size={18} />
								<span className="font-medium">Filter by:</span>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<FilterItem
									isOpen={isOpen}
									setIsOpen={setIsOpen}
									name="Price"
								/>
								<FilterItem
									isOpen={isOpen}
									setIsOpen={setIsOpen}
									colorsFilter={colorsFilter}
									name="Color"
								/>
								<FilterItem
									isOpen={isOpen}
									setIsOpen={setIsOpen}
									name="Brand"
									brandsFilter={brandsFilter}
								/>
							</div>
						</div>

						{/* Sort and View options */}
						<div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
							{/* Sort dropdown */}
							<div className="relative">
								<label
									htmlFor="sort"
									className="block text-sm font-medium text-gray-700 mb-1">
									Sort by:
								</label>
								<select
									id="sort"
									value={sortOption}
									onChange={(e) =>
										setSortOption(e.target.value)
									}
									className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
									<option value="newest">Newest</option>
									<option value="best-seller">
										Best Seller
									</option>
									<option value="price-asc">
										Price: Low to High
									</option>
									<option value="price-desc">
										Price: High to Low
									</option>
									<option value="name-asc">
										Name: A to Z
									</option>
									<option value="name-desc">
										Name: Z to A
									</option>
								</select>
							</div>

							{/* Grid view toggle */}
							<div className="flex items-end gap-2">
								<button
									onClick={() => setGridView(3)}
									className={`p-2 rounded-md transition-colors ${
										gridView === 3
											? "bg-indigo-100 text-indigo-600"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
									aria-label="3 column view">
									<Grid3x3 size={18} />
								</button>
								<button
									onClick={() => setGridView(4)}
									className={`p-2 rounded-md transition-colors ${
										gridView === 4
											? "bg-indigo-100 text-indigo-600"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
									aria-label="4 column view">
									<Grid2x2 size={18} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Products grid */}
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
				</div>
			) : (
				<>
					{products.length === 0 ? (
						<div className="text-center py-12 bg-white rounded-lg shadow-sm">
							<h3 className="text-lg font-medium text-gray-900">
								No products found
							</h3>
							<p className="mt-2 text-sm text-gray-500">
								Try changing your filters or check back later.
							</p>
						</div>
					) : (
						<div
							className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${
								gridView === 3 ? "3" : "2"
							} lg:grid-cols-${gridView} gap-6`}>
							{sortProducts().map((product) => (
								<div
									key={product._id}
									className="transition-all duration-300 hover:shadow-lg rounded-xl">
									<ProductCard
										data={product}
										normal
									/>
								</div>
							))}
						</div>
					)}
				</>
			)}

			{/* Products count and Pagination*/}
			<div className="flex justify-between items-center mt-6">
				<div>
					{!loading && products.length > 0 && (
						<div className="text-sm text-gray-500">
							Showing {products.length} product
							{products.length !== 1 ? "s" : ""}
						</div>
					)}
					<div>
						Show products {startItem} - {endItem} of {totalProducts}
					</div>
				</div>
				<Pagination
					currentPage={currentPage}
					totalCount={totalProducts}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					siblingCount={1}
				/>
			</div>
		</div>
	);
};

export default memo(Products);
