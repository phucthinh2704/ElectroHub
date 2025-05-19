import { useState } from "react";
import { Mail, ArrowRight, Lock, Check } from "lucide-react";
import { Link } from "react-router-dom";
import path from "../../utils/path";
import { apiForgotPassword } from "../../apis/user";
import Swal from "sweetalert2";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmitEmail = (e) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(async () => {
			const response = await apiForgotPassword({ email });
			if (!response.success) {
				Swal.fire("Error", response.message, "error");
				setIsLoading(false);
				return;
			}
			Swal.fire("Success", response.message, "success");
			setIsLoading(false);
		}, 200);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
				{/* Header */}
				<div className="bg-indigo-600 px-6 py-8 text-center">
					<Lock className="mx-auto h-12 w-12 text-white" />
					<h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
						Forgot Password
					</h2>
					<p className="mt-2 text-sm text-indigo-100">
						Enter your email to receive a reset link
					</p>
				</div>

				<div className="px-6 py-8">
					<form
						onSubmit={handleSubmitEmail}
						className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<div className="relative mt-1 rounded-md shadow-sm">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 py-3 text-gray-900 placeholder-gray-400 shadow-sm"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={isLoading}
								className={`flex w-full justify-center items-center rounded-md border border-transparent py-3 px-4 text-sm font-medium text-white shadow-sm cursor-pointer ${
									isLoading
										? "bg-indigo-400"
										: "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								}`}>
								{isLoading ? (
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
								) : null}
								{isLoading ? "Sending..." : "Send Reset Link"}
								{!isLoading && (
									<ArrowRight className="ml-2 h-4 w-4" />
								)}
							</button>
						</div>
					</form>

					<div className="mt-10">
						<p className="text-center text-sm text-gray-500">
							Didn't receive the email?{" "}
							<a
								href="#"
								onClick={handleSubmitEmail}
								className="font-medium text-indigo-600 hover:text-indigo-500">
								Resend
							</a>
						</p>
					</div>

					<div className="mt-2">
						<p className="text-center text-sm text-gray-500">
							Remember your password?{" "}
							<Link
								to={`/${path.LOGIN}`}
								className="font-medium text-indigo-600 hover:text-indigo-500">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
