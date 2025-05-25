import { useMemo } from "react";
import { generateRange } from "../utils/generateRange";

const DOTS = "...";

const usePagination = ({
	totalCount,
	pageSize = 10,
	siblingCount = 1,
	currentPage,
}) => {
	const paginationRange = useMemo(() => {
		// Tính tổng số trang
		const totalPageCount = Math.ceil(totalCount / pageSize);

		// Tổng số item pagination cần hiển thị
		// siblingCount + firstPage + lastPage + currentPage + 2 * DOTS
		const totalPageNumbers = siblingCount + 5;

		/*
		  Trường hợp 1: Nếu số trang ít hơn hoặc bằng số item cần hiển thị
		  → Hiển thị tất cả các trang không cần DOTS
		  Ví dụ: [1, 2, 3, 4, 5]
		*/
		if (totalPageNumbers >= totalPageCount) {
			return generateRange(1, totalPageCount);
		}

		// Tính toán left và right sibling index
		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(
			currentPage + siblingCount,
			totalPageCount
		);

		// Kiểm tra có nên hiển thị left/right dots hay không
		// Không hiển thị dots nếu chỉ có 1 trang giữa sibling và first/last page
		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

		const firstPageIndex = 1;
		const lastPageIndex = totalPageCount;

		/*
		  Trường hợp 2: Không có left dots, có right dots
		  Ví dụ: [1, 2, 3, 4, 5, ..., 50]
		*/
		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblingCount;
			const leftRange = generateRange(1, leftItemCount);

			return [...leftRange, DOTS, totalPageCount];
		}

		/*
		  Trường hợp 3: Có left dots, không có right dots
		  Ví dụ: [1, ..., 46, 47, 48, 49, 50]
		*/
		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = 3 + 2 * siblingCount;
			const rightRange = generateRange(
				totalPageCount - rightItemCount + 1,
				totalPageCount
			);

			return [firstPageIndex, DOTS, ...rightRange];
		}

		/*
		  Trường hợp 4: Có cả left và right dots
		  Ví dụ: [1, ..., 23, 24, 25, ..., 50]
		*/
		if (shouldShowLeftDots && shouldShowRightDots) {
			const middleRange = generateRange(
				leftSiblingIndex,
				rightSiblingIndex
			);
			return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
		}

		return [];
	}, [totalCount, pageSize, siblingCount, currentPage]);

	return paginationRange;
};

export default usePagination;
