import { memo, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	}, [pathname]); // Chạy lại mỗi khi đường dẫn URL thay đổi

	return null; // Component này không render gì cả
};

export default memo(ScrollToTop);
