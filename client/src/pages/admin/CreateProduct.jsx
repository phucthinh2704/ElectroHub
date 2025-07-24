import Quill from "quill";
import "quill/dist/quill.snow.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useQuill } from "react-quilljs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiCreateProduct } from "../../apis/product";
import isDescriptionEmpty from "../../utils/isDescriptionEmpty ";
import toBase64 from "../../utils/toBase64";
const Size = Quill.import("formats/size");
Size.whitelist = ["small", "normal", "large", "huge"];
Quill.register(Size, true);

const CreateProduct = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");
	const [previewImage, setPreviewImage] = useState({
		thumb: "",
		images: [],
	});

	const { categories } = useSelector((state) => state.app);
	const modules = {
		toolbar: [
			// Font chữ và kích cỡ
			[{ size: ["small", false, "large", "huge"] }],

			// Tiêu đề, đậm, nghiêng, gạch chân, gạch ngang
			["bold", "italic", "underline", "strike"],

			// Màu chữ và màu nền
			[{ color: [] }, { background: [] }],

			// Căn lề và căn giữa
			[{ align: [] }],

			// Chèn link, hình ảnh, video
			["link", "image", "video"],

			// Xoá định dạng
			["clean"],
		],
	};

	const { quill, quillRef } = useQuill({
		placeholder: "Enter product description...",
		modules,
	});

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {},
		mode: "onChange",
	});

	const watchedValues = watch();
	useEffect(() => {
		if (quill) {
			quill.on("text-change", () => {
				setValue("description", quill.root.innerHTML);
				clearErrors("description");
				if (
					!quill.root.innerHTML ||
					quill.root.innerHTML.trim() === "" ||
					isDescriptionEmpty(quill.root.innerHTML)
				) {
					setError("description", {
						type: "manual",
						message:
							"Description cannot be empty or contain only whitespace",
					});
				}
			});
		}
	}, [clearErrors, quill, setError, setValue]);
	console.log(watch("description"));

	const handlePreviewImage = async (file) => {
		if (file) {
			if (file.type.startsWith("image/")) {
				const base64Thumb = await toBase64(file);
				setPreviewImage((prev) => ({
					...prev,
					thumb: base64Thumb,
				}));
			} else {
				toast.error("Please upload a valid image file");
			}
		}
	};

	const handlePreviewMultipleImage = async (files) => {
		if (files) {
			const images = [];
			for (const file of files) {
				if (file && file.type?.startsWith("image/")) {
					const base64 = await toBase64(file);
					images.push({ name: file.name, path: base64 });
				} else {
					toast.error("Please upload a valid image file");
					return;
				}
			}
			setPreviewImage((prev) => ({
				...prev,
				images: images,
			}));
		}
	};

	useEffect(() => {
		if (watch("thumb") instanceof FileList && watch("thumb").length > 0) {
			handlePreviewImage(watch("thumb")[0]);
		} else {
			setPreviewImage((prev) => ({
				...prev,
				thumb: "",
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch("thumb")]);

	useEffect(() => {
		if (
			watch("images") instanceof FileList &&
			watch("images").length > 0 &&
			watch("images").length <= 5
		) {
			handlePreviewMultipleImage(watch("images"));
		} else {
			if (
				watch("images") instanceof FileList &&
				watch("images").length > 5
			) {
				setValue("images", []);
			}
			setPreviewImage((prev) => ({
				...prev,
				images: [],
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch("images")]);

	const onSubmit = async (data) => {
		setSubmitMessage("");
		console.log({ data });

		const formData = new FormData();

		data.description = watch("description");
		for (const key in data) {
			if (key === "thumb" && data[key]) {
				formData.append("thumb", data[key][0]);
			} else if (key === "images" && data[key]) {
				for (let image of data[key]) {
					formData.append("images", image);
				}
			} else if (key === "description") {
				if (
					!data[key] ||
					data[key].trim() === "" ||
					isDescriptionEmpty(data[key])
				) {
					console.log(data[key]);
					setError("description", {
						type: "manual",
						message:
							"Description cannot be empty or contain only whitespace",
					});
					return;
				}
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = data[key];

				const paragraphs = tempDiv.querySelectorAll("p");
				const description = Array.from(paragraphs)
					.map((p) => p.innerHTML.trim())
					.filter((text) => text !== "");

				for (let i = 0; i < description.length; i++) {
					if (description[i].trim() !== "") {
						formData.append(`description`, description[i].trim());
					}
				}
			} else {
				formData.append(key, data[key]);
			}
		}

		formData.append("price", data.originalPrice);

		setIsSubmitting(true);
		setTimeout(async () => {
			const response = await apiCreateProduct(formData);
			if (response.success) {
				setSubmitMessage("Product created successfully!");
				Swal.fire({
					title: "Success!",
					text: response.message || "Product created successfully!",
					icon: "success",
					confirmButtonText: "OK",
					confirmButtonColor: "#3085d6",
				});
			} else {
				setSubmitMessage("Failed to create product. Please try again.");
				Swal.fire({
					title: "Error!",
					text:
						response.message ||
						"Failed to create product. Please try again.",
					icon: "error",
					confirmButtonText: "Try Again",
					confirmButtonColor: "#d33",
				});
			}
			setIsSubmitting(false);
		}, 100);
	};

	const handleReset = () => {
		reset({
			title: "",
			originalPrice: "",
			stock: "",
			category: "",
			brand: "",
			description: "",
			color: "",
			thumb: "",
			images: [],
		});
		setPreviewImage({
			thumb: "",
			images: [],
		});
		setSubmitMessage("");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-800">
			{/* Header */}
			<div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
				<div className="max-w-6xl mx-auto p-6">
					<div className="flex items-center space-x-4">
						<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
								Create New Product
							</h1>
							<p className="text-gray-600 mt-1">
								Add a new product to your inventory
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto py-4">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-8">
					{/* Basic Information Card */}
					<div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
						<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-8 py-6 border-b border-gray-200/50">
							<h2 className="text-2xl font-semibold text-gray-800 flex items-center">
								<svg
									className="w-7 h-7 mr-3 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Basic Information
							</h2>
						</div>

						<div className="p-8 space-y-6">
							{/* Product Name */}
							<div className="space-y-2">
								<label className="block text-sm font-semibold text-gray-700">
									Product Name *
								</label>
								<div className="relative">
									<input
										{...register("title", {
											required:
												"Please enter product name",
											minLength: {
												value: 2,
												message:
													"Product name must be at least 2 characters",
											},
											maxLength: {
												value: 100,
												message:
													"Product name must not exceed 100 characters",
											},
										})}
										className={`w-full px-4 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 ${
											errors.title
												? "border-red-400 bg-red-50/50"
												: "border-gray-200"
										}`}
										placeholder="Enter product name"
									/>
									{errors.title && (
										<div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-sm">
											<svg
												className="w-4 h-4 mr-1"
												fill="currentColor"
												viewBox="0 0 20 20">
												<path
													fillRule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											{errors.title.message}
										</div>
									)}
								</div>
							</div>

							{/* Stock and Price Grid */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Stock */}
								<div className="space-y-2">
									<label className="block text-sm font-semibold text-gray-700">
										Stock Quantity *
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
											<svg
												className="w-5 h-5 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
												/>
											</svg>
										</div>
										<input
											type="text"
											onKeyDown={(e) => {
												if (
													!/[0-9]/.test(e.key) &&
													e.key !== "Backspace" &&
													e.key !== "Delete"
												) {
													e.preventDefault();
												}
											}}
											{...register("stock", {
												required:
													"Please enter stock quantity",
												pattern: {
													value: /^[1-9]\d*$/,
													message:
														"Stock must be a positive number",
												},
												min: {
													value: 1,
													message:
														"Stock must be at least 1",
												},
												max: {
													value: 999999,
													message:
														"Stock cannot exceed 999,999",
												},
											})}
											className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 ${
												errors.stock
													? "border-red-400 bg-red-50/50"
													: "border-gray-200"
											}`}
											placeholder="0"
										/>
										{errors.stock && (
											<div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-sm">
												<svg
													className="w-4 h-4 mr-1"
													fill="currentColor"
													viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
														clipRule="evenodd"
													/>
												</svg>
												{errors.stock.message}
											</div>
										)}
									</div>
								</div>

								{/* Original Price */}
								<div className="space-y-2">
									<label className="block text-sm font-semibold text-gray-700">
										Original Price *
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
											<span className="text-gray-500 font-medium">
												$
											</span>
										</div>
										<input
											type="text"
											onKeyDown={(e) => {
												if (
													!/[0-9]/.test(e.key) &&
													e.key !== "Backspace" &&
													e.key !== "Delete"
												) {
													e.preventDefault();
												}
											}}
											{...register("originalPrice", {
												required:
													"Please enter original price",
												pattern: {
													value: /^(?!0+\.?0*$)([1-9]\d*|0)(\.\d{1,2})?$/,
													message:
														"Please enter a valid price (e.g., 10.99)",
												},
												min: {
													value: 1000,
													message:
														"Price must be greater than 1000",
												},
												max: {
													value: 1000000000,
													message:
														"Price cannot exceed 1.000.000.000",
												},
											})}
											className={`w-full pl-10 pr-4 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 ${
												errors.originalPrice
													? "border-red-400 bg-red-50/50"
													: "border-gray-200"
											}`}
											placeholder="0.00"
										/>
										{errors.originalPrice && (
											<div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-sm">
												<svg
													className="w-4 h-4 mr-1"
													fill="currentColor"
													viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
														clipRule="evenodd"
													/>
												</svg>
												{errors.originalPrice.message}
											</div>
										)}
									</div>
								</div>

								{/* Color */}
								<div className="space-y-2">
									<label className="block text-sm font-semibold text-gray-700">
										Color *
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
											<span className="text-gray-500 font-medium">
												$
											</span>
										</div>
										<input
											type="text"
											{...register("color", {
												required:
													"Please enter a color",
											})}
											className={`w-full pl-10 pr-4 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 ${
												errors.color
													? "border-red-400 bg-red-50/50"
													: "border-gray-200"
											}`}
											placeholder="Enter color"
										/>
										{errors.color && (
											<div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-sm">
												<svg
													className="w-4 h-4 mr-1"
													fill="currentColor"
													viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
														clipRule="evenodd"
													/>
												</svg>
												{errors.color.message}
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Category and Brand Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Category */}
								<div className="space-y-2">
									<label className="block text-sm font-semibold text-gray-700">
										Category *
									</label>
									<div className="relative">
										<select
											{...register("category", {
												required:
													"Please select a category",
											})}
											className={`w-full px-4 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer ${
												errors.category
													? "border-red-400 bg-red-50/50"
													: "border-gray-200"
											}`}
											style={{
												backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
												backgroundPosition:
													"right 1rem center",
												backgroundRepeat: "no-repeat",
												backgroundSize:
													"1.25rem 1.25rem",
											}}>
											<option value="">
												Select a category
											</option>
											{categories.map((category) => (
												<option
													key={category._id}
													value={category.title}>
													{category.title}
												</option>
											))}
										</select>
										{errors.category && (
											<div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-sm">
												<svg
													className="w-4 h-4 mr-1"
													fill="currentColor"
													viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
														clipRule="evenodd"
													/>
												</svg>
												{errors.category.message}
											</div>
										)}
									</div>
								</div>

								{/* Brand */}
								<div className="space-y-2">
									<label className="block text-sm font-semibold text-gray-700">
										Brand *
									</label>
									<div className="relative">
										<select
											{...register("brand", {
												required:
													"Please select a brand",
											})}
											disabled={!watchedValues.category}
											className={`w-full px-4 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
												errors.brand
													? "border-red-400 bg-red-50/50"
													: "border-gray-200"
											}`}
											style={{
												backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
												backgroundPosition:
													"right 1rem center",
												backgroundRepeat: "no-repeat",
												backgroundSize:
													"1.25rem 1.25rem",
											}}>
											<option value="">
												{!watchedValues.category
													? "Select category first"
													: "Select a brand"}
											</option>
											{categories
												.find(
													(category) =>
														category.title ===
														watchedValues.category
												)
												?.brand?.map((brand) => (
													<option
														key={brand}
														value={brand}>
														{brand}
													</option>
												))}
										</select>
										{errors.brand && (
											<div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-sm">
												<svg
													className="w-4 h-4 mr-1"
													fill="currentColor"
													viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
														clipRule="evenodd"
													/>
												</svg>
												{errors.brand.message}
											</div>
										)}
									</div>
								</div>
							</div>

							<div>
								<label
									htmlFor="thumb"
									className="text-sm font-semibold text-gray-700 mr-6">
									Upload Thumb Image *
								</label>
								<input
									type="file"
									id="thumb"
									className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
									accept="image/*"
									{...register("thumb", {
										required:
											"Please upload a thumbnail image",
									})}
								/>
								{errors.thumb && (
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
										{errors.thumb.message}
									</div>
								)}
								{previewImage.thumb && (
									<div className="my-2">
										<Zoom>
											<img
												src={previewImage.thumb}
												alt="Thumbnail"
												className="h-[150px] object-contain block rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-500 transition-all duration-300"
											/>
										</Zoom>
									</div>
								)}
							</div>
							<div>
								<label
									htmlFor="products"
									className="text-sm font-semibold text-gray-700 mr-6">
									Upload Images Product *
								</label>
								<input
									type="file"
									id="products"
									className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
									multiple
									accept="image/*"
									{...register("images", {
										required:
											"Please upload product images",
										validate: (files) => {
											if (files.length > 5) {
												return "You can upload a maximum of 5 product images";
											}
											return true;
										},
									})}
								/>
								{errors.images && (
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
										{errors.images.message}
									</div>
								)}
								{previewImage.images.length > 0 && (
									<div className="my-2 flex gap-2">
										{previewImage.images.map(
											(image, index) => (
												<div
													key={index}
													className="relative">
													<Zoom>
														<img
															src={image.path}
															alt={`Preview ${
																index + 1
															}`}
															className="h-[150px] object-contain block rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-500 transition-all duration-300"
														/>
													</Zoom>
												</div>
											)
										)}
									</div>
								)}
							</div>
							{/* Description */}
							<div className="space-y-2">
								<label className="block text-sm font-semibold text-gray-700">
									Product Description *
								</label>
								<div className="rounded-2xl overflow-hidden border-2 border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all duration-300">
									<div className="bg-gray-50 p-4 text-sm text-gray-600">
										Describe your product in detail. Include
										features, specifications, and any other
										relevant information.
									</div>
									{/* <textarea
										className="w-full min-h-[200px] p-4 border-none outline-none bg-white text-sm leading-relaxed text-gray-700 resize-y transition-all duration-300 placeholder:text-gray-400 focus:bg-gray-50"
										{...register("description", {
											required:
												"Please enter product description",
											minLength: {
												value: 10,
												message:
													"Description must be at least 10 characters",
											},
										})}
										placeholder="Enter detailed product description..."
									/> */}
									<div
										style={{
											width: "100%",
											height: 250,
										}}>
										<div
											ref={quillRef}
											className="my-quill-editor"
										/>
									</div>
									{errors.description && (
										<div className="text-red-500 text-sm mt-2 flex items-center">
											<svg
												className="w-4 h-4 mr-1"
												fill="currentColor"
												viewBox="0 0 20 20">
												<path
													fillRule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											{errors.description.message}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Success/Error Message */}
					{submitMessage && (
						<div
							className={`rounded-2xl p-4 flex items-center animate-fade-in ${
								submitMessage.includes("success") ||
								submitMessage.includes("successfully")
									? "bg-green-50 text-green-700 border-2 border-green-200"
									: "bg-red-50 text-red-700 border-2 border-red-200"
							}`}>
							{submitMessage.includes("success") ||
							submitMessage.includes("successfully") ? (
								<svg
									className="w-5 h-5 mr-3 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							) : (
								<svg
									className="w-5 h-5 mr-3 text-red-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							)}
							{submitMessage}
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 pt-4">
						<button
							type="submit"
							disabled={isSubmitting}
							// onClick={handleSubmit(onSubmit)}
							className={`flex-1 sm:flex-none px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
								isSubmitting
									? "bg-gray-200 text-gray-600 cursor-not-allowed"
									: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 cursor-pointer"
							}`}>
							{isSubmitting ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-70"
											cx="12"
											cy="12"
											r="10"
											stroke="#3085d6"
											strokeWidth="4"></circle>
										<path
											className=""
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Creating Product...
								</>
							) : (
								<>
									<svg
										className="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
									Create Product
								</>
							)}
						</button>

						<button
							type="button"
							onClick={handleReset}
							disabled={isSubmitting}
							className="flex-1 sm:flex-none px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer">
							<svg
								className="w-5 h-5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Reset Form
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateProduct;
