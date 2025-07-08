import { memo, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ isLoginPage }) => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: isLoginPage ? "instant" : "smooth",
		});
	}, [isLoginPage, pathname]); // Chạy lại mỗi khi đường dẫn URL thay đổi

	return null; // Component này không render gì cả
};

export default memo(ScrollToTop);
