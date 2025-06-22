import { X } from "lucide-react";
import moment from "moment";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiAddCategory, apiUpdateCategory } from "../../../apis";
import toBase64 from "../../../utils/toBase64";
import { getCategories } from "../../../store/app/asyncActions";
import { useDispatch } from "react-redux";

const EditCategoryForm = ({
	categories,
	selectedCategoryId,
	fetchCategories,
	onClose,
	mode,
}) => {
	const isAddMode = mode === "add";
	const dispatch = useDispatch();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");
	const [previewImage, setPreviewImage] = useState(() => {
		const selectedCategory = categories.find(
			(category) => category._id === selectedCategoryId
		);
		return !isAddMode ? selectedCategory.image : "";
	});
	const [image, setImage] = useState(() => {
		const selectedCategory = categories.find(
			(category) => category._id === selectedCategoryId
		);
		return !isAddMode ? selectedCategory.image : "";
	});

	// Tìm category được chọn để edit
	const selectedCategory = useMemo(
		() =>
			!isAddMode
				? categories.find(
						(category) => category._id === selectedCategoryId
				  )
				: {},
		[categories, isAddMode, selectedCategoryId]
	);

	// Dữ liệu ban đầu từ category được chọn
	const initialData = useMemo(
		() => ({
			title: selectedCategory.title || "",
			brand: selectedCategory.brand || [],
			image: selectedCategory.image || "",
		}),
		[selectedCategory]
	);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: initialData,
		mode: "onChange",
	});

	const [brandInput, setBrandInput] = useState("");
	const [brandList, setBrandList] = useState(initialData.brand);

	const handlePreviewImage = async (file) => {
		if (file) {
			if (file.type.startsWith("image/")) {
				const base64Image = await toBase64(file);
				setPreviewImage(base64Image);
			} else {
				toast.error("Please upload a valid image file");
			}
		}
	};

	const handleAddBrand = () => {
		if (
			brandInput.trim() &&
			!brandList.includes(brandInput.trim().toUpperCase())
		) {
			const newBrand = brandInput.trim().toUpperCase();
			setBrandList([...brandList, newBrand]);
			setBrandInput("");
		} else if (brandList.includes(brandInput.trim().toUpperCase())) {
			toast.error("Brand already exists");
		}
	};

	const handleRemoveBrand = (indexToRemove) => {
		setBrandList(brandList.filter((_, index) => index !== indexToRemove));
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddBrand();
		}
	};

	useEffect(() => {
		if (watch("image") instanceof FileList && watch("image").length > 0) {
			handlePreviewImage(watch("image")[0]);
			setImage(watch("image"));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch("image")]);

	const onSubmit = async (data) => {
		setSubmitMessage("");

		if (isAddMode && !image) {
			setError("image", {
				type: "manual",
				message: "Please upload an image for the category",
			});
			return;
		}

		const formData = new FormData();
		if (data.title !== initialData.title) {
			const existingCategory = categories.find(
				(category) =>
					category.title.toLowerCase() === data.title.toLowerCase()
			);
			if (existingCategory) {
				setError("title", {
					type: "manual",
					message: "Category with this title already exists",
				});
				return;
			}
		}
		formData.append("title", data.title);

		// Add brands to formData
		brandList.forEach((brand) => {
			formData.append("brand", brand);
		});

		// Handle image upload
		if (image instanceof FileList && image.length > 0) {
			formData.append("image", image[0]);
		}

		setIsSubmitting(true);
		try {
			const response = isAddMode
				? await apiAddCategory(formData)
				: await apiUpdateCategory(selectedCategoryId, formData);
			if (response.success) {
				dispatch(getCategories());
				fetchCategories(); // Cập nhật lại danh sách category từ server
				setSubmitMessage(
					`Category ${isAddMode ? "added" : "updated"} successfully!`
				);
			} else {
				setSubmitMessage("Failed to update category information!");
				Swal.fire({
					icon: "error",
					title: "Error",
					text:
						response.message ||
						"An error occurred while updating the category.",
				});
			}
			setIsSubmitting(false);
		} catch (error) {
			console.log(
				"An error occurred while updating the category:",
				error
			);
			setSubmitMessage("An error occurred while updating the category!");
			setIsSubmitting(false);
		}
	};

	// Hàm reset form về dữ liệu ban đầu
	const handleReset = () => {
		reset(initialData);
		setPreviewImage(initialData.image);
		setImage(initialData.image);
		setBrandList(initialData.brand);
		setBrandInput("");
		setSubmitMessage("");
	};

	return (
		<div className="w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg text-black relative max-h-screen overflow-y-auto">
			{/* Close button */}
			<button
				onClick={onClose}
				className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
				type="button">
				<X size={24} />
			</button>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800 mb-2 uppercase">
					{!isAddMode ? "Edit" : "Add"} Category Information
				</h1>
				{!isAddMode && (
					<p className="text-gray-600">
						Update detailed information for category:{" "}
						<span className="font-semibold">
							{selectedCategory.title}
						</span>
					</p>
				)}
			</div>

			<div className="space-y-4">
				{/* Basic Information */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">
						Basic Information
					</h2>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Category Name *
							</label>
							<input
								{...register("title", {
									required: "Please enter category name",
									minLength: {
										value: 2,
										message:
											"Category name must be at least 2 characters",
									},
								})}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.title
										? "border-red-600"
										: "border-gray-300"
								}`}
								placeholder="Enter category name"
							/>
							{errors.title && (
								<p className="text-red-500 text-sm mt-1">
									{errors.title.message}
								</p>
							)}
						</div>

						{/* Brand Management */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Brands
							</label>
							<div className="flex gap-2 mb-2">
								<input
									type="text"
									value={brandInput}
									onChange={(e) =>
										setBrandInput(e.target.value)
									}
									onKeyDown={handleKeyPress}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter brand name"
								/>
								<button
									type="button"
									onClick={handleAddBrand}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
									Add
								</button>
							</div>
							{brandList.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{brandList.map((brand, index) => (
										<span
											key={index}
											className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
											{brand}
											<button
												type="button"
												onClick={() =>
													handleRemoveBrand(index)
												}
												className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer">
												<X size={14} />
											</button>
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Image Upload Section */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold text-gray-700">
						Category Image
					</h2>

					<div className="space-y-2">
						<div>
							<label
								htmlFor="image"
								className="text-sm font-semibold text-gray-700 mr-6">
								Upload Category Image
							</label>
							<input
								type="file"
								id="image"
								className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
								accept="image/*"
								{...register("image")}
							/>
							{errors.image && (
								<div className="text-red-500 text-sm mt-2">
									<svg
										className="w-4 h-4 mr-1 inline-block"
										fill="currentColor"
										viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									{errors.image.message}
								</div>
							)}
							<div className="mt-4">
								{previewImage && (
									<Zoom>
										<img
											src={previewImage}
											alt={selectedCategory.title || "Category Image"}
											loading="lazy"
											decoding="async"
											className="h-40 object-contain block rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-500 transition-all duration-300"
										/>
									</Zoom>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* System Information (Read Only) */}
				<div className="bg-blue-50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">
						System Information (Read Only)
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<p className="text-gray-600">Category ID:</p>
							<p className="font-mono text-gray-800">
								{selectedCategory._id}
							</p>
						</div>
						<div>
							<p className="text-gray-600">Created Date:</p>
							<p className="text-gray-800">
								{moment(selectedCategory.createdAt).format(
									"DD/MM/YYYY, h:mm:ss A"
								)}
							</p>
						</div>
						{selectedCategory.updatedAt && (
							<div>
								<p className="text-gray-600">Last Updated:</p>
								<p className="text-gray-800">
									{moment(selectedCategory.updatedAt).format(
										"DD/MM/YYYY, h:mm:ss A"
									)}
								</p>
							</div>
						)}
						<div>
							<p className="text-gray-600">Total Brands:</p>
							<p className="font-medium text-blue-600">
								{brandList.length} brands
							</p>
						</div>
					</div>
				</div>

				{/* Notification */}
				{submitMessage && (
					<div
						className={`p-4 rounded-md ${
							submitMessage.includes("success")
								? "bg-green-50 text-green-700 border border-green-200"
								: "bg-red-50 text-red-700 border border-red-200"
						}`}>
						{submitMessage}
					</div>
				)}

				{/* Buttons */}
				<div className="flex flex-wrap gap-4 pt-4 border-t">
					<button
						type="button"
						onClick={handleSubmit(onSubmit)}
						disabled={isSubmitting}
						className={`px-6 py-2 rounded-md font-medium transition-colors ${
							isSubmitting
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: "bg-blue-600 text-white cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
						}`}>
						{isSubmitting ? (
							<span className="flex items-center">
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									fill="none"
									viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								{!isAddMode ? "Updating..." : "Adding..."}
							</span>
						) : (
							<>
								{!isAddMode
									? "Update Category"
									: "Add Category"}
							</>
						)}
					</button>

					<button
						type="button"
						onClick={handleReset}
						disabled={isSubmitting}
						className="px-6 py-2 bg-gray-500 text-white cursor-pointer rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
						Reset
					</button>

					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="px-6 py-2 bg-red-500 text-white cursor-pointer rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(EditCategoryForm);
