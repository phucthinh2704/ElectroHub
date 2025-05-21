import { ChevronDown, Filter, Grid2x2, Grid3x3, Loader2 } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { apiGetProducts } from "../../apis";
import { Breadcrumbs, FilterItem, ProductCard } from "../../components";

const Products = () => {
	const dispatch = useDispatch();
	const { category } = useParams();
	const [params] = useSearchParams();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(null);
	const [sortOption, setSortOption] = useState("newest");
	const [gridView, setGridView] = useState(4); // 3 or 4 columns
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		const fetchProductsByCategory = async (queries) => {
			setLoading(true);
			try {
				const response = await apiGetProducts(queries);
				if (response.success) {
					setProducts(response.products);
				}
			} catch (error) {
				console.error("Error fetching products:", error);
			}
			setLoading(false);
		};
		const param = [];
		for (const [key, value] of params.entries()) {
			param.push({ key, value });
		}

		const queries = {};
		param.forEach((item) => {
			if (item.key === "color") {
				queries[item.key] = item.value;
			}
		});
		console.log(queries);
		queries.category = category.charAt(0).toUpperCase() + category.slice(1);
		// queries.title = "htc";
		// queries.sort = "price";
		// queries.page = 1;
		// queries.limit = 20;
		// queries.fields = "title,price,images,slug";
		fetchProductsByCategory(queries);
	}, [dispatch, category, params]);

	// Sort products
	const sortProducts = () => {
		let sortedProducts = [...products];

		switch (sortOption) {
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

	// Toggle mobile filters
	const toggleFilters = () => {
		setShowFilters(!showFilters);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header with category name and breadcrumbs */}
			<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					{category
						? category.charAt(0).toUpperCase() + category.slice(1)
						: "All Products"}
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
					className={`${
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
									type="text"
								/>
								<FilterItem
									isOpen={isOpen}
									setIsOpen={setIsOpen}
									name="Color"
								/>
								<FilterItem
									isOpen={isOpen}
									setIsOpen={setIsOpen}
									name="Size"
								/>
								<FilterItem
									isOpen={isOpen}
									setIsOpen={setIsOpen}
									name="Brand"
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
									className="transition-all duration-300 hover:shadow-md rounded-lg">
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

			{/* Products count */}
			{!loading && products.length > 0 && (
				<div className="mt-6 text-sm text-gray-500">
					Showing {products.length} product
					{products.length !== 1 ? "s" : ""}
				</div>
			)}
		</div>
	);
};

export default memo(Products);
