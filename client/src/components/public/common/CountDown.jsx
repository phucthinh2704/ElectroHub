import React, { memo } from "react";

const CountDown = ({ unit, number }) => {
	return (
		<div className="w-[30%] py-4 bg-[#f4f4f4] rounded flex flex-col items-center justify-center">
			<p className="text-[18px]">{number}</p>
			<p className="text-[12px]">{unit}</p>
		</div>
	);
};

export default memo(CountDown);
