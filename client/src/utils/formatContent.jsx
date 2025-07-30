const formatContent = (content) => {
	if (!Array.isArray(content)) {
		return [];
	}

	return content.map((item, index) => {
		// Kiểm tra nếu item chứa HTML tags
		const hasHtmlTags = /<[^>]*>/g.test(item);

		if (hasHtmlTags) {
			// Render HTML content
			return (
				<div
					key={index}
					className="html-content mb-4"
					dangerouslySetInnerHTML={{ __html: item }}
					style={{
						lineHeight: "1.6",
						color: "#374151",
					}}
				/>
			);
		} else {
			// Render plain text
			return (
				<div
					key={index}
					className="text-gray-700 mb-4">
					{item}
				</div>
			);
		}
	});
};

export default formatContent;
