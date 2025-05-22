import { Check, ChevronDown, ChevronUp, DollarSign, X } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { colors, priceRanges } from "../utils/constants";

const FilterItem = ({ name, isOpen, setIsOpen}) => {
	const navigate = useNavigate();
	const [colorsSelected, setColorsSelected] = useState([]);
	const [priceRange, setPriceRange] = useState({ min: "", max: "" });
	const [tempPriceRange, setTempPriceRange] = useState({ min: "", max: "" });
	const { category } = useParams();

	useEffect(() => {
		const params = new URLSearchParams();
		
		// Add color filter
		if (colorsSelected.length > 0) {
			params.set('color', colorsSelected.map(color => color.toLowerCase()).join(','));
		}
		if (priceRange.min || priceRange.max) {
			const priceValue = `${priceRange.min || 0}-${priceRange.max || ''}`;
			params.set('price', priceValue);
		}

		if (params.toString()) {
			navigate({
				pathname: `/products/${category}`,
				search: params.toString(),
			});
		} else {
			navigate(`/products/${category}`);
		}
	}, [colorsSelected, priceRange, category, navigate]);

	const handleCheckboxChange = (color) => {
		setColorsSelected((prev) => {
			if (prev.includes(color)) {
				return prev.filter((c) => c !== color);
			} else {
				return [...prev, color];
			}
		});
	};

	const handlePriceRangeSelect = (range) => {
		const newRange = {
			min: range.min?.toString() || "",
			max: range.max?.toString() || ""
		};
		setPriceRange(newRange);
		setTempPriceRange(newRange);
	};

	const handleCustomPriceChange = (field, value) => {
		// Only allow numbers
		const numericValue = value.replace(/[^0-9]/g, '');
		setTempPriceRange(prev => ({
			...prev,
			[field]: numericValue
		}));
	};

	const applyCustomPriceRange = () => {
		const min = tempPriceRange.min;
		const max = tempPriceRange.max;
		
		// Validate price range
		if (min && max && parseInt(min) > parseInt(max)) {
			alert("Minimum price cannot be greater than maximum price");
			return;
		}

		setPriceRange(tempPriceRange);
	};

	const handleReset = (e) => {
		e.stopPropagation();
		if (name === "Color") {
			setColorsSelected([]);
		} else if (name === "Price") {
			setPriceRange({ min: "", max: "" });
			setTempPriceRange({ min: "", max: "" });
		}
	};

	const isItemOpen = isOpen === name;
	const hasActiveFilters = name === "Color" ? colorsSelected.length > 0 : 
		(priceRange.min || priceRange.max);

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
					{name === "Color" && (
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
					
					{name === "Price" && (
						<div className="space-y-3">
							<div className="flex justify-between items-center pb-2 border-b border-gray-100">
								<span className="text-sm text-gray-500 flex items-center">
									<DollarSign size={14} className="mr-1" />
									Price Range
								</span>
								{hasActiveFilters && (
									<button
										onClick={handleReset}
										className="flex items-center text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer">
										<X size={14} className="mr-1" />
										Reset
									</button>
								)}
							</div>

							{/* Predefined price ranges */}
							<div className="space-y-2">
								<h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
									Quick Select
								</h4>
								{priceRanges.map((range, index) => (
									<div
										key={index}
										onClick={() => handlePriceRangeSelect(range)}
										className={`p-2 rounded cursor-pointer transition-colors text-sm ${
											priceRange.min == range.min && priceRange.max == range.max
												? "bg-blue-50 text-blue-700 border border-blue-200"
												: "hover:bg-gray-50"
										}`}>
										{range.label}
									</div>
								))}
							</div>

							{/* Custom price range */}
							<div className="space-y-2">
								<h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
									Custom Range
								</h4>
								<div className="flex gap-2 items-center">
									<div className="flex-1">
										<input
											type="text"
											placeholder="Min"
											value={tempPriceRange.min}
											onChange={(e) => handleCustomPriceChange('min', e.target.value)}
											className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<span className="text-gray-400">-</span>
									<div className="flex-1">
										<input
											type="text"
											placeholder="Max"
											value={tempPriceRange.max}
											onChange={(e) => handleCustomPriceChange('max', e.target.value)}
											className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
								</div>
								<button
									onClick={applyCustomPriceRange}
									className="w-full px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
									Apply Range
								</button>
							</div>

							{/* Current filter display */}
							{hasActiveFilters && (
								<div className="mt-3 p-2 bg-gray-50 rounded text-sm">
									<span className="text-gray-600">Active filter: </span>
									<span className="font-medium">
										${priceRange.min || '0'} - {priceRange.max ? `$${priceRange.max}` : 'Any'}
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default memo(FilterItem);
