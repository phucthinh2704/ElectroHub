import { X } from "lucide-react";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toBase64 from "../../../utils/toBase64";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { apiEditProductVariant, apiUpdateProductVariant } from "../../../apis";

const AddVariants = ({
	onClose,
	products,
	selectedProductId,
	fetchProducts,
	mode,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [variantSelected, setVariantSelected] = useState(() => {
		const selectedProduct = products.find(
			(product) => product._id === selectedProductId
		);
		return mode === "add" ? {} : selectedProduct.variants[0] || {};
	});
	const [previewImage, setPreviewImage] = useState(() => {
		const selectedProduct = products.find(
			(product) => product._id === selectedProductId
		);
		return {
			thumb:
				mode === "add"
					? selectedProduct.thumb || ""
					: variantSelected.thumb || "",
			images:
				mode === "add"
					? [...selectedProduct.images]
					: [...variantSelected.images],
		};
	});
	const [thumb, setThumb] = useState(() => {
		const selectedProduct = products.find(
			(product) => product._id === selectedProductId
		);
		return mode === "add"
			? selectedProduct.thumb || ""
			: variantSelected.thumb || "";
	});
	const [images, setImages] = useState(() => {
		const selectedProduct = products.find(
			(product) => product._id === selectedProductId
		);
		return mode === "add"
			? [...selectedProduct.images]
			: [...variantSelected.images];
	});

	const selectedProduct = products.find(
		(product) => product._id === selectedProductId
	);

	const initialData = useMemo(
		() => ({
			stock:
				mode === "add"
					? selectedProduct.stock || 0
					: variantSelected.stock || 0,
			color:
				mode === "add"
					? selectedProduct.color || ""
					: variantSelected.color || "",
			thumb:
				mode === "add"
					? selectedProduct.thumb || ""
					: variantSelected.thumb || "",
			images:
				mode === "add"
					? selectedProduct.images || []
					: variantSelected.images || [],
			price:
				mode === "add"
					? selectedProduct.price || 0
					: variantSelected.price || 0,
		}),
		[selectedProduct, mode, variantSelected]
	);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setError,
		setValue,
		clearErrors,
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
			setThumb(watch("thumb"));
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
			setImages(watch("images"));
		} else if (
			watch("images") instanceof FileList &&
			watch("images").length > 5
		) {
			setImages([]);
			setError(
				"images",
				{
					type: "manual",
					message: "You can only upload up to 5 images.",
				},
				{ shouldFocus: true }
			);
			setPreviewImage((prev) => ({
				...prev,
				images: [],
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch("images")]);

	const onSubmit = (data) => {
		if (
			watchedValues.color.toLowerCase() ===
				initialData.color.toLowerCase() &&
			mode === "add"
		) {
			setError(
				"color",
				{
					type: "manual",
					message:
						"Color cannot be the same as the previous variant!",
				},
				{ shouldFocus: true }
			);
			return;
		}

		const formData = new FormData();

		for (const key in data) {
			if (key !== "thumb" && key !== "images") {
				formData.append(key, data[key]);
			}
		}

		if (mode === "add") {
			if (thumb instanceof FileList && thumb.length > 0) {
				formData.append("thumb", thumb[0]);
			} else if (typeof thumb === "string" && thumb) {
				setError(
					"thumb",
					{
						type: "manual",
						message: "Please upload another thumb image.",
					},
					{ shouldFocus: true }
				);
				return;
			} else {
				console.log("No thumb uploaded or thumb field is empty.");
			}

			if (images instanceof FileList && images.length > 0) {
				for (let image of images) {
					formData.append("images", image);
				}
			} else if (Array.isArray(images) && images.length > 0) {
				setError(
					"images",
					{
						type: "manual",
						message: "Please upload another images product.",
					},
					{ shouldFocus: true }
				);
				return;
			} else if (Array.isArray(images) && images.length === 0) {
				setError(
					"images",
					{
						type: "manual",
						message: "Please upload at least one image product.",
					},
					{ shouldFocus: true }
				);
				return;
			} else {
				console.log("No images uploaded or thumb field is empty.");
			}

			setIsSubmitting(true);
			try {
				setTimeout(async () => {
					const response = await apiUpdateProductVariant(
						selectedProductId,
						formData
					);
					if (response.success) {
						fetchProducts();
						Swal.fire({
							icon: "success",
							title: "Success",
							text:
								response.message ||
								"Product variant added successfully!",
						});
						reset({
							stock:
								response.product.variants[
									response.product.variants.length - 1
								].stock || 0,
							color:
								response.product.variants[
									response.product.variants.length - 1
								].color || "",
							thumb:
								response.product.variants[
									response.product.variants.length - 1
								].thumb || "",
							images: [
								...response.product.variants[
									response.product.variants.length - 1
								].images,
							],
							price:
								response.product.variants[
									response.product.variants.length - 1
								].price || 0,
						});
					} else {
						Swal.fire({
							icon: "error",
							title: "Error",
							text:
								response.message ||
								"Failed to update product variant!",
						});
					}
					setIsSubmitting(false);
				}, 200);
			} catch (error) {
				console.log(
					"An error occurred while updating the product:",
					error
				);
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "An error occurred while updating the product!",
				});
				setIsSubmitting(false);
			}
		} else if (mode === "edit") {
			if (thumb instanceof FileList && thumb.length > 0) {
				formData.append("thumb", thumb[0]);
			}

			if (images instanceof FileList && images.length > 0) {
				for (let image of images) {
					formData.append("images", image);
				}
			}

			setIsSubmitting(true);
			try {
				setTimeout(async () => {
					const response = await apiEditProductVariant(
						selectedProductId,
						variantSelected.sku,
						formData
					);

					if (response.success) {
						fetchProducts();
						Swal.fire({
							icon: "success",
							title: "Success",
							text:
								response.message ||
								"Product variant updated successfully!",
						});

						const variantUpdate = response.product.variants.find(
							(variant) => variant.sku === variantSelected.sku
						);
						reset({
							stock: variantUpdate.stock || 0,
							color: variantUpdate.color || "",
							thumb: variantUpdate.thumb || "",
							images: [...variantUpdate.images],
							price: variantUpdate.price || 0,
						});
					} else {
						Swal.fire({
							icon: "error",
							title: "Error",
							text:
								response.message ||
								"Failed to update product variant!",
						});
					}
					setIsSubmitting(false);
				}, 200);
			} catch (error) {
				console.log(
					"An error occurred while updating the product:",
					error
				);
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "An error occurred while updating the product!",
				});
				setIsSubmitting(false);
			}
		}
	};

	// Hàm reset form về dữ liệu ban đầu
	const handleReset = () => {
		setVariantSelected(selectedProduct.variants[0] || {});
		reset(initialData);
		setPreviewImage({
			thumb:
				mode === "add"
					? initialData.thumb
					: variantSelected.thumb || "",
			images:
				mode === "add"
					? [...initialData.images]
					: [...variantSelected.images],
		});
		setThumb(
			mode === "add" ? initialData.thumb : variantSelected.thumb || ""
		);
		setImages(
			mode === "add"
				? [...initialData.images]
				: [...variantSelected.images]
		);
	};

	return (
		<div className="w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-black relative max-h-screen overflow-y-auto">
			<button
				onClick={onClose}
				className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
				type="button">
				<X size={24} />
			</button>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800 mb-2 uppercase">
					{mode === "add" ? "Add Variant" : "Edit Variant"}
				</h1>
				<p className="text-gray-600">
					{mode === "add" ? "Add" : "Edit"} variant for product:{" "}
					<span className="font-semibold">
						{selectedProduct.title}
					</span>
				</p>
			</div>
			<form className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{mode === "add" ? (
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
					) : (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Color *
							</label>
							<select
								{...register("color", {
									required: "Please enter color",
								})}
								onChange={(e) => {
									clearErrors([
										"stock",
										"price",
										"thumb",
										"images",
									]);
									// setValue("color", e.target.value);
									const variant =
										selectedProduct.variants.find(
											(variant) =>
												variant.color === e.target.value
										);
									if (variant) {
										setVariantSelected(variant);
										setPreviewImage({
											thumb: variant.thumb || "",
											images: [...variant.images],
										});
										setThumb(variant.thumb || "");
										setImages([...variant.images]);
										setValue("stock", variant.stock || 0);
										setValue("price", variant.price || 0);
									} else {
										setVariantSelected({});
										setPreviewImage({
											thumb: "",
											images: [],
										});
									}
								}}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.color
										? "border-red-600"
										: "border-gray-300"
								}`}
								defaultValue={variantSelected.color || ""}>
								{selectedProduct.variants.map(
									(variant, index) => (
										<option
											key={index}
											value={variant.color}>
											{variant.color}
										</option>
									)
								)}
							</select>
							{errors.color && (
								<p className="text-red-500 text-sm mt-1">
									{errors.color.message}
								</p>
							)}
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Stock Quantity *
						</label>
						<input
							type="text"
							// defaultValue={variantSelected.stock || ""}
							{...register("stock", {
								required: "Please enter stock quantity",
								pattern: {
									value: /^\d+$/,
									message: "Stock must be a number",
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
							Price *
						</label>
						<input
							type="text"
							{...register("price", {
								required: "Please enter price",
								pattern: {
									value: /^\d+(\.\d{1,2})?$/,
									message: "Price must be a valid number",
								},
							})}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								errors.price
									? "border-red-600"
									: "border-gray-300"
							}`}
							placeholder="0.00"
						/>
						{errors.price && (
							<p className="text-red-500 text-sm mt-1">
								{errors.price.message}
							</p>
						)}
					</div>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold text-gray-700">
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
							<div>
								{previewImage.thumb && (
									<Zoom>
										<img
											src={previewImage.thumb}
											alt={selectedProduct.title}
											loading="lazy"
											decoding="async"
											className="h-30 object-contain block rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-500 transition-all duration-300"
										/>
									</Zoom>
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
							<div className="mt-2 flex items-center gap-2">
								{previewImage.images.map((image, index) => (
									<Zoom key={index}>
										<img
											src={image || null}
											alt={`Image Preview ${selectedProduct.title} ${index + 1}`}
											loading="lazy"
											decoding="async"
											className="h-30 object-contain block rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-500 transition-all duration-300"
										/>
									</Zoom>
								))}
							</div>
						</div>
					</div>
				</div>

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
							<>
								{mode === "add"
									? "Add Variant"
									: "Update Variant"}
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
			</form>
		</div>
	);
};

export default memo(AddVariants);
