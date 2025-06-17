const formatDescription = (description) => {
	if (!description) return "";
	if (Array.isArray(description)) {
		return description.join("\n");
	}
	return typeof description === "string" ? description : "";
};

export default formatDescription;
