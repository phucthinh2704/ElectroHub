import React, { memo, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { colors } from "../utils/constants";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";

const FilterItem = ({ name, isOpen, setIsOpen, type = "checkbox" }) => {
	const navigate = useNavigate();
	const [colorsSelected, setColorsSelected] = useState([]);
	const { category } = useParams();
	useEffect(() => {
		if (colorsSelected.length === 0) {
			navigate(`/products/${category}`);
			return;
		}

		navigate({
			pathname: `/products/${category}`,
			search: createSearchParams({
				color: colorsSelected
					.map((color) => color.toLowerCase())
					.join(","),
			}).toString(),
		});
	}, [category, colorsSelected, navigate]);

	const handleCheckboxChange = (color) => {
		setColorsSelected((prev) => {
			if (prev.includes(color)) {
				return prev.filter((c) => c !== color);
			} else {
				return [...prev, color];
			}
		});
	};

	const handleReset = (e) => {
		e.stopPropagation();
		setColorsSelected([]);
	};

	const isItemOpen = isOpen === name;

	return (
		<div className="relative inline-block">
			{/* Button trigger */}
			<button
				onClick={() => setIsOpen(isItemOpen ? null : name)}
				className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-all duration-200">
				<span className="font-medium text-gray-800 mr-2">{name}</span>
				{colorsSelected.length > 0 && (
					<span className="mr-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
						{colorsSelected.length}
					</span>
				)}
				{isItemOpen ? (
					<ChevronUp
						size={16}
						className="ml-1"
					/>
				) : (
					<ChevronDown
						size={16}
						className="ml-1"
					/>
				)}
			</button>

			{/* Dropdown content */}
			{isItemOpen && (
				<div className="absolute z-10 mt-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-100">
					{type === "checkbox" && (
						<div className="space-y-2">
							<div className="flex justify-between items-center pb-2 border-b border-gray-100">
								<span className="text-sm text-gray-500">
									{colorsSelected.length} selected
								</span>
								{colorsSelected.length > 0 && (
									<button
										onClick={handleReset}
										className="flex items-center text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer">
										<X
											size={14}
											className="mr-1"
										/>
										Reset
									</button>
								)}
							</div>

							<div className="grid grid-cols-2 gap-2 mt-2">
								{colors.map((color, index) => (
									<div
										key={index}
										onClick={() =>
											handleCheckboxChange(color)
										}
										className="flex items-center p-2 cursor-pointer rounded hover:bg-gray-50 transition-colors animate-fade-in">
										<div
											className={`w-4 h-4 border rounded flex items-center justify-center ${
												colorsSelected.includes(color)
													? "bg-blue-500 border-blue-500"
													: "border-gray-300"
											}`}>
											{colorsSelected.includes(color) && (
												<Check
													size={12}
													className="text-white"
												/>
											)}
										</div>
										<span className="ml-2 text-sm text-gray-700">
											{color}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default memo(FilterItem);
