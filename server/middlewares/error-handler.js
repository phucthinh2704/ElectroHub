const notFound = (req, res, next) => {
	const error = new Error(`Not Found Route - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

// Express yêu cầu middleware có bốn tham số (error, req, res, next) được coi là middleware xử lý lỗi. 
// Nếu middleware không có bốn tham số, Express có thể không xem nó là một middleware xử lý lỗi và không gọi nó khi có lỗi xảy ra. 
// Thêm tham số next vào errorHandler giúp đảm bảo rằng nó được xem là middleware xử lý lỗi và được gọi khi cần thiết.
const errorHandler = (err, req, res, next) => {
   // có lỗi thì trả về 500, không có lỗi thì trả về 200
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	return res.status(statusCode).json({
		success: false,
		message: err.message,
	});
};

module.exports = { notFound, errorHandler };
