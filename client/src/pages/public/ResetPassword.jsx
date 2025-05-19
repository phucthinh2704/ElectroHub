import { ArrowRight, Check, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { apiResetPassword } from "../../apis/user";
import path from "../../utils/path";

export default function ResetPassword() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [step, setStep] = useState(2);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({
		password: "",
		confirmPassword: "",
	});

	const navigate = useNavigate();
	const { token } = useParams();

	const validateResetPassword = () => {
		const newErrors = {};

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}
		if (!confirmPassword) {
			newErrors.confirmPassword = "Confirm Password is required";
		} else if (confirmPassword !== password) {
			newErrors.confirmPassword = "Passwords do not match";
		}
		return newErrors;
	};

	const handleResetPassword = (e) => {
		e.preventDefault();
		setIsLoading(true);
		const newErrors = validateResetPassword();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setIsLoading(false);
			return;
		}
		// Simulate API call
		setTimeout(async () => {
			const response = await apiResetPassword({ password, token });
			if (!response.success) {
				Swal.fire("Error", response.message, "error");
				setIsLoading(false);
				return;
			}
			Swal.fire("Success", response.message, "success");
			setIsLoading(false);
			setStep(3);
		}, 300);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
				{/* Header */}
				<div className="bg-indigo-600 px-6 py-8 text-center">
					<Lock className="mx-auto h-12 w-12 text-white" />
					<h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
						{step === 2 && "Reset Password"}
						{step === 3 && "Password Reset"}
					</h2>
					<p className="mt-2 text-sm text-indigo-100">
						{step === 2 && "Enter the new password"}
						{step === 3 &&
							"Your password has been successfully reset"}
					</p>
				</div>

				{/* Step 2: Reset Password Form */}
				{step === 2 && (
					<div className="px-6 py-8">
						<form
							onSubmit={handleResetPassword}
							className="space-y-6">
							<div className="relative">
								<label
									htmlFor="newPassword"
									className="block text-sm font-medium text-gray-700">
									New Password
								</label>
								<input
									id="newPassword"
									name="newPassword"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
									className={`w-full rounded-lg border ${
										errors.password
											? "border-red-500"
											: "border-gray-400"
									} px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
									placeholder="Type your password"
								/>
								<button
									type="button"
									className="cursor-pointer absolute right-3 top-11 transform -translate-y-1/2"
									onClick={togglePasswordVisibility}>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
								{errors.password && (
									<p className="mt-1 text-xs text-red-500">
										{errors.password}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-medium text-gray-700">
									Confirm Password
								</label>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									required
									className={`w-full rounded-lg border ${
										errors.confirmPassword
											? "border-red-500"
											: "border-gray-400"
									} px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20`}
									placeholder="Re-enter your password"
								/>
								{errors.confirmPassword && (
									<p className="mt-1 text-xs text-red-500">
										{errors.confirmPassword}
									</p>
								)}
							</div>

							<div>
								<button
									type="submit"
									disabled={isLoading}
									className={`flex w-full justify-center items-center rounded-md cursor-pointer border border-transparent py-3 px-4 text-sm font-medium text-white shadow-sm ${
										isLoading
											? "bg-indigo-400"
											: "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									}`}>
									{isLoading ? (
										<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									) : null}
									{isLoading
										? "Resetting..."
										: "Reset Password"}
									{!isLoading && (
										<ArrowRight className="ml-2 h-4 w-4" />
									)}
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Step 3: Success */}
				{step === 3 && (
					<div className="px-6 py-8 text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<Check className="h-6 w-6 text-green-600" />
						</div>
						<h3 className="mt-4 text-lg font-medium text-gray-900">
							Password Reset Successfully
						</h3>
						<p className="mt-2 text-sm text-gray-500">
							Your password has been reset successfully. You can
							now use your new password to log in.
						</p>
						<div className="mt-6">
							<button
								onClick={() => {
									navigate(`/${path.LOGIN}`);
								}}
								className="inline-flex items-center rounded-md cursor-pointer border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
								Return to Login
								<ArrowRight className="ml-2 h-4 w-4" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
