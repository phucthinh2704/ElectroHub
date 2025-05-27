import NextArrow from "../components/public/common/NextArrow";
import PrevArrow from "../components/public/common/PrevArrow";

const settings = {
	dots: false,
	infinite: true,
	speed: 500,
	slidesToShow: 3,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 4000,
	nextArrow: <NextArrow />,
	prevArrow: <PrevArrow />,
	// fade: true,
	cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
};
export default settings;
