import { Heart, Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import formatMoney from "../../utils/formatMoney";
import path from "../../utils/path";
import Swal from "sweetalert2";

const MyCart = () => {
	const { current } = useSelector((state) => state.user);

	const [cartItems, setCartItems] = useState([...(current?.cart || [])]);
	const [promoCode, setPromoCode] = useState("");
	const [appliedPromo, setAppliedPromo] = useState(null);

	console.log("Cart Items:", cartItems);

	const updateQuantity = (id, change) => {
		const itemQuantity = cartItems.find(
			(item) => item._id === id
		)?.quantity;

		if (change < 0 && itemQuantity <= 1) {
			Swal.fire({
				title: "Warning",
				text: "Are you sure you want to remove this item?",
				icon: "warning",
				confirmButtonText: "YES",
				showCancelButton: true,
				cancelButtonText: "NO",
				confirmButtonColor: "#d33",
				cancelButtonColor: "#3085d6",
			}).then((result) => {
				if (result.isConfirmed) {
					removeItem(id);
				}
			});
			return;
		} else if (change > 0 && itemQuantity > 0) {
			const inStock = cartItems.find((item) => item._id === id)?.product
				?.stock;
			if (itemQuantity + change > inStock) {
				Swal.fire({
					title: "Warning",
					text: `Only ${inStock} items left in stock!`,
					icon: "warning",
					confirmButtonText: "OK",
					confirmButtonColor: "#3085d6",
				});
				return;
			}
		}
		setCartItems((items) =>
			items
				.map((item) =>
					item._id === id
						? {
								...item,
								quantity: Math.max(0, item.quantity + change),
						  }
						: item
				)
				.filter((item) => item.quantity > 0)
		);
	};

	const removeItem = (id) => {
		setCartItems((items) => items.filter((item) => item._id !== id));
	};

	const applyPromoCode = () => {
		if (promoCode.toUpperCase() === "SAVE10") {
			setAppliedPromo({
				code: "SAVE10",
				discount: 0.1,
				label: "10% Off",
			});
		} else if (promoCode.toUpperCase() === "WELCOME20") {
			setAppliedPromo({
				code: "WELCOME20",
				discount: 0.2,
				label: "20% Off",
			});
		}
		setPromoCode("");
	};

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.product.price * item.quantity,
		0
	);
	const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
	const shipping = subtotal > 2000000 ? 0 : 50000;
	const total = subtotal - discount + shipping;

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen p-4 bg-white shadow-lg">
				<div className="bg-white rounded-2xl shadow-lg p-12 text-center">
					<ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
					<h2 className="text-3xl font-bold text-gray-800 mb-4">
						Your Cart is Empty
					</h2>
					<p className="text-gray-600 mb-8">
						Looks like you haven't added anything to your cart yet.
					</p>
					<Link
						to={`/${path.HOME}`}
						className="inline-block">
						<button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 cursor-pointer">
							Start Shopping
						</button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-4 bg-white shadow-lg">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-gray-800 mb-2">
					Shopping Cart
				</h1>
				<p className="text-gray-600">
					{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}{" "}
					in your cart
				</p>
			</div>

			<div className="grid lg:grid-cols-3 gap-8">
				{/* Cart Items */}
				<div className="lg:col-span-2 space-y-6">
					{cartItems.map((item) => (
						<div
							key={item._id}
							className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="border border-gray-400 rounded-xl overflow-hidden p-2">
									<img
										src={item.product.thumb}
										alt={item.product.title}
										className="sm:w-32 h-34 object-cover"
									/>
								</div>

								<div className="flex-1">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
										<div>
											<Link
												to={`/products/${item.product.category.toLowerCase()}/${
													item.product._id
												}/${item.product.slug}`}>
												<h3 className="text-xl font-semibold cursor-pointer text-gray-800 mb-1 hover:text-blue-600 hover:underline">
													{item.product.title}
												</h3>
											</Link>
											<Link
												to={`/products/${item.product.category.toLowerCase()}`}>
												<h3 className="text-sm font-medium text-gray-600 mb-1">
													Category:{" "}
													{item.product.category}
												</h3>
											</Link>
											<div className="text-sm text-gray-600 mb-3">
												Color: {item.product.color}
											</div>
											<div className="text-sm text-gray-600 line-through">
												Original Price:{" "}
												{formatMoney(
													item.product.originalPrice
												)}
												đ
											</div>
											<p className="text-lg font-semibold text-main">
												Price:{" "}
												{formatMoney(
													item.product.price
												)}
												đ
											</p>
											<p className="text-sm text-main">
												Save:{" "}
												{formatMoney(
													item.product.originalPrice -
														item.product.price
												)}
												đ
											</p>
										</div>

										<div className="flex items-center gap-2 text-slate-800">
											<button
												onClick={() =>
													updateQuantity(item._id, -1)
												}
												className="bg-gray-100 cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-colors duration-200">
												<Minus className="w-4 h-4" />
											</button>
											<span className="text-lg font-semibold w-8 text-center">
												{item.quantity}
											</span>
											<button
												onClick={() =>
													updateQuantity(item._id, 1)
												}
												className="bg-gray-100 cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-colors duration-200">
												<Plus className="w-4 h-4" />
											</button>
											<button
												onClick={() =>
													removeItem(item._id)
												}
												className="ml-4 cursor-pointer text-red-500 hover:text-red-700 p-2 transition-colors duration-200">
												<Trash2 className="w-5 h-5" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Order Summary */}
				<div className="space-y-6 text-slate-800">
					{/* Promo Code */}
					<div className="bg-white rounded-2xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
							<Tag className="w-5 h-5" />
							Promo Code
						</h3>
						<div className="flex gap-3">
							<input
								type="text"
								value={promoCode}
								onChange={(e) => setPromoCode(e.target.value)}
								placeholder="Enter code"
								className="flex-1 px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<button
								onClick={applyPromoCode}
								className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 cursor-pointer">
								Apply
							</button>
						</div>
						{appliedPromo && (
							<div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
								<p className="text-green-700 font-medium">
									✓ {appliedPromo.label} applied!
								</p>
							</div>
						)}
					</div>

					{/* Order Summary */}
					<div className="bg-white rounded-2xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-6">
							Order Summary
						</h3>

						<div className="space-y-4">
							<div className="flex justify-between text-gray-600">
								<span>Subtotal</span>
								<span>{formatMoney(subtotal)}đ</span>
							</div>

							{appliedPromo && (
								<div className="flex justify-between text-green-600">
									<span>Discount ({appliedPromo.label})</span>
									<span>
										-{formatMoney(discount.toFixed(0))}đ
									</span>
								</div>
							)}

							<div className="flex justify-between text-gray-600">
								<span>Shipping</span>
								<span>
									{shipping === 0
										? "Free"
										: `${formatMoney(
												shipping.toFixed(0)
										  )}đ`}
								</span>
							</div>

							<div className="border-t pt-4">
								<div className="flex justify-between text-xl font-semibold text-gray-800">
									<span>Total</span>
									<span>
										{formatMoney(total.toFixed(2))}đ
									</span>
								</div>
							</div>
						</div>

						{subtotal < 2000000 && (
							<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
								<p className="text-blue-700 text-sm">
									Add{" "}
									{formatMoney(2000000 - subtotal).toFixed(0)}
									đ more for free shipping!
								</p>
							</div>
						)}

						<button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
							Proceed to Checkout
						</button>

						<Link to={`/${path.HOME}`}>
							<button className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 cursor-pointer">
								Continue Shopping
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(MyCart);
