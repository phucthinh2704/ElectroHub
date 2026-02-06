import { CheckCircle, MapPin, ShoppingBag, Truck } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getProvincesWithDetail } from "vietnam-provinces";
import { Paypal } from "../../components";
import { stepsPayment } from "../../utils/constants";
import formatMoney from "../../utils/formatMoney";

const Checkout = () => {
	const { current } = useSelector((state) => state.user);

	const [cartItems] = useState([...(current?.cart || [])]);

	const [activeStep, setActiveStep] = useState(1);
	// const [paymentMethod, setPaymentMethod] = useState("card");
	const [addressType, setAddressType] = useState("new"); // 'new' hoặc 'existing'

	const [provinces] = useState(Object.values(getProvincesWithDetail()) || []);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);

	const initialData = {
		name: current?.name || "",
		email: current?.email || "",
		mobile: current?.mobile || "",
		deliveryAddress: "",
		shipping: "standard",
		paymentMethod: "paypal",
	};

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: initialData,
		mode: "onChange",
	});

	const handleAddressTypeChange = (type) => {
		setAddressType(type);

		if (type === "existing") {
			clearErrors(["province", "district", "ward", "address"]);
		} else {
			clearErrors("existingAddress");
		}
	};

	const onSubmit = (data) => {
		if (activeStep === 1 && addressType === "existing") {
			setValue("deliveryAddress", watch("existingAddress"));
		}
		if (activeStep === 1 && addressType === "new") {
			const ward = wards.find((w) => w.code === data.ward)?.full_name;
			setValue("deliveryAddress", `${data.address}, ${ward}`);
		}
		if (activeStep < 3) setActiveStep(activeStep + 1);
	};

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
					<h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase">
						Checkout
					</h1>
					<p className="text-gray-600">
						Complete your purchase securely
					</p>
				</div>

				{/* Progress Steps */}
				<div className="flex justify-center mb-8">
					<div className="flex items-center space-x-8">
						{stepsPayment.map((step, index) => {
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
									{index < stepsPayment.length - 1 && (
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

				<div className="grid lg:grid-cols-2 gap-6">
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
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Full Name *
										</label>
										<input
											type="text"
											disabled={activeStep !== 1}
											className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
											placeholder="Enter your full name"
											{...register("name", {
												required: "Name is required",
												minLength: {
													value: 2,
													message:
														"Name must be at least 2 characters",
												},
											})}
										/>
										{errors.name && (
											<p className="text-red-500 text-sm mt-1">
												{errors.name.message}
											</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Phone *
										</label>
										<input
											type="tel"
											disabled={activeStep !== 1}
											className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
											placeholder="Enter your phone number"
											{...register("mobile", {
												required:
													"Phone number is required",
												pattern: {
													value: /^(0[3|5|7|8|9])+([0-9]{8})\b$/,
													message:
														"Invalid phone number",
												},
											})}
										/>
										{errors.mobile && (
											<p className="text-red-500 text-sm mt-1">
												{errors.mobile.message}
											</p>
										)}
									</div>
									{/* <div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email *
										</label>
										<input
											type="email"
											disabled="true"
											className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
											placeholder="Enter your email address"
											{...register("email", {
												required: "Email is required",
												pattern: {
													value: /^\S+@\S+$/i,
													message:
														"Invalid email address",
												},
											})}
										/>
										{errors.email && (
											<p className="text-red-500 text-sm mt-1">
												{errors.email.message}
											</p>
										)}
									</div> */}
									<div className="md:col-span-2 flex flex-col gap-4">
										{current?.address?.length > 0 && (
											<div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
												<h3 className="text-lg font-medium text-gray-900 mb-3">
													Delivery Address Options
												</h3>
												<div className="flex gap-4 mb-2">
													<label className="flex items-center cursor-pointer">
														<input
															type="radio"
															name="addressType"
															value="new"
															disabled={
																activeStep !== 1
															}
															checked={
																addressType ===
																"new"
															}
															onChange={() =>
																handleAddressTypeChange(
																	"new"
																)
															}
															className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
														/>
														<span className="ml-2 font-medium text-gray-700">
															Enter new address
														</span>
													</label>
													<label className="flex items-center cursor-pointer">
														<input
															type="radio"
															name="addressType"
															value="existing"
															disabled={
																activeStep !== 1
															}
															checked={
																addressType ===
																"existing"
															}
															onChange={() =>
																handleAddressTypeChange(
																	"existing"
																)
															}
															className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
														/>
														<span className="ml-2 font-medium text-gray-700">
															Use previous address
														</span>
													</label>
												</div>

												{/* Existing Address Selection */}
												{addressType === "existing" && (
													<div>
														<label className="block font-medium text-gray-700 mb-2">
															Select Previous
															Address
														</label>
														<select
															className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
															// defaultValue={
															// 	selectedExistingAddress
															// }
															disabled={
																activeStep !== 1
															}
															// onChange={(e) =>
															// 	// handleExistingAddressChange(
															// 	// 	e.target
															// 	// 		.value
															// 	// )
															// 	setSelectedExistingAddress(
															// 		e.target
															// 			.value
															// 	)
															// }
															{...register(
																"existingAddress",
																{
																	required:
																		addressType ===
																		"existing"
																			? "Please select an address"
																			: false,
																}
															)}>
															<option value="">
																Choose an
																address
															</option>
															{current.address.map(
																(
																	address,
																	index
																) => (
																	<option
																		key={
																			index
																		}
																		value={
																			address
																		}>
																		{
																			address
																		}
																	</option>
																)
															)}
														</select>
														{errors.existingAddress && (
															<p className="text-red-500 text-sm mt-1">
																{
																	errors
																		.existingAddress
																		.message
																}
															</p>
														)}
													</div>
												)}
											</div>
										)}
										{addressType === "new" && (
											<div className="md:col-span-2 flex flex-col gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														City
													</label>
													<select
														name="province"
														id="province"
														disabled={
															activeStep !== 1
														}
														className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
														{...register(
															"province",
															{
																required:
																	"Please select a city",
															}
														)}
														onChange={(e) => {
															if (
																!e.target.value
															) {
																setDistricts(
																	[]
																);
																setWards([]);
																clearErrors(
																	"district"
																);
																clearErrors(
																	"ward"
																);
																setError(
																	"province",
																	{
																		type: "manual",
																		message:
																			"Please select a city",
																	}
																);
																return;
															}

															const selectedProvince =
																provinces.find(
																	(
																		province
																	) =>
																		province.code ===
																		e.target
																			.value
																);
															clearErrors(
																"province"
															);
															setDistricts(
																Object.values(
																	selectedProvince?.districts
																) || []
															);
															setWards([]);
														}}>
														<option value="">
															Select City
														</option>
														{provinces.map(
															(province) => (
																<option
																	key={
																		province.code
																	}
																	value={
																		province.code
																	}>
																	{
																		province.name
																	}
																</option>
															)
														)}
													</select>
													{errors.province && (
														<p className="text-red-500 text-sm mt-1">
															{
																errors.province
																	.message
															}
														</p>
													)}
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														District
													</label>
													<select
														name="district"
														id="district"
														disabled={
															districts.length ===
																0 ||
															activeStep !== 1
														}
														{...register(
															"district",
															{
																required:
																	"Please select a district",
																validate: (
																	value
																) =>
																	value !==
																		"" ||
																	"Please select a district",
															}
														)}
														className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
														onChange={(e) => {
															if (
																!e.target.value
															) {
																clearErrors(
																	"ward"
																);
																setWards([]);
																setError(
																	"district",
																	{
																		type: "manual",
																		message:
																			"Please select a district",
																	}
																);
																return;
															}

															const selectedDistrict =
																districts.find(
																	(
																		district
																	) =>
																		district.code ===
																		e.target
																			.value
																);
															clearErrors(
																"district"
															);
															setWards(
																Object.values(
																	selectedDistrict?.wards
																) || []
															);
														}}>
														<option value="">
															Select District
														</option>
														{districts.map(
															(district) => (
																<option
																	key={
																		district.code
																	}
																	value={
																		district.code
																	}>
																	{
																		district.name
																	}
																</option>
															)
														)}
													</select>
													{errors.district && (
														<p className="text-red-500 text-sm mt-1">
															{
																errors.district
																	.message
															}
														</p>
													)}
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Ward
													</label>
													<select
														name="ward"
														id="ward"
														disabled={
															wards.length ===
																0 ||
															districts.length ===
																0 ||
															activeStep !== 1
														}
														{...register("ward", {
															required:
																"Please select a ward",
															validate: (value) =>
																value !== "" ||
																"Please select a ward",
														})}
														className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed">
														<option value="">
															Select Ward
														</option>
														{wards.map((ward) => (
															<option
																key={ward.code}
																value={
																	ward.code
																}>
																{ward.name}
															</option>
														))}
													</select>
													{errors.ward && (
														<p className="text-red-500 text-sm mt-1">
															{
																errors.ward
																	.message
															}
														</p>
													)}
												</div>
												<div className="md:col-span-2">
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Address
													</label>
													<input
														type="text"
														className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
														disabled={
															activeStep !== 1
														}
														placeholder="Street address, apartment, etc."
														{...register(
															"address",
															{
																required:
																	"Address is required",
																minLength: {
																	value: 5,
																	message:
																		"Address must be at least 5 characters",
																},
															}
														)}
													/>
													{errors.address && (
														<p className="text-red-500 text-sm mt-1">
															{
																errors.address
																	.message
															}
														</p>
													)}
												</div>
											</div>
										)}
									</div>
								</div>
								{/* {current?.address?.length > 0 && (
									<div className="mt-6 flex flex-col gap-2">
										<p className="text-medium text-lg hover:text-sky-800 text-sky-600 cursor-pointer">
											Use your previous delivery address
											below:
										</p>
										<select className="w-full p-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
											{current.address.map(
												(address, index) => (
													<option
														key={index}
														value={address}>
														{address}
													</option>
												)
											)}
										</select>
									</div>
								)} */}
							</div>
						)}
						<div
							className={`bg-white rounded-2xl p-6 pb-0 shadow-lg border border-gray-100 ${
								activeStep >= 2 ? "block" : "hidden"
							}`}>
							<Paypal
								amount={Math.round(finalTotal / 25000)}
								payload={{
									products: current.cart,
									total: finalTotal / 25000,
									orderBy: current._id,
									address: watch("deliveryAddress"),
									recipientInfo: {
										name: watch("name"),
										mobile: watch("mobile"),
									},
								}}></Paypal>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-4">
							{activeStep > 1 && (
								<button
									onClick={() =>
										setActiveStep(activeStep - 1)
									}
									className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg bg-gray-100 hover:bg-white transition-all font-medium cursor-pointer">
									Back
								</button>
							)}
							<button
								onClick={handleSubmit(onSubmit)}
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
														className="w-20 h-20 object-contain rounded-xl shadow-md"
														loading="lazy"
														decoding="async"
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
													: `${formatMoney(
															shipping
													  )}đ`}
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
													: `${formatMoney(
															shipping
													  )}đ`}
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
