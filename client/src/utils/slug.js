export const createSlug = (text) =>
	text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.split(" ")
		.join("-");
