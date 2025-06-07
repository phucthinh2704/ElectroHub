import { X } from "lucide-react";
import moment from "moment";
import React, { memo, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { apiUpdateUserByAdmin } from "../../../apis/user";

const EditUserForm = ({ users, setUsers, selectedUserId, onClose }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");

	// Tìm user được chọn để edit
	const selectedUser = users.find((user) => user._id === selectedUserId);

	// Dữ liệu ban đầu từ user được chọn
	const initialData = useMemo(
		() => ({
			name: selectedUser.name || "",
			email: selectedUser.email || "",
			mobile: selectedUser.mobile || "",
			role: selectedUser.role || "user",
			isBlocked: selectedUser.isBlocked || false,
		}),
		[selectedUser]
	);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors, isDirty },
		// errors: Object với key là tên field, value là error object
		// isDirty: Kiểm tra form có thay đổi so với giá trị ban đầu không, true nếu có thay đổi, false nếu không có thay đổi
		// Hiển thị nút save chỉ khi form thay đổi: {isDirty && <button type="submit">Save Changes</button>}
	} = useForm({
		defaultValues: initialData,
		mode: "onChange",
	});

	// Công dụng: Theo dõi và lấy giá trị real-time của fields
	const watchedValues = watch(); // Watch() tất cả fields, sẽ trả về một object chứa tất cả các giá trị của fields trong form
	// Watch một field cụ thể: const emailValue = watch("email");
	// Watch nhiều fields: const [email, password] = watch(["email", "password"]);
	// console.log("Watched Values:", watchedValues);

	const onSubmit = (data) => {
		setIsSubmitting(true);
		setSubmitMessage("");

		try {
			setTimeout(async () => {
				const response = await apiUpdateUserByAdmin(selectedUserId, data);
				if (response.success) {
					// Cập nhật user trong danh sách
					const updatedUsers = users.map((user) =>
						user._id === selectedUserId
							? {
									...user,
									...data,
									updatedAt: new Date().toISOString(),
							  }
							: user
					);
					setUsers(updatedUsers);
					setSubmitMessage("User information updated successfully!");
				} else {
					setSubmitMessage("Failed to update user information!");
				}
				setIsSubmitting(false);
			}, 500);

			// Reset dirty state sau khi submit thành công
			reset(data);
		} catch (error) {
			console.log("An error occurred while updating the user:", error);
			setSubmitMessage("An error occurred while updating the user!");
			setIsSubmitting(false);
		}
	};

	// Hàm reset form về dữ liệu ban đầu
	// Reset với giá trị mới: reset({ name: "New Name", email: "new@email.com" });
	// Reset chỉ một field: reset({ name: "New Name" }, { keepValues: true });
	const handleReset = () => {
		reset(initialData);
		setSubmitMessage("");
	};

	// Thay đổi trạng thái block/unblock, watchedValues.isBlocked trả về giá trị hiện tại của trường isBlocked
	// setValue để cập nhật giá trị của trường isBlocked trong form
	const handleBlockToggle = () => {
		const currentBlocked = watchedValues.isBlocked; // dùng watchedValues để lấy giá trị hiện tại nếu có thay đổi liên tục
		setValue("isBlocked", !currentBlocked, { shouldDirty: true });
	};
	// Set với validation: setValue("email", "new@email.com", { shouldValidate: true });
	// Set với trigger re-render: setValue("email", "new@email.com", { shouldDirty: true });

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
					Edit User Information
				</h1>
				<p className="text-gray-600">
					Update detailed information for user:{" "}
					<span className="font-semibold">{selectedUser.name}</span>
				</p>
			</div>

			<div className="space-y-4">
				{/* Basic Information */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">
						Basic Information
					</h2>

					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name *
								</label>
								<input
									{...register("name", {
										required: "Please enter full name",
										minLength: {
											value: 2,
											message:
												"Full name must be at least 2 characters",
										},
									})}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										errors.name
											? "border-red-600"
											: "border-gray-300"
									}`}
									placeholder="Enter full name"
								/>
								{errors.name && (
									<p className="text-red-500 text-sm mt-1">
										{errors.name.message}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email *
								</label>
								<input
									type="email"
									{...register("email", {
										required: "Please enter email",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "Invalid email format",
										},
									})}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										errors.email
											? "border-red-600"
											: "border-gray-300"
									}`}
									placeholder="Enter email address"
								/>
								{errors.email && (
									<p className="text-red-500 text-sm mt-1">
										{errors.email.message}
									</p>
								)}
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Phone Number
								</label>
								<input
									{...register("mobile", {
										required: "Please enter phone number",
										pattern: {
											value: /^[0-9]{10,11}$/,
											message:
												"Phone number must be 10-11 digits",
										},
									})}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										errors.mobile
											? "border-red-600"
											: "border-gray-300"
									}`}
									placeholder="Enter phone number"
								/>
								{errors.mobile && (
									<p className="text-red-500 text-sm mt-1">
										{errors.mobile.message}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Role *
								</label>
								<select
									{...register("role", {
										required: "Please select a role",
									})}
									className={`w-full px-3 py-2 border rounded-md uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										errors.role
											? "border-red-600"
											: "border-gray-300"
									}`}>
									<option value="user">User</option>
									<option value="moderator">Moderator</option>
									<option value="admin">Admin</option>
								</select>
								{errors.role && (
									<p className="text-red-500 text-sm mt-1">
										{errors.role.message}
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Account Status
						</label>
						<div className="flex items-center space-x-3 mt-2">
							<button
								type="button"
								onClick={handleBlockToggle}
								className={`px-4 py-2 rounded-md font-medium transition-colors ${
									watchedValues.isBlocked
										? "bg-red-100 text-red-700 border border-red-300"
										: "bg-green-100 text-green-700 border border-green-300"
								}`}>
								{watchedValues.isBlocked ? "Blocked" : "Active"}
							</button>
							<input
								type="hidden"
								{...register("isBlocked")}
							/>
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
							<p className="text-gray-600">ID:</p>
							<p className="font-mono text-gray-800">
								{selectedUser._id}
							</p>
						</div>
						<div>
							<p className="text-gray-600">Created Date:</p>
							<p className="text-gray-800">
								{moment(selectedUser.createdAt).format(
									"DD/MM/YYYY, h:mm:ss A"
								)}
							</p>
						</div>
						{selectedUser.updatedAt && (
							<div>
								<p className="text-gray-600">Last Updated:</p>
								<p className="text-gray-800">
									{moment(selectedUser.updatedAt).format(
										"DD/MM/YYYY, h:mm:ss A"
									)}
								</p>
							</div>
						)}
						<div>
							<p className="text-gray-600">Current Status:</p>
							<p
								className={`font-medium ${
									selectedUser.isBlocked
										? "text-red-600"
										: "text-green-600"
								}`}>
								{selectedUser.isBlocked
									? "🚫 Blocked"
									: "✅ Active"}
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
						disabled={isSubmitting || !isDirty}
						className={`px-6 py-2 rounded-md font-medium transition-colors ${
							isSubmitting || !isDirty
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
							"Update"
						)}
					</button>

					<button
						type="button"
						onClick={handleReset}
						disabled={isSubmitting}
						className="px-6 py-2 bg-gray-500 text-white cursor-pointer rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
						Restored
					</button>

					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="px-6 py-2 bg-red-500 text-white cursor-pointer rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
						Close
					</button>

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
			</div>
		</div>
	);
};

export default memo(EditUserForm);
