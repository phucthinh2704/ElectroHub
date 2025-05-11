import React from "react";
import banner1 from "../assets/electronics-store-banner.svg";
import banner2 from "../assets/electro_hub_banner.svg";
import banner3 from "../assets/premium_tech_banner.svg";
import Slider from "react-slick";
const Banner = () => {
	const banners = [
		{
			id: 1,
			src: banner1,
			alt: "banner1",
		},
		{
			id: 2,
			src: banner2,
			alt: "banner2",
		},
		{
			id: 3,
			src: banner3,
			alt: "banner3",
		},
	];

	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	return (
		<div className="h-[455px] overflow-hidden">
			<Slider {...settings}>
				{banners.map((banner) => (
					<div key={banner.id}>
						<img
							src={banner.src}
							alt={banner.alt}
						/>
					</div>
				))}
			</Slider>
		</div>
	);
};

export default Banner;
