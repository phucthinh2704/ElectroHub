import {
	Calendar,
	Download,
	Edit3,
	FolderOpen,
	FolderPlus,
	Image,
	Loader2,
	Search,
	Tag,
	Trash2,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategories } from "../../store/app/asyncActions";
import Swal from "sweetalert2";
import { apiDeleteCategory, apiGetAllCategories } from "../../apis";
import { EditCategoryForm } from "../../components";
import Pagination from "../../components/public/pagination/Pagination";
import getPaginationInfo from "../../utils/getPaginationInfo";
import { useDispatch } from "react-redux";

const ManageCategories = () => {
	const [categories, setCategories] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [showEditForm, setShowEditForm] = useState(false);
	const [selectedCategoryId, setSelectedCategoryId] = useState(null);
	const [categoriesPerPage] = useState(8);
	const [loading, setLoading] = useState(true);
	const [mode, setMode] = useState("add"); // "add" or "edit"

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const fetchCategories = async () => {
		try {
			const response = await apiGetAllCategories();
			if (response.success) setCategories(response.categories);
			else toast.error(response.message || "Failed to fetch categories");
			setLoading(false);
		} catch (e) {
			setLoading(false);
			toast.error(e.message || "Error fetching categories");
			console.log("Error fetching categories:", e.message);
		}
	};
	useEffect(() => {
		fetchCategories();

		const params = new URLSearchParams(window.location.search);
		const page = params.get("page") || 1;
		setCurrentPage(Number(page));
	}, []);

	// Filter categories based on search
	const filteredCategories = categories.filter((category) => {
		const matchesSearch =
			category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			category.brand.some((brand) =>
				brand.toLowerCase().includes(searchTerm.toLowerCase())
			);
		return matchesSearch;
	});

	const handleFilterChange = (value) => {
		setSearchTerm(value);
		const params = new URLSearchParams(window.location.search);
		params.set("page", 1);
		setCurrentPage(1);
		navigate({
			pathname: window.location.pathname,
			search: params.toString(),
		});
	};

	// Pagination
	const indexOfLastCategory = currentPage * categoriesPerPage;
	const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
	const currentCategories = filteredCategories.slice(
		indexOfFirstCategory,
		indexOfLastCategory
	);

	const handleEdit = (categoryId) => {
		setSelectedCategoryId(categoryId);
		setShowEditForm(true);
		setMode("edit");
	};

	const handleDelete = (categoryId) => {
		Swal.fire({
			title: "Are you sure delete this category?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await apiDeleteCategory(categoryId);
					if (response.success) {
						dispatch(getCategories());
						setCategories(
							categories.filter(
								(category) => category._id !== categoryId
							)
						);
						if (currentCategories.length === 1 && currentPage > 1) {
							console.log(
								"No categories on current page, going back one page"
							);
							setCurrentPage(currentPage - 1);
							navigate({
								pathname: window.location.pathname,
								search: `?page=${currentPage - 1}`,
							});
						}
						toast.success(response.message);
					} else {
						toast.error(
							response.message || "Failed to delete category"
						);
					}
				} catch (e) {
					console.error("Error deleting category:", e.message || e);
				}
			}
		});
	};

	const { startItem, endItem } = getPaginationInfo(
		currentPage,
		categoriesPerPage,
		filteredCategories.length
	);

	return (
		<div className="p-6 bg-slate-100 min-h-screen">
			{loading ? (
				<div className="flex items-center justify-center h-screen">
					<Loader2
						size={40}
						className="animate-spin text-main"
					/>
				</div>
			) : (
				<>
					{/* Header */}
					<div className="mb-6">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h1 className="text-3xl font-bold text-slate-800 mb-2 uppercase">
									Manage Categories
								</h1>
								<p className="text-slate-600">
									Manage and monitor all product categories in
									your system
								</p>
							</div>
							<div className="flex items-center gap-4">
								<button
									className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
									onClick={() => {
										setShowEditForm(true);
										setMode("add");
									}}>
									<FolderPlus />
									Add New Category
								</button>
								<button
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"	
									onClick={() => {
										setShowEditForm(true);
										setMode("add");
									}}>
									<Download />
									Export Categories
								</button>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-slate-600 text-sm font-medium">
											Total Categories
										</p>
										<p className="text-2xl font-bold text-slate-800">
											{categories.length}
										</p>
									</div>
									<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
										<FolderOpen
											color="blue"
											size={28}
										/>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-slate-600 text-sm font-medium">
											Total Brands
										</p>
										<p className="text-2xl font-bold text-green-600">
											{
												[
													...new Set(
														categories
															.map(
																(cat) =>
																	cat.brand
															)
															.flat()
													),
												].length
											}
										</p>
									</div>
									<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
										<Tag
											color="green"
											size={28}
										/>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-slate-600 text-sm font-medium">
											Latest Update
										</p>
										<p className="text-2xl font-bold text-purple-600">
											{categories.length > 0
												? moment(
														Math.max(
															...categories.map(
																(cat) =>
																	new Date(
																		cat.updatedAt
																	)
															)
														)
												  ).format("DD/MM")
												: "N/A"}
										</p>
									</div>
									<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
										<Calendar
											color="purple"
											size={28}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Search */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 text-black">
							<div className="flex flex-col md:flex-row gap-4">
								<div className="flex-1">
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
											<Search />
										</div>
										<input
											type="text"
											placeholder="Search categories by title or brand..."
											value={searchTerm}
											onChange={(e) =>
												handleFilterChange(
													e.target.value
												)
											}
											className="w-full pl-10 pr-4 py-3 outline-none border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Categories Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
						{currentCategories.map((category, index) => (
							<div
								key={category._id}
								className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200">
								{/* Category Image */}
								<div className="relative h-50 bg-white">
									{category.image ? (
										<img
											src={category.image}
											alt={category.title}
											className="h-full w-full object-contain"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-slate-400">
											<Image size={48} />
										</div>
									)}
									<div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-slate-700">
										#{indexOfFirstCategory + index + 1}
									</div>
								</div>

								{/* Category Info */}
								<div className="p-4">
									<div className="mb-4">
										<h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 text-center">
											{category.title}
										</h3>
										<div className="text-sm text-slate-600 mb-3">
											<div className="flex items-center gap-1 mb-1">
												<Calendar size={14} />
												<span>
													Created:{" "}
													{moment(
														category.createdAt
													).format("DD/MM/YYYY")}
												</span>
											</div>
											<div className="flex items-center gap-1">
												<Calendar size={14} />
												<span>
													Updated:{" "}
													{moment(
														category.updatedAt
													).format("DD/MM/YYYY")}
												</span>
											</div>
										</div>
									</div>

									{/* Brands */}
									<div className="mb-4">
										<p className="text-sm font-medium text-slate-700 mb-2">
											Brands ({category.brand.length})
										</p>
										<div className="flex flex-wrap gap-1">
											{category.brand
												.slice(0, 3)
												.map((brand, brandIndex) => (
													<span
														key={brandIndex}
														className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
														{brand}
													</span>
												))}
											{category.brand.length > 3 && (
												<span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
													+{category.brand.length - 3}{" "}
													more
												</span>
											)}
										</div>
									</div>

									{/* Actions */}
									<div className="flex items-center justify-between pt-2 border-t border-slate-100">
										<div className="text-xs text-slate-500">
											ID: {category._id.slice(-8)}
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() =>
													handleEdit(category._id)
												}
												className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
												title="Edit Category">
												<Edit3 size={16} />
											</button>
											<button
												onClick={() =>
													handleDelete(category._id)
												}
												className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
												title="Delete Category">
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Pagination */}
					{filteredCategories.length > 0 && (
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
							<div className="flex items-center justify-between px-10 py-5 bg-slate-100">
								<div>
									<div className="text-sm text-gray-500">
										Showing {filteredCategories.length}{" "}
										categor
										{filteredCategories.length !== 1
											? "ies"
											: "y"}
									</div>
									<div className="text-sm text-slate-600">
										Show categories {startItem} - {endItem}{" "}
										of {filteredCategories.length}
									</div>
								</div>
								<Pagination
									totalCount={filteredCategories.length}
									currentPage={currentPage}
									onPageChange={setCurrentPage}
									pageSize={categoriesPerPage}
									siblingCount={1}
								/>
							</div>
						</div>
					)}

					{/* Empty State */}
					{filteredCategories.length === 0 && (
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
							<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<FolderOpen className="w-8 h-8 text-slate-400" />
							</div>
							<h3 className="text-lg font-semibold text-slate-800 mb-2">
								No categories found
							</h3>
							<p className="text-slate-600">
								{searchTerm
									? "Try adjusting your search criteria"
									: "Start by creating your first category"}
							</p>
						</div>
					)}

					{/* Edit Category Form */}
					{showEditForm && (
						<div
							className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
							onClick={(e) => {
								if (e.target === e.currentTarget) {
									setShowEditForm(false);
									setSelectedCategoryId(null);
								}
							}}>
							<EditCategoryForm
								categories={categories}
								setCategories={setCategories}
								fetchCategories={fetchCategories}
								selectedCategoryId={selectedCategoryId}
								onClose={() => {
									setShowEditForm(false);
									setSelectedCategoryId(null);
								}}
								mode={mode}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ManageCategories;
