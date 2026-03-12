import React, { useState, useRef, useEffect, memo } from "react";
import { apiAskChatbot } from "../../../apis/chatbot";
import {
	AiOutlineMessage,
	AiOutlineClose,
	AiOutlineSend,
} from "react-icons/ai";
import MarkdownFormatter from "../markdown/MarkdownFormatter";

const Chatbot = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			text: "Xin chào! Tôi là trợ lý ảo của Electro Hub. Tôi có thể giúp gì cho bạn?",
			sender: "bot",
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);

	// Tự động scroll xuống tin nhắn mới nhất
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isOpen]);

	const handleSendMessage = async () => {
		if (!input.trim()) return;

		const userMsg = input.trim();
		setInput("");

		// Cập nhật UI tin nhắn của user
		setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);
		setIsLoading(true);

		try {
			const formattedHistory = messages.slice(1).map((msg) => ({
				role: msg.sender === "user" ? "user" : "model",
				parts: [{ text: msg.text }],
			}));

			const response = await apiAskChatbot({
				message: userMsg,
				history: formattedHistory,
			});

			if (response.success) {
				setMessages((prev) => [
					...prev,
					{ text: response.response, sender: "bot" },
				]);
			}
		} catch (error) {
			console.log(error);
			setMessages((prev) => [
				...prev,
				{
					text: "Xin lỗi, hệ thống AI đang quá tải. Vui lòng thử lại sau!",
					sender: "bot",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-50">
			{/* Cửa sổ Chat */}
			{isOpen && (
				<div className="bg-white w-[350px] h-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 mb-4 transition-all duration-300 transform origin-bottom-right">
					{/* Header */}
					<div className="bg-main text-white px-4 py-3 flex justify-between items-center">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-main font-bold">
								EH
							</div>
							<div>
								<h3 className="font-semibold text-sm">
									Trợ lý Electro Hub
								</h3>
								<p className="text-xs text-green-300">
									Đang hoạt động
								</p>
							</div>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className="hover:text-gray-200">
							<AiOutlineClose size={20} />
						</button>
					</div>

					{/* Lịch sử tin nhắn */}
					<div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
										msg.sender === "user"
											? "bg-main text-white rounded-tr-none"
											: "bg-gray-200 text-gray-800 rounded-tl-none"
									}`}>
									{/* Sử dụng div để render text có xuống dòng (nếu AI trả về markdown) */}
									<div style={{ whiteSpace: "pre-wrap" }}>
										{/* {msg.text} */}
										<MarkdownFormatter value={msg.text} />
									</div>
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex justify-start">
								<div className="bg-gray-200 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2 text-sm flex gap-1">
									<span className="animate-bounce">.</span>
									<span
										className="animate-bounce"
										style={{ animationDelay: "0.2s" }}>
										.
									</span>
									<span
										className="animate-bounce"
										style={{ animationDelay: "0.4s" }}>
										.
									</span>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Khu vực nhập tin nhắn */}
					<div className="p-3 bg-white border-t flex items-center gap-2">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={(e) =>
								e.key === "Enter" && handleSendMessage()
							}
							placeholder="Nhập tin nhắn..."
							className="flex-1 outline-none bg-gray-100 rounded-full px-4 py-2 text-sm focus:border-main focus:ring-1 focus:ring-main"
						/>
						<button
							onClick={handleSendMessage}
							disabled={isLoading || !input.trim()}
							className="w-10 h-10 bg-main text-white rounded-full flex items-center justify-center hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
							<AiOutlineSend size={18} />
						</button>
					</div>
				</div>
			)}

			{/* Nút bật/tắt chatbot (Bong bóng) */}
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="w-14 h-14 bg-main text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:-translate-y-1 transition-all duration-300 animate-bounce">
					<AiOutlineMessage size={28} />
				</button>
			)}
		</div>
	);
};

export default memo(Chatbot);
