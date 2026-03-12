import React, { memo, useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			setIsVisible(window.scrollY > 300);
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<button
			onClick={scrollToTop}
			className={`
          fixed bottom-24 right-6 w-14 h-14
          bg-gradient-to-r from-blue-500 to-purple-600
          hover:from-blue-600 hover:to-purple-700
          text-white rounded-full shadow-lg
          flex items-center justify-center cursor-pointer
          transition-all duration-300 group
          ${
				isVisible
					? "opacity-100 scale-100"
					: "opacity-0 scale-95 pointer-events-none"
			}
        `}>
			<ChevronUp
				size={24}
				className="transition-transform group-hover:-translate-y-0.5"
			/>
		</button>
	);
};

export default memo(BackToTop);
