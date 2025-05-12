import React, { memo, useEffect, useState, useCallback } from "react";
import icons from "../utils/icons";
import { apiGetProducts, apiGetProductById } from "../apis";
import renderRatingStar from "../utils/renderRatingStar";
import formatMoney from "../utils/formatMoney";
import CountDown from "./CountDown";

const { AiFillStar, IoMdMenu } = icons;

// Keys for localStorage
const STORAGE_KEYS = {
	EXPIRE_TIME: "dealDailyExpireTime",
	PRODUCT_ID: "dealDailyProductId",
};

// Timer mặc định là 1 giờ
const DEFAULT_TIMER_DURATION = 60 * 60 * 1000;

const DealDaily = () => {
	const [countdown, setCountdown] = useState({
		hour: 0,
		minute: 0,
		second: 0,
	});
	const [dealDaily, setDealDaily] = useState(null);

	// Khởi tạo thời gian hết hạn từ localStorage hoặc tạo mới nếu không có
	const [expireTime, setExpireTime] = useState(() => {
		const savedExpireTime = localStorage.getItem(STORAGE_KEYS.EXPIRE_TIME);

		if (savedExpireTime && Number(savedExpireTime) > Date.now()) {
			return Number(savedExpireTime);
		}

		const newExpireTime = Date.now() + DEFAULT_TIMER_DURATION;
		localStorage.setItem(STORAGE_KEYS.EXPIRE_TIME, newExpireTime);
		return newExpireTime;
	});

	// Lấy productId từ localStorage
	const [productId, setProductId] = useState(
		() => localStorage.getItem(STORAGE_KEYS.PRODUCT_ID) || null
	);

	// Lưu expireTime vào localStorage khi nó thay đổi
	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.EXPIRE_TIME, expireTime);
	}, [expireTime]);

	// Hàm lấy sản phẩm ngẫu nhiên
	const fetchRandomProduct = useCallback(async () => {
		try {
			const response = await apiGetProducts({
				limit: 1,
				page: Math.round(Math.random() * 10),
				totalRatings: 5,
			});

			if (response.success && response.products?.length > 0) {
				const product = response.products[0];
				setDealDaily(product);

				if (product?._id) {
					localStorage.setItem(STORAGE_KEYS.PRODUCT_ID, product._id);
					setProductId(product._id);
				}
			}
		} catch (error) {
			console.error("Error fetching random product:", error);
		}
	}, []);

	// Hàm lấy sản phẩm theo ID, nếu không có ID thì trả về false
	const fetchProductById = useCallback(async (id) => {
		try {
			const response = await apiGetProductById({ pid: id });

			if (response.success && response.product) {
				setDealDaily(response.product);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error fetching product by ID:", error);
			return false;
		}
	}, []);

	// Lấy sản phẩm đầu tiên khi component mount
	useEffect(() => {
		const fetchInitialProduct = async () => {
			// Lấy sản phẩm theo ID từ localStorage
			if (productId && !(await fetchProductById(productId))) {
				// Nếu không tìm thấy sản phẩm theo ID, lấy sản phẩm ngẫu nhiên
				await fetchRandomProduct();
			} else if (!productId) {
				// Nếu không có ID, lấy sản phẩm ngẫu nhiên
				await fetchRandomProduct();
			}
		};

		fetchInitialProduct();
	}, [productId, fetchProductById, fetchRandomProduct]);

	useEffect(() => {
		const updateCountdown = () => {
			const now = Date.now();
			const distance = expireTime - now;

         // Nếu thời gian còn lại lớn hơn 0 (nghĩa là còn ở tương lai) => cập nhật countdown
			if (distance > 0) {
				const hours = Math.floor(
					(distance % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
				);
				const minutes = Math.floor(
					(distance % (60 * 60 * 1000)) / (60 * 1000)
				);
				const seconds = Math.floor((distance % (60 * 1000)) / 1000);

				setCountdown({ hour: hours, minute: minutes, second: seconds });
			} else {
				// Đặt lại countdown về 0 khi hết thời gian
				setCountdown({ hour: 0, minute: 0, second: 0 });

            // Set lại thời gian hết hạn mới
				const newExpireTime = Date.now() + DEFAULT_TIMER_DURATION;
				localStorage.setItem(STORAGE_KEYS.EXPIRE_TIME, newExpireTime);
				setExpireTime(newExpireTime);

				// Lấy sản phẩm ngẫu nhiên mới
				fetchRandomProduct();
			}
		};
      
      // Cập nhật countdown ngay khi component mount
		updateCountdown();

		// Cập nhật countdown mỗi giây
		const timerId = setInterval(updateCountdown, 1000);

		return () => clearInterval(timerId);
	}, [expireTime, fetchRandomProduct]);

	return (
		<div className="border p-4 mt-2">
			<div className="flex justify-between items-center">
				<AiFillStar
					size={20}
					color="#ee3131"
				/>
				<p className="font-semibold uppercase text-[22px]">
					Deal Daily
				</p>
				<div></div>
			</div>

			<div className="flex flex-col gap-2 border-t border-gray-400 pt-6">
				{/* Product image */}
				<img
					src={
						dealDaily?.thumb ||
						"https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png"
					}
					alt="Product image"
					className="object-cover"
				/>

				{/* Product details */}
				<div className="flex flex-col gap-2 mt-8 border-t border-gray-400 pt-2 text-center">
					<p className="line-clamp-1">{dealDaily?.title}</p>
					<p className="flex justify-center">
						{renderRatingStar(dealDaily?.totalRatings, 22)}
					</p>
					<p className="text-gray-700">
						{formatMoney(dealDaily?.price)} VND
					</p>
				</div>
			</div>

			{/* Countdown timer */}
			<div className="flex justify-between items-center mt-4">
				<CountDown
					unit="Hours"
					number={countdown.hour}
				/>
				<CountDown
					unit="Minutes"
					number={countdown.minute}
				/>
				<CountDown
					unit="Seconds"
					number={countdown.second}
				/>
			</div>

			{/* Options button */}
			<button
				className="bg-main w-full p-2 flex justify-center items-center gap-2 rounded-md text-white mt-4 hover:bg-gray-700 transition-all duration-200 cursor-pointer"
				type="button">
				<IoMdMenu
					size={22}
					color="#fff"
				/>
				<span>Options</span>
			</button>
		</div>
	);
};

export default memo(DealDaily);
