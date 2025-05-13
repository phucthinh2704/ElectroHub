import NextArrow from "../components/NextArrow";
import PrevArrow from "../components/PrevArrow";

const settings = {
	dots: false,
	infinite: true,
	speed: 800,
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
