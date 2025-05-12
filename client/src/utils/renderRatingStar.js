import React from 'react';
import icons from "./icons";

const { AiFillStar, AiOutlineStar } = icons;

const renderRatingStar = (rating, size) => {
	const stars = [];
	const filledStars = Number(rating);

	for (let i = 0; i < filledStars; i++) {
		stars.push(React.createElement(AiFillStar, { key: i, className: "text-yellow-500", style: { fontSize: size } }));
	}

	while (stars.length < 5) {
		stars.push(React.createElement(AiOutlineStar, { key: stars.length, className: "text-gray-300", style: { fontSize: size } }));
	}

	return stars;
};

export default renderRatingStar;
