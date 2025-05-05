const convertQueryFormat = (params) => {
	const result = {};

	for (const key in params) {
		// Kiểm tra xem key có chứa cú pháp toán tử không (ví dụ: "price[$gte]")
		const operatorMatch = key.match(/(\w+)\[([$\w]+)\]/);

		if (operatorMatch) {
			// Lấy tên trường (price) và toán tử ($gte)
			const fieldName = operatorMatch[1];
			const operator = operatorMatch[2];

			// Chuyển đổi giá trị từ string sang số nếu cần
			const value = isNaN(params[key])
				? params[key]
				: Number(params[key]);

			// Tạo hoặc cập nhật cấu trúc lồng nhau
			if (!result[fieldName]) {
				result[fieldName] = {};
			}

			result[fieldName][operator] = value;
		} else {
			// Xử lý các trường thông thường không có toán tử
			result[key] = params[key];
		}
	}

	return result;
};

module.exports = convertQueryFormat;
