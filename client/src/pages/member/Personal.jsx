import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateCurrentUser } from "../../apis/user";
import toBase64 from "../../utils/toBase64";
import moment from "moment";
import avatarDefault from "../../assets/avatarDefault.png";
import { getCurrent } from "../../store/user/asyncAction";

const Personal = () => {
	const dispatch = useDispatch();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");
	const [previewAvatar, setPreviewAvatar] = useState("");

	const { current } = useSelector((state) => state.user);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		reset,
		setValue,
	} = useForm({
		defaultValues: {
			name: current.name,
			email: current.email,
			mobile: current.mobile,
		},
	});

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file type
			const validTypes = [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/gif",
				"image/webp",
			];
			if (!validTypes.includes(file.type)) {
				setSubmitMessage(
					"Please select a valid image file (JPEG, PNG, GIF, WEBP)"
				);
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setSubmitMessage("File size must be less than 5MB");
				return;
			}

			// Create preview URL
			const avatarPreview = await toBase64(file);
			setPreviewAvatar(avatarPreview);

			// Set the file in form data
			setValue("avatar", file);
			setSubmitMessage("");
		}
	};

	const onSubmit = async (data) => {
		try {
			// Create FormData for file upload
			const formData = new FormData();
			formData.append("name", data.name);
			formData.append("email", data.email);
			formData.append("mobile", data.mobile);

			if (data.avatar && data.avatar instanceof File) {
				formData.append("avatar", data.avatar);
			}

			console.log("Updated user data:", data);
			console.log("FormData entries:");
			for (let [key, value] of formData.entries()) {
				console.log(key, value);
			}

			setIsSubmitting(true);
			setSubmitMessage("");
			const response = await apiUpdateCurrentUser(formData);
			if (response.success) {
				dispatch(getCurrent()); // Refresh current user data
				setSubmitMessage("Information has been updated successfully!");
				reset({
					name: response.updatedUser.name,
					email: response.updatedUser.email,
					mobile: response.updatedUser.mobile,
					avatar: response.updatedUser.avatar, 
				}); 
				setPreviewAvatar(response.updatedUser.avatar);
			} else {
				setSubmitMessage(
					response.message || "Failed to update information!"
				);
			}
			setIsSubmitting(false);
		} catch (error) {
			console.log("Error updating user information:", error);
			setSubmitMessage("An error occurred while updating information!");
			setIsSubmitting(false);
		}
	};

	const handleReset = () => {
		reset();
		setPreviewAvatar("");
		setSubmitMessage("");
		// Reset file input
		const fileInput = document.getElementById("avatar-input");
		if (fileInput) {
			fileInput.value = "";
		}
	};

	return (
		<div className="min-h-screen p-6 bg-white shadow-lg">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">
					Personal Information
				</h2>
				<p className="text-gray-600">Update your account information</p>
			</div>

			<div className="space-y-6">
				{/* Avatar Section */}
				<div className="flex items-center space-x-6 mb-6">
					<div className="relative">
						<img
							src={
								previewAvatar || current.avatar || avatarDefault
							}
							alt="Avatar"
							className="w-30 h-30 rounded-full object-cover border-3 border-gray-200"
							onError={(e) => {
								e.target.src = avatarDefault;
							}}
						/>
						{previewAvatar && (
							<div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
								✓
							</div>
						)}
					</div>
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Avatar Image
						</label>
						<div className="flex items-center space-x-4">
							<input
								id="avatar-input"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
							<label
								htmlFor="avatar-input"
								className="cursor-pointer bg-blue-50 border-2 border-blue-200 border-dashed rounded-md px-4 py-2 text-blue-600 hover:bg-blue-100 transition-colors">
								Choose Image
							</label>
							<span className="text-sm text-gray-500">
								JPG, JPEG, PNG (less than 5MB)
							</span>
						</div>
						{errors.avatar && (
							<p className="mt-1 text-sm text-red-600">
								{errors.avatar.message}
							</p>
						)}
					</div>
				</div>

				{/* Name Field */}
				<div className="text-gray-700">
					<label className="block text-sm font-medium mb-2">
						Full Name *
					</label>
					<input
						type="text"
						{...register("name", {
							required: "Full name is required",
							minLength: {
								value: 2,
								message: "Name must be at least 2 characters",
							},
							maxLength: {
								value: 50,
								message: "Name must not exceed 50 characters",
							},
						})}
						className="w-full px-4 py-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
						placeholder="Enter full name"
					/>
					{errors.name && (
						<p className="mt-1 text-sm text-red-600">
							{errors.name.message}
						</p>
					)}
				</div>

				{/* Email Field */}
				<div className="text-gray-700">
					<label className="block text-sm font-medium mb-2">
						Email *
					</label>
					<input
						type="email"
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Invalid email address",
							},
						})}
						className="w-full px-4 py-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
						placeholder="example@email.com"
					/>
					{errors.email && (
						<p className="mt-1 text-sm text-red-600">
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Mobile Field */}
				<div className="text-gray-700">
					<label className="block text-sm font-medium mb-2">
						Phone Number *
					</label>
					<input
						type="tel"
						{...register("mobile", {
							required: "Phone number is required",
							pattern: {
								value: /^[0-9]{10,11}$/,
								message: "Phone number must be 10-11 digits",
							},
							validate: (value) => {
								return (
									value.startsWith("0") ||
									"Phone number must start with 0"
								);
							},
						})}
						className="w-full px-4 py-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
						placeholder="0123456789"
					/>
					{errors.mobile && (
						<p className="mt-1 text-sm text-red-600">
							{errors.mobile.message}
						</p>
					)}
				</div>

				{/* Submit Message */}
				{submitMessage && (
					<div
						className={`p-4 rounded-md ${
							submitMessage.includes("successfully")
								? "bg-green-50 text-green-800 border border-green-200"
								: "bg-red-50 text-red-800 border border-red-200"
						}`}>
						{submitMessage}
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex space-x-4 pt-4">
					<button
						type="button"
						onClick={handleSubmit(onSubmit)}
						disabled={isSubmitting || !isDirty}
						className="flex-1 bg-blue-600 text-white py-2 px-4 cursor-pointer rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
						{isSubmitting ? (
							<span className="flex items-center justify-center">
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
							"Update Information"
						)}
					</button>

					<button
						type="button"
						onClick={handleReset}
						disabled={isSubmitting}
						className="flex-1 bg-gray-500 text-white py-2 px-4 cursor-pointer rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
						Reset
					</button>
				</div>
				<div className="text-sm text-gray-500 flex items-center">
					{isDirty ? (
						<span className="text-orange-600">
							● Changes not saved
						</span>
					) : (
						<span className="text-green-600">● Saved</span>
					)}
				</div>
			</div>

			{/* User Info Display */}
			<div className="mt-8 p-4 bg-gray-50 rounded-md">
				<h3 className="text-lg font-medium text-gray-800 mb-3">
					Current Information:
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
					<div>
						<span className="font-medium text-gray-600">ID:</span>
						<span className="ml-2 text-gray-800">
							{current._id}
						</span>
					</div>
					<div>
						<span className="font-medium text-gray-600">
							Created:
						</span>
						<span className="ml-2 text-gray-800">
							{moment(current.createdAt).format(
								"DD-MM-YYYY HH:mm:ss"
							)}
						</span>
					</div>
					<div>
						<span className="font-medium text-gray-600">
							Last Updated:
						</span>
						<span className="ml-2 text-gray-800">
							{moment(current.updatedAt).format(
								"DD-MM-YYYY HH:mm:ss"
							)}
						</span>
					</div>
					<div>
						<span className="font-medium text-gray-600">Role:</span>
						<span className="ml-2 text-gray-800">User</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Personal;
