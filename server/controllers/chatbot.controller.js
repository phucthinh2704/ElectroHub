const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/product");
const Order = require("../models/order"); // Import thêm Order
const Coupon = require("../models/coupon"); // Import thêm Coupon
const Blog = require("../models/blog"); // Import thêm Blog
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. MỞ RỘNG CÁC CÔNG CỤ (TOOLS) CHO GEMINI
const tools = [
	{
		functionDeclarations: [
			// --- CÁC TOOL VỀ SẢN PHẨM (Đã có) ---
			{
				name: "search_product_by_name",
				description:
					"Tìm kiếm thông tin chi tiết của một sản phẩm bất kỳ thông qua tên sản phẩm hoặc từ khóa.",
				parameters: {
					type: "OBJECT",
					properties: {
						keyword: {
							type: "STRING",
							description:
								"Từ khóa hoặc tên sản phẩm khách hàng muốn tìm",
						},
					},
					required: ["keyword"],
				},
			},
			{
				name: "filter_products",
				description:
					"Tìm các sản phẩm theo khoảng giá, danh mục, hoặc thương hiệu.",
				parameters: {
					type: "OBJECT",
					properties: {
						min_price: {
							type: "NUMBER",
							description: "Mức giá thấp nhất (VNĐ).",
						},
						max_price: {
							type: "NUMBER",
							description: "Mức giá cao nhất (VNĐ).",
						},
						category: {
							type: "STRING",
							// ÉP GEMINI PHẢI MAP SANG TIẾNG ANH THEO ĐÚNG DB CỦA BẠN
							description:
								"Danh mục sản phẩm. BẮT BUỘC phải map (chuyển đổi) từ khóa tiếng Việt sang 1 trong 8 giá trị tiếng Anh chính xác sau đây để truy vấn DB: 'Smartphone' (nếu hỏi điện thoại), 'Tablet' (máy tính bảng), 'Laptop' (máy tính xách tay), 'Television' (tivi), 'Camera' (máy ảnh), 'Speaker' (loa), 'Accessories' (phụ kiện, tai nghe, cáp, sạc), 'Printer' (máy in). Để trống nếu người dùng không nhắc đến.",
						},
						brand: {
							type: "STRING",
							description:
								"Thương hiệu sản phẩm. LƯU Ý: Nếu khách hàng hỏi nhiều thương hiệu cùng lúc, BẮT BUỘC phải ngăn cách chúng bằng dấu phẩy (VD: 'Lenovo, Asus', 'Apple, Samsung').",
						},
					},
				},
			},
			{
				name: "get_product_status",
				description:
					"Kiểm tra tình trạng tồn kho, màu sắc và giá của các biến thể (variants) của một sản phẩm.",
				parameters: {
					type: "OBJECT",
					properties: {
						product_name: {
							type: "STRING",
							description:
								"Tên chính xác của sản phẩm cần kiểm tra",
						},
					},
					required: ["product_name"],
				},
			},
			// --- CÁC TOOL MỚI BỔ SUNG ---
			{
				name: "check_order_status",
				description:
					"Tra cứu trạng thái đơn hàng và thông tin giao hàng khi người dùng cung cấp mã đơn hàng (Order ID).",
				parameters: {
					type: "OBJECT",
					properties: {
						order_id: {
							type: "STRING",
							description:
								"Mã đơn hàng (ID) gồm 24 ký tự chữ và số",
						},
					},
					required: ["order_id"],
				},
			},
			{
				name: "get_active_coupons",
				description:
					"Lấy danh sách các mã giảm giá, khuyến mãi đang còn hiệu lực của cửa hàng.",
				parameters: {
					type: "OBJECT",
					properties: {
						// Không cần param bắt buộc vì chỉ lấy danh sách chung
						ask_for_all: {
							type: "BOOLEAN",
							description: "Mặc định là true",
						},
					},
				},
			},
			{
				name: "search_blogs",
				description:
					"Tìm kiếm các bài viết tin tức, hướng dẫn mua sắm, review công nghệ từ blog của cửa hàng.",
				parameters: {
					type: "OBJECT",
					properties: {
						keyword: {
							type: "STRING",
							description:
								"Chủ đề bài viết cần tìm (VD: 'kinh nghiệm chọn laptop', 'đánh giá iphone')",
						},
					},
					required: ["keyword"],
				},
			},
		],
	},
];

// 2. LOGIC XỬ LÝ
const askChatbot = asyncHandler(async (req, res) => {
	const { message, history } = req.body;
	if (!message) throw new Error("Vui lòng nhập câu hỏi");

	// 1. CẬP NHẬT LẠI SYSTEM INSTRUCTION VỚI "LUẬT THÉP"
	const systemInstruction = `
        Bạn là nhân viên tư vấn chính thức của "Electro Hub". Nhiệm vụ của bạn là tư vấn dựa trên cơ sở dữ liệu có thật của hệ thống.
        
        LUẬT THÉP MÀ BẠN PHẢI TUÂN THỦ TUYỆT ĐỐI (NẾU VI PHẠM SẼ BỊ PHẠT):
        1. KHÔNG BAO GIỜ được tự bịa ra (hallucinate) tên sản phẩm, giá bán, số lượng tồn kho, hay mã đơn hàng.
        2. CHỈ ĐƯỢC PHÉP cung cấp thông tin sản phẩm, giá cả, tồn kho NẾU thông tin đó vừa được trả về từ các công cụ (Function Call) do hệ thống cung cấp.
        3. NẾU công cụ trả về "Không tìm thấy" hoặc mảng rỗng, bạn BẮT BUỘC phải nói với khách hàng là: "Xin lỗi, hiện tại Electro Hub không có sản phẩm này / không có thông tin này". TUYỆT ĐỐI KHÔNG tự bịa ra một sản phẩm tương tự để thay thế nếu nó không nằm trong danh sách trả về.
        4. Với các câu hỏi ngoài lề (không liên quan đến mua sắm thiết bị điện tử, đơn hàng, cửa hàng), hãy từ chối trả lời một cách lịch sự: "Xin lỗi, em chỉ là trợ lý tư vấn bán hàng của Electro Hub nên không thể trả lời câu hỏi này ạ."
        
        Thông tin nội bộ tĩnh (Được phép sử dụng):
        - Giao hàng miễn phí toàn quốc cho đơn hàng từ 1.000.000 VNĐ. Giao hỏa tốc 2h nội thành.
        - Bảo hành chính hãng 12-24 tháng. 1 đổi 1 trong 30 ngày.
    `;

	// 2. CẤU HÌNH GENERATION CONFIG ĐỂ ÉP BOT TRẢ LỜI ĐÚNG SỰ THẬT
	const model = genAI.getGenerativeModel({
		model: "gemini-2.5-flash",
		systemInstruction,
		tools: tools,
		generationConfig: {
			temperature: 0.1, // Ép bot trả lời deterministic (không sáng tạo, chỉ dựa vào fact)
			topP: 0.8, // Giới hạn xác suất chọn từ, giúp câu văn bám sát ngữ cảnh hơn
			topK: 10,
		},
	});

	const chatSession = model.startChat({ history: history || [] });

	try {
		let result = await chatSession.sendMessage(message);
		let response = result.response;
		const functionCalls = response.functionCalls();

		if (functionCalls && functionCalls.length > 0) {
			const call = functionCalls[0];
			const apiResponse = {};

			// --- XỬ LÝ SẢN PHẨM ---
			if (call.name === "search_product_by_name") {
				const products = await Product.find({
					title: { $regex: call.args.keyword, $options: "i" },
				}).limit(7);
				apiResponse.products =
					products.length > 0 ? products : "Không tìm thấy sản phẩm.";
			} else if (call.name === "filter_products") {
				const { min_price, max_price, category, brand } = call.args;
				let query = {};

				if (min_price || max_price) {
					query.price = {};
					if (min_price) query.price.$gte = min_price;
					if (max_price) query.price.$lte = max_price;
				}
				if (category)
					query.category = { $regex: category, $options: "i" };

				// --- ĐOẠN CODE MỚI CẦN THAY THẾ ---
				if (brand) {
					// Tách chuỗi "Lenovo, Asus" thành mảng và tạo Regex cho từng phần tử
					const brandList = brand
						.split(",")
						.map((b) => new RegExp(b.trim(), "i"));
					query.brand = { $in: brandList }; // Tìm sản phẩm có brand nằm trong danh sách này
				}
				// ----------------------------------

				const products = await Product.find(query)
					.select("title price brand stock color")
					.limit(10)
					.sort({ price: 1 });

				apiResponse.result =
					products.length > 0
						? products
						: "Không có sản phẩm nào trong khoảng giá/danh mục/thương hiệu này.";
			} else if (call.name === "get_product_status") {
				const product = await Product.findOne({
					title: { $regex: call.args.product_name, $options: "i" },
				});
				apiResponse.inventory = product
					? product
					: "Không tìm thấy thông tin tồn kho.";
			}

			// --- XỬ LÝ ĐƠN HÀNG ---
			else if (call.name === "check_order_status") {
				try {
					const order = await Order.findById(call.args.order_id);
					if (order) {
						apiResponse.orderInfo = {
							status: order.status,
							total: order.total,
							date: order.createdAt,
							recipient: order.recipientInfo.name,
							address: order.shippingAddress,
							itemsCount: order.products.length,
						};
					} else {
						apiResponse.orderInfo =
							"Không tìm thấy đơn hàng với mã ID này. Vui lòng kiểm tra lại.";
					}
				} catch (err) {
					apiResponse.orderInfo = "Mã đơn hàng không hợp lệ.";
				}
			}

			// --- XỬ LÝ MÃ GIẢM GIÁ ---
			else if (call.name === "get_active_coupons") {
				// Chỉ lấy các mã có ngày hết hạn lớn hơn hiện tại
				const coupons = await Coupon.find({
					expiry: { $gt: Date.now() },
				});
				apiResponse.coupons =
					coupons.length > 0
						? coupons
						: "Hiện tại shop đang không có mã giảm giá nào.";
			}

			// --- XỬ LÝ TÌM KIẾM BLOG ---
			else if (call.name === "search_blogs") {
				const blogs = await Blog.find({
					$or: [
						{ title: { $regex: call.args.keyword, $options: "i" } },
						{
							description: {
								$regex: call.args.keyword,
								$options: "i",
							},
						},
					],
				}).limit(7);
				apiResponse.blogs =
					blogs.length > 0
						? blogs
						: "Dạ hiện tại em chưa tìm thấy bài viết nào về chủ đề này trên trang Blog của mình.";
			}

			// Gửi kết quả từ DB ngược lại cho Gemini
			result = await chatSession.sendMessage([
				{
					functionResponse: {
						name: call.name,
						response: apiResponse,
					},
				},
			]);

			response = result.response;
		}

		return res.status(200).json({
			success: true,
			response: response.text(),
		});
	} catch (error) {
		console.error("Chatbot Error:", error);
		return res.status(500).json({
			success: false,
			response:
				"Xin lỗi, hệ thống AI đang bảo trì. Vui lòng thử lại sau ít phút nhé!",
		});
	}
});

module.exports = {
	askChatbot,
};
