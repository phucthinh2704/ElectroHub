const formatContent = (content) => {
	if (Array.isArray(content)) {
		return content.map((item, index) => (
			<div
				key={index}
				className="mb-4 text-gray-700 leading-relaxed">
				<span className="mr-2 mt-1 text-blue-500">•</span>
				{item}
			</div>
		));
	}

	// Handle markdown-like formatting
	const lines = content.split("\n").filter((line) => line.trim());
	return lines
		.map((line, index) => {
			const trimmedLine = line.trim();

			// Handle headers
			if (trimmedLine.startsWith("# ")) {
				return (
					<h1
						key={index}
						className="text-2xl font-bold text-gray-900 mb-4 mt-6">
						{trimmedLine.substring(2)}
					</h1>
				);
			}
			if (trimmedLine.startsWith("## ")) {
				return (
					<h2
						key={index}
						className="text-xl font-semibold text-gray-800 mb-3 mt-5">
						{trimmedLine.substring(3)}
					</h2>
				);
			}
			if (trimmedLine.startsWith("### ")) {
				return (
					<h3
						key={index}
						className="text-lg font-medium text-gray-800 mb-2 mt-4">
						{trimmedLine.substring(4)}
					</h3>
				);
			}

			// Handle horizontal rules
			if (trimmedLine === "---") {
				return (
					<hr
						key={index}
						className="my-6 border-gray-300"
					/>
				);
			}

			// Handle blockquotes
			if (trimmedLine.startsWith("> ")) {
				return (
					<blockquote
						key={index}
						className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg mb-3">
						<p className="text-gray-700 italic">
							{trimmedLine.substring(2)}
						</p>
					</blockquote>
				);
			}

			// Handle list items
			if (trimmedLine.startsWith("- ")) {
				return (
					<div
						key={index}
						className="flex items-start mb-2">
						<span className="text-blue-500 mr-2 mt-1">•</span>
						<span className="text-gray-700">
							{trimmedLine.substring(2)}
						</span>
					</div>
				);
			}

			// Handle bold text
			const boldText = trimmedLine.replace(
				/\*\*(.*?)\*\*/g,
				'<strong class="font-semibold text-gray-900">$1</strong>'
			);

			// Regular paragraph
			if (trimmedLine) {
				return (
					<p
						key={index}
						className="text-gray-700 mb-3 leading-relaxed"
						dangerouslySetInnerHTML={{ __html: boldText }}
					/>
				);
			}

			return null;
		})
		.filter(Boolean);
};

export default formatContent;
