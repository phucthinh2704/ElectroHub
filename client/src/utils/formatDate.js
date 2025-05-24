export default function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString("vi-VN");
}
