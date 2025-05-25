export const generateRange = (start, end) => {
	const length = end + 1 - start;
	return Array.from({ length }, (_, index) => start + index);
};
