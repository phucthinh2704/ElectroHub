const isDescriptionEmpty = (htmlString) => {
	// Tạo một thẻ DOM tạm thời để xử lý HTML
	const div = document.createElement("div");
	div.innerHTML = htmlString;

	// Lấy text đã loại bỏ thẻ HTML
	const text = div.textContent || div.innerText || "";
	console.log(text);

	// Kiểm tra xem text có rỗng không (sau khi trim khoảng trắng)
	return text.trim().length === 0;
};
export default isDescriptionEmpty;
