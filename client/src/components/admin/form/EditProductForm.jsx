import { Editor } from "@tinymce/tinymce-react";
import { X } from "lucide-react";
import moment from "moment";
import React, { memo, useEffect, useMemo, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import toBase64 from "../../../utils/toBase64";
import { apiUpdateProduct } from "../../../apis";
import formatDescription from "../../../utils/formatDescription";

const EditProductForm = ({
	products,
	selectedProductId,
	fetchProducts,
	onClose,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");
	const [description, setDescription] = useState(() => {
		const selectedProduct = products.find(
			(product) => product._id === selectedProductId
		);
		return formatDescription(selectedProduct?.description);
	});
	const [previewImage, setPreviewImage] = useState(() => {
		const selectedProduct = products.find(
			(product) => product._id === selectedProductId
		);
		return {
			thumb: selectedProduct.thumb || "",
			images: [...selectedProduct.images],
		};
	});
	const [errorsImage, setErrorsImage] = useState({
		thumb: null,
		images: null,
	});
	const { categories } = useSelector((state) => state.app);

	// Tìm product được chọn để edit
	const selectedProduct = products.find(
		(product) => product._id === selectedProductId
	);
	// console.log("Selected Product:", selectedProduct);

	// Dữ liệu ban đầu từ product được chọn
	const initialData = useMemo(
		() => ({
			title: selectedProduct.title || "",
			stock: selectedProduct.stock || 0,
			originalPrice: selectedProduct.originalPrice || 0,
			color: selectedProduct.color || "",
			category: selectedProduct.category || "",
			brand: selectedProduct.brand || "",
			description: (() => {
				if (!selectedProduct?.description) return "";
				if (Array.isArray(selectedProduct.description)) {
					return selectedProduct.description.join(". ");
				}
				return selectedProduct.description;
			})(),
			thumb: selectedProduct.thumb || "",
			images: selectedProduct.images || [],
		}),
		[selectedProduct]
	);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: initialData,
		mode: "onChange",
	});

	const watchedValues = watch();

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
					images.push(base64);
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
			setErrorsImage((prev) => ({
				...prev,
				images: null, // Reset errors when valid
			}));
		} else if (
			watch("images") instanceof FileList &&
			watch("images").length > 5
		) {
			setErrorsImage((prev) => ({
				...prev,
				images: "You can only upload up to 5 images.",
			}));
			setValue("images", []); // Reset the images field
			setPreviewImage((prev) => ({
				...prev,
				images: [],
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch("images")]);

	const onSubmit = (data) => {
		// console.log({ data, description: description.split(". "), previewImage });
		if (
			!description ||
			description.trim() === "" ||
			description.replace(/<[^>]*>/g, "").length < 10 ||
			description.replace(/<[^>]*>/g, "").length > 5000
		) {
			return;
		}

		setSubmitMessage("");
		const formData = new FormData();

		console.log(data);
		for (const key in data) {
			if (data[key] !== initialData[key]) {
				formData.append(key, data[key]);
			}
		}

		formData.append("price", parseInt(data.originalPrice)); // Assuming price is the same as originalPrice
		if (description !== initialData.description) {
			formData.append("description", [description]); // Chuyển đổi mô tả thành mảng
		}
		// formData.append("title", data.title);
		// formData.append("originalPrice", parseInt(data.originalPrice));
		// formData.append("stock", parseInt(data.stock));
		// formData.append("category", data.category);
		// formData.append("brand", data.brand);
		// formData.append("color", data.color);
		formData.delete("thumb");
		formData.delete("images"); // Xóa các trường thumb và images nếu đã tồn tại
		if (data.thumb instanceof FileList && data.thumb.length > 0) {
			formData.append("thumb", data.thumb[0]);
		}

		if (data.images instanceof FileList && data.images.length > 0) {
			for (let image of data.images) formData.append("images", image);
		}
		setIsSubmitting(true);
		try {
			setTimeout(async () => {
				const response = await apiUpdateProduct(
					selectedProductId,
					formData
				);
				if (response.success) {
					fetchProducts(); // Cập nhật lại danh sách sản phẩm từ server
					setSubmitMessage(
						"Product information updated successfully!"
					);
				} else {
					setSubmitMessage("Failed to update product information!");
				}
				setIsSubmitting(false);
			}, 200);
		} catch (error) {
			console.log("An error occurred while updating the product:", error);
			setSubmitMessage("An error occurred while updating the product!");
			setIsSubmitting(false);
		}
	};

	// Hàm reset form về dữ liệu ban đầu
	const handleReset = () => {
		reset(initialData);
		setPreviewImage({
			thumb: initialData.thumb,
			images: [...initialData.images],
		});
		// Sửa phần set description
		const resetDescription = (() => {
			if (!selectedProduct?.description) return "";
			if (Array.isArray(selectedProduct.description)) {
				return selectedProduct.description.join(". ");
			}
			return selectedProduct.description;
		})();

		setDescription(resetDescription);
		setSubmitMessage("");
		setErrorsImage({
			thumb: null,
			images: null,
		});
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
					Edit Product Information
				</h1>
				<p className="text-gray-600">
					Update detailed information for product:{" "}
					<span className="font-semibold">
						{selectedProduct.title}
					</span>
				</p>
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
								Product Name *
							</label>
							<input
								{...register("title", {
									required: "Please enter product name",
									minLength: {
										value: 2,
										message:
											"Product name must be at least 2 characters",
									},
								})}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.title
										? "border-red-600"
										: "border-gray-300"
								}`}
								placeholder="Enter product name"
							/>
							{errors.title && (
								<p className="text-red-500 text-sm mt-1">
									{errors.title.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Stock Quantity *
								</label>
								<input
									type="number"
									{...register("stock", {
										required: "Please enter stock quantity",
										min: {
											value: 0,
											message:
												"Stock quantity must be at least 0",
										},
									})}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										errors.stock
											? "border-red-600"
											: "border-gray-300"
									}`}
									placeholder="0"
								/>
								{errors.stock && (
									<p className="text-red-500 text-sm mt-1">
										{errors.stock.message}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Original Price *
								</label>
								<input
									type="number"
									step="1000"
									{...register("originalPrice", {
										required: "Please enter original price",
										min: {
											value: 0,
											message:
												"Price must be greater than 0",
										},
									})}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										errors.originalPrice
											? "border-red-600"
											: "border-gray-300"
									}`}
									placeholder="0.00"
								/>
								{errors.originalPrice && (
									<p className="text-red-500 text-sm mt-1">
										{errors.originalPrice.message}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Color *
								</label>
								<input
									{...register("color", {
										required: "Please enter color",
									})}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										errors.color
											? "border-red-600"
											: "border-gray-300"
									}`}
									placeholder="Enter color"
								/>
								{errors.color && (
									<p className="text-red-500 text-sm mt-1">
										{errors.color.message}
									</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Category *
								</label>
								<select
									{...register("category", {
										required: "Please select a category",
									})}
									onChange={(e) => {
										setValue("category", e.target.value);
										// Reset brand when category changes
										setValue("brand", "");
									}}
									value={watchedValues.category || ""}
									className={`w-full px-3 py-2 border rounded-md uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										errors.category
											? "border-red-600"
											: "border-gray-300"
									}`}>
									{categories.map((category) => (
										<option
											key={category._id}
											value={category.title}>
											{category.title}
										</option>
									))}
								</select>
								{errors.category && (
									<p className="text-red-500 text-sm mt-1">
										{errors.category.message}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Brand *
								</label>
								<select
									{...register("brand", {
										required: "Please select a brand",
									})}
									value={watchedValues.brand || ""}
									className={`w-full px-3 py-2 border uppercase rounded-md outline-none ${
										errors.brand
											? "border-red-600"
											: "border-gray-300 focus:ring-2 focus:ring-blue-500"
									}`}>
									<option value="">Select a brand</option>
									{categories
										.find(
											(category) =>
												category.title.toLowerCase() ===
												watchedValues.category.toLowerCase()
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
									<p className="text-red-500 text-sm mt-1">
										{errors.brand.message}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Image Upload Section */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">
						Product Images
					</h2>

					<div className="space-y-4">
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
								{...register("thumb")}
							/>
							{errorsImage.thumb && (
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
									{errorsImage.thumb}
								</div>
							)}
							<div>
								{previewImage.thumb && (
									<img
										src={previewImage.thumb}
										alt="Thumbnail Preview"
										className="h-30 object-cover rounded-md border border-gray-300"
									/>
								)}
							</div>
						</div>

						<div>
							<label
								htmlFor="images"
								className="text-sm font-semibold text-gray-700 mr-6">
								Upload Images Product *
							</label>
							<input
								type="file"
								id="images"
								className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
								accept="image/*"
								multiple
								{...register("images")}
							/>
							{errorsImage.images && (
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
									{errorsImage.images}
								</div>
							)}
							<div className="mt-2 flex items-center gap-2">
								{previewImage.images.map((image, index) => (
									<Zoom key={index}>
										<img
											src={image}
											alt="Image Preview"
											className="h-30 object-cover rounded-md border border-gray-300"
										/>
									</Zoom>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Product Description */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">
						Product Description
					</h2>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Product Description *
						</label>
						{/* <textarea
							{...register("description", {
								required: "Please enter product description",
								minLength: {
									value: 10,
									message:
										"Description must be at least 10 characters",
								},
							})}
							rows={6}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
								errors.description
									? "border-red-600"
									: "border-gray-300"
							}`}
							placeholder="Describe your product in detail. Include features, specifications, and any other relevant information."
						/> */}
						<div className="min-h-[200px]">
							<Editor
								initialValue={description}
								onChange={(e) =>
									setDescription(e.target.getContent())
								}
								apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
								init={{
									plugins: [
										// Core editing features
										"anchor",
										"autolink",
										"charmap",
										"codesample",
										"emoticons",
										"image",
										"link",
										"lists",
										"media",
										"searchreplace",
										"table",
										"visualblocks",
										"wordcount",
										// Your account includes a free trial of TinyMCE premium features
										// Try the most popular premium features until Jun 13, 2025:
										"checklist",
										"mediaembed",
										"casechange",
										"formatpainter",
										"pageembed",
										"a11ychecker",
										"tinymcespellchecker",
										"permanentpen",
										"powerpaste",
										"advtable",
										"advcode",
										"editimage",
										"advtemplate",
										"ai",
										"mentions",
										"tinycomments",
										"tableofcontents",
										"footnotes",
										"mergetags",
										"autocorrect",
										"typography",
										"inlinecss",
										"markdown",
										"importword",
										"exportword",
										"exportpdf",
									],
									toolbar:
										"undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
									tinycomments_mode: "embedded",
									tinycomments_author: "Author name",
									mergetags_list: [
										{
											value: "First.Name",
											title: "First Name",
										},
										{
											value: "Email",
											title: "Email",
										},
									],
									ai_request: (request, respondWith) =>
										respondWith.string(() =>
											Promise.reject(
												"See docs to implement AI Assistant"
											)
										),
								}}
							/>
						</div>
						{errors.description && (
							<p className="text-red-500 text-sm mt-1">
								{errors.description.message}
							</p>
						)}
					</div>
				</div>

				{/* System Information (Read Only) */}
				<div className="bg-blue-50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">
						System Information (Read Only)
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<p className="text-gray-600">Product ID:</p>
							<p className="font-mono text-gray-800">
								{selectedProduct._id}
							</p>
						</div>
						<div>
							<p className="text-gray-600">Created Date:</p>
							<p className="text-gray-800">
								{moment(selectedProduct.createdAt).format(
									"DD/MM/YYYY, h:mm:ss A"
								)}
							</p>
						</div>
						{selectedProduct.updatedAt && (
							<div>
								<p className="text-gray-600">Last Updated:</p>
								<p className="text-gray-800">
									{moment(selectedProduct.updatedAt).format(
										"DD/MM/YYYY, h:mm:ss A"
									)}
								</p>
							</div>
						)}
						<div>
							<p className="text-gray-600">Stock Status:</p>
							<p
								className={`font-medium ${
									selectedProduct.stock > 0
										? "text-green-600"
										: "text-red-600"
								}`}>
								{selectedProduct.stock > 0
									? `✅ In Stock (${selectedProduct.stock})`
									: "❌ Out of Stock"}
							</p>
						</div>
					</div>
				</div>

				{/* Notification */}
				{submitMessage && (
					<div
						className={`p-4 rounded-md ${
							submitMessage.includes("success") ||
							submitMessage.includes("thành công")
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
								Updating...
							</span>
						) : (
							"Update Product"
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

export default memo(EditProductForm);
