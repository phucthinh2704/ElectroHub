import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import usePagination from "../hooks/usePagination";

const Pagination = ({
	totalCount,
	currentPage,
	pageSize = 10,
	onPageChange,
	siblingCount = 1,
}) => {
	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});

	// Nếu có ít hơn 2 trang thì không hiển thị pagination
	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	const lastPage = paginationRange[paginationRange.length - 1];

	return (
		<div className="flex items-center justify-center space-x-2 mt-6">
			{/* Left navigation arrow */}
			<button
				className={`w-10 h-10 rounded-md border flex items-center justify-center ${
					currentPage === 1
						? "text-gray-400 border-gray-200 cursor-not-allowed"
						: "text-gray-700 border-gray-300 hover:bg-gray-50"
				}`}
				onClick={onPrevious}
				disabled={currentPage === 1}>
				<ChevronLeft className="w-4 h-4" />
			</button>

			{/* Page numbers */}
			{paginationRange.map((pageNumber, index) => {
				// Nếu là DOTS thì render ...
				if (pageNumber === "...") {
					return (
						<span
							key={index}
							className="px-3 py-2 text-gray-500">
							&#8230;
						</span>
					);
				}

				// Render page number
				return (
					<button
						key={index}
						className={`w-10 h-10 rounded-md border cursor-pointer ${
							pageNumber === currentPage
								? "bg-blue-500 text-white border-blue-500"
								: "text-gray-700 border-gray-300 hover:bg-gray-50"
						}`}
						onClick={() => onPageChange(pageNumber)}>
						{pageNumber}
					</button>
				);
			})}

			{/* Right navigation arrow */}
			<button
				className={`w-10 h-10 rounded-md border flex items-center justify-center ${
					currentPage === lastPage
						? "text-gray-400 border-gray-200 cursor-not-allowed"
						: "text-gray-700 border-gray-300 hover:bg-gray-50"
				}`}
				onClick={onNext}
				disabled={currentPage === lastPage}>
				<ChevronRight className="w-4 h-4" />
			</button>
		</div>
	);
};

export default Pagination;
