import {
	AlertTriangle,
	CheckCircle,
	Edit3,
	Eye,
	Package,
	Plus,
	Search,
	ShoppingCart,
	Star,
	Trash2,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiDeleteProduct, apiGetProducts } from "../../apis/product";
import Pagination from "../../components/public/pagination/Pagination";
import formatMoney from "../../utils/formatMoney";
import path from "../../utils/path";
import { EditProductForm } from "../../components";

const ManageProducts = () => {
	const [products, setProducts] = useState([]);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState("all");
	const [filterBrand, setFilterBrand] = useState("all");
	const [filterStock, setFilterStock] = useState("all");
	const [sortOption, setSortOption] = useState("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const [showEditForm, setShowEditForm] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState(null);
	const [brands, setBrands] = useState([]);
	const [productsPerPage] = useState(5);

	const navigate = useNavigate();

	const fetchProducts = async () => {
		try {
			const response = await apiGetProducts();
			if (response.success) setProducts(response.products);
		} catch (e) {
			console.log("Error fetching products:", e.message || e);
		}
	};
	useEffect(() => {
		fetchProducts();

		const params = new URLSearchParams(window.location.search);
		const page = params.get("page") || 1;
		setCurrentPage(Number(page));
	}, []);

	useEffect(() => {
		// Get unique brands based on current products
		const uniqueBrands = [...new Set(products.map((p) => p.brand))];
		setBrands(uniqueBrands);
	}, [products]);

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
			case "stock-asc":
				sortedProducts.sort((a, b) => a.stock - b.stock);
				break;
			case "stock-desc":
				sortedProducts.sort((a, b) => b.stock - a.stock);
				break;
			case "rating-asc":
				sortedProducts.sort((a, b) => a.totalRatings - b.totalRatings);
				break;
			case "rating-desc":
				sortedProducts.sort((a, b) => b.totalRatings - a.totalRatings);
				break;
			default:
				// newest first (default)
				sortedProducts.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				);
		}
		return sortedProducts;
	};

	// Filter products based on search and filters
	const filteredProducts = sortProducts().filter((product) => {
		const matchesSearch =
			product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.category.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory =
			filterCategory === "all" || product.category === filterCategory;
		const matchesBrand =
			filterBrand === "all" || product.brand === filterBrand;

		const matchesStock =
			filterStock === "all" ||
			(filterStock === "in-stock" && product.stock > 0) ||
			(filterStock === "out-of-stock" && product.stock === 0) ||
			(filterStock === "low-stock" &&
				product.stock > 0 &&
				product.stock < 10);

		return matchesSearch && matchesCategory && matchesBrand && matchesStock;
	});

	const handleFilterChange = (field, value) => {
		switch (field) {
			case "search":
				setSearchTerm(value);
				break;
			case "category":
				setFilterCategory(value);
				break;
			case "brand":
				setFilterBrand(value);
				break;
			case "stock":
				setFilterStock(value);
				break;
		}
		const params = new URLSearchParams(window.location.search);
		params.set("page", 1);
		setCurrentPage(1);
		navigate({
			pathname: window.location.pathname,
			search: params.toString(),
		});
	};

	// Pagination
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = filteredProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	);

	const handleEdit = (productId) => {
		setSelectedProductId(productId);
		setShowEditForm(true);
	};

	const handleDelete = (productId) => {
		Swal.fire({
			title: "Are you sure delete this product?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await apiDeleteProduct(productId);
					if (response.success) {
						setProducts(
							products.filter(
								(product) => product._id !== productId
							)
						);
						if (currentProducts.length === 1 && currentPage > 1) {
							setCurrentPage(currentPage - 1);
							navigate({
								pathname: window.location.pathname,
								search: `?page=${currentPage - 1}`,
							});
						}
						toast.success("Product deleted successfully");
					} else {
						toast.error(
							response.message || "Failed to delete product"
						);
					}
				} catch (e) {
					console.error("Error deleting product:", e.message || e);
					toast.error("Failed to delete product");
				}
			}
		});
	};

	const handleView = (productId) => {
		const product = products.find((p) => p._id === productId);
		navigate(
			`/products/${product.category.toLowerCase()}/${product._id}/${
				product.slug
			}`
		);
	};

	const getStockBadgeColor = (stock) => {
		if (stock === 0) return "bg-red-100 text-red-800 border-red-200";
		if (stock < 10)
			return "bg-orange-100 text-orange-800 border-orange-200";
		return "bg-green-100 text-green-800 border-green-200";
	};

	const getStockStatus = (stock) => {
		if (stock === 0) return "Out of Stock";
		if (stock < 10) return "Low Stock";
		return "In Stock";
	};

	const getCategoryBadgeColor = (category) => {
		switch (category.toLowerCase()) {
			case "smartphone":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "camera":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "accessories":
				return "bg-amber-100 text-amber-800 border-amber-200";
			case "laptop":
				return "bg-red-100 text-red-800 border-red-200";
			case "tablet":
				return "bg-green-100 text-green-800 border-green-200";
			case "speaker":
				return "bg-cyan-100 text-cyan-800 border-cyan-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getPaginationInfo = (currentPage, pageSize, totalProducts) => {
		const startItem = (currentPage - 1) * pageSize + 1;
		const endItem = Math.min(currentPage * pageSize, totalProducts);
		return { startItem, endItem };
	};

	const { startItem, endItem } = getPaginationInfo(
		currentPage,
		productsPerPage,
		filteredProducts.length
	);

	// Get unique categories and brands for filters
	const categories = [...new Set(products.map((p) => p.category))];

	return (
		<div className="p-4 bg-slate-100 min-h-screen">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold text-slate-800 mb-2 uppercase">
							Manage Products
						</h1>
						<p className="text-slate-600">
							Manage and monitor all products in your inventory
						</p>
					</div>
					<Link to={`/${path.ADMIN}/${path.CREATE_PRODUCT}`}>
						<button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer">
							<Plus />
							Add New Product
						</button>
					</Link>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Total Products
								</p>
								<p className="text-2xl font-bold text-slate-800">
									{products.length}
								</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<Package className="w-6 h-6 text-blue-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									In Stock
								</p>
								<p className="text-2xl font-bold text-green-600">
									{products.filter((p) => p.stock > 0).length}
								</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
								<CheckCircle className="w-6 h-6 text-green-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Out of Stock
								</p>
								<p className="text-2xl font-bold text-red-600">
									{
										products.filter((p) => p.stock === 0)
											.length
									}
								</p>
							</div>
							<div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
								<AlertTriangle className="w-6 h-6 text-red-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-600 text-sm font-medium">
									Total Sold
								</p>
								<p className="text-2xl font-bold text-purple-600">
									{products.reduce(
										(total, p) => total + p.sold,
										0
									)}
								</p>
							</div>
							<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
								<ShoppingCart className="w-6 h-6 text-purple-600" />
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 text-black">
					<div className="flex flex-col md:flex-row gap-3">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
									<Search />
								</div>
								<input
									type="text"
									placeholder="Search products by name, brand or category..."
									value={searchTerm}
									onChange={(e) =>
										handleFilterChange(
											"search",
											e.target.value
										)
									}
									className="w-full pl-10 pr-4 py-3 outline-none border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								/>
							</div>
						</div>

						{/* SORT */}
						<select
							onChange={(e) => {
								setSortOption(e.target.value);
								const params = new URLSearchParams(
									window.location.search
								);
								params.set("page", 1);
								setCurrentPage(1);
								navigate({
									pathname: window.location.pathname,
									search: params.toString(),
								});
							}}
							className="p-2 border border-slate-300 rounded-xl hover:shadow-lg focus:outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white uppercase">
							<option value="newest">Newest</option>
							<option value="best-seller">Best Seller</option>
							<option value="price-asc">
								Price: Low to High
							</option>
							<option value="price-desc">
								Price: High to Low
							</option>
							<option value="stock-asc">
								Stock: Low to High
							</option>
							<option value="stock-desc">
								Stock: High to Low
							</option>
							<option value="rating-asc">
								Rating: Low to High
							</option>
							<option value="rating-desc">
								Rating: High to Low
							</option>
						</select>
						{/* Category Filter */}
						<select
							value={filterCategory}
							onChange={(e) => {
								const newCategory = e.target.value;
								handleFilterChange("category", newCategory);

								const filterBrands =
									newCategory !== "all"
										? [
												...new Set(
													products
														.filter(
															(p) =>
																p.category ===
																newCategory
														)
														.map((p) => p.brand)
												),
										  ]
										: [
												...new Set(
													products.map((p) => p.brand)
												),
										  ];
								setBrands(filterBrands);
								// Reset brand filter when category changes
								setFilterBrand("all");
							}}
							className="p-3 border border-slate-300 rounded-xl hover:shadow-lg focus:outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white uppercase">
							<option value="all">All Categories</option>
							{categories.map((category) => (
								<option
									key={category}
									value={category}>
									{category}
								</option>
							))}
						</select>

						{/* Brand Filter */}
						<select
							value={filterBrand}
							onChange={(e) =>
								handleFilterChange("brand", e.target.value)
							}
							className="p-3 border border-slate-300 rounded-xl hover:shadow-lg focus:outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white uppercase">
							<option value="all">All Brands</option>
							{brands.map((brand) => (
								<option
									key={brand}
									value={brand}>
									{brand}
								</option>
							))}
						</select>

						{/* Stock Filter */}
						<select
							value={filterStock}
							onChange={(e) =>
								handleFilterChange("stock", e.target.value)
							}
							className="p-3 border border-slate-300 rounded-xl focus:ring-2 hover:shadow-lg focus:outline-none cursor-pointer focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white uppercase">
							<option value="all">All Stock Status</option>
							<option value="in-stock">In Stock</option>
							<option value="low-stock">Low Stock</option>
							<option value="out-of-stock">Out of Stock</option>
						</select>
					</div>
				</div>
			</div>

			{/* Products Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-slate-50 border-b border-slate-200">
							<tr className="text-center">
								<th className="p-4 font-semibold text-slate-700">
									#
								</th>
								<th className="p-4 font-semibold text-slate-700">
									Product
								</th>
								<th className="p-4 font-semibold text-slate-700">
									Category
								</th>
								<th className="p-4 px-12 font-semibold text-slate-700">
									Price
								</th>
								<th className="p-4 font-semibold text-slate-700">
									Variants
								</th>
								<th className="p-4 font-semibold text-slate-700">
									Stock
								</th>
								<th className="p-4 font-semibold text-slate-700">
									Sold
								</th>
								<th className="p-4 font-semibold text-slate-700">
									Rating
								</th>
								<th className="p-4 font-semibold text-slate-700">
									Created
								</th>
								<th className="p-4 font-semibold text-slate-700">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{currentProducts.map((product, index) => (
								<tr
									key={product._id}
									className="text-center hover:bg-slate-50 transition-colors duration-150">
									<td className="p-4 text-slate-600 font-semibold">
										{indexOfFirstProduct + index + 1}
									</td>

									{/* Product Info */}
									<td className="text-left max-w-xs">
										<div className="flex items-center gap-2">
											<div className="h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-400">
												<img
													src={product.thumb}
													alt={product.title}
													className="w-full h-full object-cover"
													onError={(e) => {
														e.target.src =
															"https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=No+Image";
													}}
												/>
											</div>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-slate-800 truncate">
													{product.title}
												</p>
												<p className="text-sm text-slate-500">
													{product.brand}
												</p>
											</div>
										</div>
									</td>

									{/* Category */}
									<td className="py-4 px-4">
										<span
											className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeColor(
												product.category
											)}`}>
											{product.category}
										</span>
									</td>

									{/* Price */}
									<td className="py-4 px-4">
										<div className="text-center">
											<p className="font-semibold text-slate-800">
												{formatMoney(product.price)} đ
											</p>
											{product.discount > 0 && (
												<p className="text-xs text-slate-500 line-through">
													{formatMoney(
														product.originalPrice
													)}{" "}
													đ
												</p>
											)}
										</div>
									</td>

									{/* Variants */}
									<td className="py-4 px-4">
										<span
											className={`inline-flex text-slate-800 items-center font-semibold`}>
											{product.variants.length}
										</span>
									</td>
									
									{/* Stock */}
									<td className="py-4 px-4">
										<div className="flex flex-col items-center gap-1">
											<span className="font-semibold text-slate-800">
												{product.stock}
											</span>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStockBadgeColor(
													product.stock
												)}`}>
												{getStockStatus(product.stock)}
											</span>
										</div>
									</td>

									{/* Sold */}
									<td className="py-4 px-4">
										<span className="font-semibold text-slate-800">
											{product.sold}
										</span>
									</td>

									{/* Rating */}
									<td className="py-4 px-4">
										<div className="flex items-center justify-center gap-1">
											<Star className="w-4 h-4 text-yellow-400 fill-current" />
											<span className="font-medium text-slate-800">
												{product.totalRatings}
											</span>
											<span className="text-xs text-slate-500">
												({product.ratingCount})
											</span>
										</div>
									</td>

									{/* Created At */}
									<td className="py-4 px-4 text-slate-600">
										{moment(product.createdAt).format(
											"DD/MM/YYYY"
										)}
									</td>

									{/* Actions */}
									<td className="py-4 px-4">
										<div className="flex items-center justify-center gap-2">
											<button
												onClick={() =>
													handleView(product._id)
												}
												className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
												title="View Product">
												<Eye className="w-4 h-4" />
											</button>
											<button
												onClick={() =>
													handleEdit(product._id)
												}
												className="p-2 cursor-pointer text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
												title="Edit Product">
												<Edit3 className="w-4 h-4" />
											</button>
											<button
												onClick={() =>
													handleDelete(product._id)
												}
												className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
												title="Delete Product">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between px-10 py-5 bg-slate-50">
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
						pageSize={productsPerPage}
						siblingCount={1}
					/>
				</div>
			</div>

			{/* Empty State */}
			{filteredProducts.length === 0 && (
				<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
					<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Package className="w-8 h-8 text-slate-400" />
					</div>
					<h3 className="text-lg font-semibold text-slate-800 mb-2">
						No products found
					</h3>
					<p className="text-slate-600">
						Try adjusting your search or filter criteria
					</p>
				</div>
			)}

			{/* Edit Product Form */}
			{showEditForm && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowEditForm(false);
							setSelectedProductId(null);
						}
					}}>
					<EditProductForm
						products={products}
						selectedProductId={selectedProductId}
						fetchProducts={fetchProducts}
						onClose={() => {
							setShowEditForm(false);
							setSelectedProductId(null);
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default ManageProducts;
