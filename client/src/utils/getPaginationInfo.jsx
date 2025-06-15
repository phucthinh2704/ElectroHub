const getPaginationInfo = (currentPage, pageSize, totalItems) => {
	if (totalItems === 0) return { startItem: 0, endItem: 0 };
	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalItems);

	return { startItem, endItem };
};

export default getPaginationInfo;
