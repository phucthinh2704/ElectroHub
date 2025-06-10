import {
	CheckCircle,
	CreditCard,
	MapPin,
	ShoppingBag,
	Truck,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import formatMoney from "../../utils/formatMoney";
import { Paypal } from "../../components";

const Checkout = () => {
	const { current } = useSelector((state) => state.user);

	const [cartItems, setCartItems] = useState([...(current?.cart || [])]);

	const [activeStep, setActiveStep] = useState(1);
	const [paymentMethod, setPaymentMethod] = useState("card");

	const steps = [
		{ id: 1, title: "Shipping", icon: MapPin },
		{ id: 2, title: "Payment", icon: CreditCard },
		{ id: 3, title: "Review", icon: CheckCircle },
	];

	const total = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const shipping =
		total > 2000000 ? 0 : +import.meta.env.VITE_SHIPPING_COST || 50000;
	const finalTotal = total + shipping;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Checkout
					</h1>
					<p className="text-gray-600">
						Complete your purchase securely
					</p>
				</div>

				{/* Progress Steps */}
				<div className="flex justify-center mb-8">
					<div className="flex items-center space-x-8">
						{steps.map((step, index) => {
							const Icon = step.icon;
							const isActive = step.id === activeStep;
							const isCompleted = step.id < activeStep;

							return (
								<div
									key={step.id}
									className="flex items-center">
									<div
										className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
											isActive
												? "bg-blue-600 border-blue-600 text-white"
												: isCompleted
												? "bg-green-500 border-green-500 text-white"
												: "bg-white border-gray-300 text-gray-400"
										}`}>
										<Icon size={20} />
									</div>
									<span
										className={`ml-3 font-medium ${
											isActive
												? "text-blue-600"
												: isCompleted
												? "text-green-600"
												: "text-gray-400"
										}`}>
										{step.title}
									</span>
									{index < steps.length - 1 && (
										<div
											className={`w-16 h-0.5 ml-4 ${
												isCompleted
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>

				<div className="grid lg:grid-cols-2 gap-8">
					{/* Main Content */}
					<div className="space-y-4">
						{/* Shipping Information */}
						{activeStep >= 1 && (
							<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
								<div className="flex items-center mb-4">
									<MapPin
										className="text-blue-600 mr-3"
										size={24}
									/>
									<h3 className="text-xl font-semibold text-gray-900">
										Shipping Address
									</h3>
								</div>
								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Full Name
										</label>
										<input
											type="text"
											className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
											defaultValue={current?.name || ""}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Email
										</label>
										<input
											type="email"
											className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
											defaultValue={current?.email || ""}
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Address
										</label>
										<input
											type="text"
											className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
											defaultValue={
												current?.address || ""
											}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											City
										</label>
										<input
											type="text"
											className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
											placeholder="New York"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											ZIP Code
										</label>
										<input
											type="text"
											className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
											placeholder="10001"
										/>
									</div>
								</div>
							</div>
						)}

						{/* {activeStep >= 2 && (
							<Paypal amount={finalTotal}></Paypal>
						)} */}
						<div>
							<Paypal
								amount={Math.round(
									finalTotal / 25000
								)}></Paypal>
						</div>

						{/* Shipping Options */}
						<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
							<div className="flex items-center mb-4">
								<Truck
									className="text-blue-600 mr-3"
									size={24}
								/>
								<h3 className="text-xl font-semibold text-gray-900">
									Shipping Options
								</h3>
							</div>
							<div className="space-y-3">
								<label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
									<input
										type="radio"
										name="shipping"
										className="text-blue-600"
										defaultChecked
									/>
									<div className="ml-3 flex-1">
										<div className="font-medium">
											Standard Shipping
										</div>
										<div className="text-sm text-gray-500">
											5-7 business days
										</div>
									</div>
									<span className="font-semibold">
										{shipping === 0
											? "Free"
											: `${formatMoney(shipping)}đ`}
										<br />
										{shipping === 0 && (
											<span className="line-through text-xs text-slate-400">
												{formatMoney(
													import.meta.env
														.VITE_SHIPPING_COST
												)}
												đ
											</span>
										)}
									</span>
								</label>
								<label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
									<input
										type="radio"
										name="shipping"
										className="text-blue-600"
									/>
									<div className="ml-3 flex-1">
										<div className="font-medium">
											Express Shipping
										</div>
										<div className="text-sm text-gray-500">
											2-3 business days
										</div>
									</div>
									<span className="font-semibold">
										{shipping === 0
											? "Free"
											: `${formatMoney(shipping)}đ`}
										<br />
										{shipping === 0 && (
											<span className="line-through text-xs text-slate-400">
												{formatMoney(
													import.meta.env
														.VITE_SHIPPING_COST
												)}
												đ
											</span>
										)}
									</span>
								</label>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-4">
							{activeStep > 1 && (
								<button
									onClick={() =>
										setActiveStep(activeStep - 1)
									}
									className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
									Back
								</button>
							)}
							<button
								onClick={() =>
									activeStep < 3
										? setActiveStep(activeStep + 1)
										: null
								}
								className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg cursor-pointer">
								{activeStep < 3 ? "Continue" : "Place Order"}
							</button>
						</div>
					</div>

					{/* Order Summary */}
					<div className="lg:sticky lg:top-8 h-fit">
						<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
							{/* Header with gradient */}
							<div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<div className="p-2 bg-white/20 rounded-lg mr-3">
											<ShoppingBag size={24} />
										</div>
										<div>
											<h3 className="text-xl font-semibold">
												Order Summary
											</h3>
											<p className="text-blue-100 text-sm">
												{cartItems.length} items in cart
											</p>
										</div>
									</div>
									<div className="text-right">
										<div className="text-2xl font-bold">
											{formatMoney(finalTotal.toFixed(2))}
											đ
										</div>
										<div className="text-blue-100 text-sm">
											Total
										</div>
									</div>
								</div>
							</div>

							<div className="p-6">
								{/* Cart Items */}
								<div className="space-y-4 mb-6">
									{cartItems.map((item) => (
										<div
											key={item._id}
											className="group relative">
											<div className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
												{/* Product Image with Badge */}
												<div className="relative">
													<img
														src={item.thumb}
														alt={item.product.title}
														className="w-20 h-20 object-cover rounded-xl shadow-md"
													/>
													<div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
														{item.quantity}
													</div>
												</div>

												{/* Product Details */}
												<div className="flex-1 min-w-0">
													<h4 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
														{item.product.title}{" "}
														{`(${item.color})`}
													</h4>
													<div className="flex items-center gap-2 mb-2">
														<span
															className={`py-1 text-xs font-semibold`}>
															Color: {item.color}
														</span>
													</div>
													<div className="flex items-center justify-between">
														<div className="text-sm text-gray-600">
															<span className="font-medium">
																{formatMoney(
																	item.price
																)}
																đ
															</span>{" "}
															× {item.quantity}
														</div>
														<div className="text-right">
															<div className="font-bold text-gray-900">
																{formatMoney(
																	(
																		item.price *
																		item.quantity
																	).toFixed(2)
																)}
																đ
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Price Breakdown */}
								<div className="space-y-4 py-6 border-t border-gray-200">
									{/* Subtotal */}
									<div className="flex justify-between items-center text-gray-600">
										<div className="flex items-center">
											<span className="mr-2">💰</span>
											<span>
												Subtotal ({cartItems.length}{" "}
												items)
											</span>
										</div>
										<span className="font-semibold">
											{formatMoney(total.toFixed(2))}đ
										</span>
									</div>

									{/* Shipping */}
									<div className="flex justify-between items-start text-gray-600">
										<div className="flex items-center">
											<span className="mr-2">🚚</span>
											<span>Shipping</span>
										</div>
										<div className="text-right">
											<span className="font-semibold flex flex-col">
												{formatMoney(
													shipping.toFixed(2)
												)}
												đ
												{shipping === 0 && (
													<span className="ml-1 line-through text-xs text-slate-400">
														{formatMoney(
															import.meta.env
																.VITE_SHIPPING_COST ||
																50000
														)}
														đ
													</span>
												)}
											</span>
										</div>
									</div>

									{/* Total */}
									<div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-4 border-t-2 border-blue-100 bg-gradient-to-r from-indigo-50 to-indigo-100 -mx-7 px-6 py-4 rounded-lg">
										<span className="flex items-center">
											<span className="mr-2">💎</span>
											Total
										</span>
										<div className="text-right">
											<div className="text-2xl text-main">
												{formatMoney(
													finalTotal.toFixed(2)
												)}
												đ
											</div>
										</div>
									</div>
								</div>

								{/* Benefits & Features */}
								<div className="space-y-3 mb-6">
									<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
										<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
											<CheckCircle
												className="text-white"
												size={16}
											/>
										</div>
										<div>
											<div className="font-medium text-green-800">
												Free Returns
											</div>
											<div className="text-sm text-green-600">
												30-day return policy
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
										<div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
											<Truck
												className="text-white"
												size={16}
											/>
										</div>
										<div>
											<div className="font-medium text-purple-800">
												Fast Delivery
											</div>
											<div className="text-sm text-purple-600">
												2-3 business days
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
