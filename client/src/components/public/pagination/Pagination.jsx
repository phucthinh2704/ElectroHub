import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import usePagination from "../../../hooks/usePagination";

const Pagination = ({
	totalCount,
	currentPage,
	pageSize,
	onPageChange,
	siblingCount = 1,
}) => {
	const navigate = useNavigate();

	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});
	const lastPage = paginationRange[paginationRange.length - 1];

	// Nếu có ít hơn 2 trang thì không hiển thị pagination
	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	const onNext = () => {
		onPageChange((prev) => prev + 1);
		if (currentPage < lastPage) {
			handlePageChange(currentPage + 1);
		}
	};

	const onPrevious = () => {
		onPageChange((prev) => Math.max(prev - 1, 1));
		if (currentPage > 1) {
			handlePageChange(currentPage - 1);
		}
	};

	const handlePageChange = (pageNumber) => {
		const params = new URLSearchParams(window.location.search);
		params.set("page", pageNumber);
		window.scrollTo(0, 0); 
		navigate(
			{
				pathname: window.location.pathname,
				search: params.toString(),
			},
			{
				replace: true,
				state: { page: pageNumber },
			}
		);

		if (pageNumber !== currentPage) {
			onPageChange(pageNumber);
		}
	};

	return (
		<div className="flex items-center justify-center space-x-2">
			{/* Left navigation arrow */}
			<button
				className={`w-10 h-10 rounded-md border flex items-center justify-center ${
					currentPage === 1
						? "text-gray-400 border-gray-200 cursor-not-allowed"
						: "text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
				}`}
				onClick={onPrevious}
				disabled={currentPage === 1}>
				<ChevronLeft className="w-5 h-5" />
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
						onClick={() => handlePageChange(pageNumber)}>
						{pageNumber}
					</button>
				);
			})}

			{/* Right navigation arrow */}
			<button
				className={`w-10 h-10 rounded-md border flex items-center justify-center ${
					currentPage === lastPage
						? "text-gray-400 border-gray-200 cursor-not-allowed"
						: "text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
				}`}
				onClick={onNext}
				disabled={currentPage === lastPage}>
				<ChevronRight className="w-5 h-5" />
			</button>
		</div>
	);
};

export default memo(Pagination);
