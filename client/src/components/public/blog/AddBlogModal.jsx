import React, { useState, memo } from "react";
import {
	X,
	Plus,
	Save,
	Eye,
	Type,
	List,
	Image,
	Trash2,
	GripVertical,
	Upload,
	Star,
	Tag,
} from "lucide-react";
import { apiCreateBlog } from "../../../apis/blog";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { categoriesBlog } from "../../../utils/constants";

const AddBlogModal = ({ fetchBlogs }) => {
	const { current } = useSelector((state) => state.user);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		content: [],
		category: "",
		image: "",
		featured: false,
		author: current?._id || "",
	});

	const [previewMode, setPreviewMode] = useState(false);

	const addContentBlock = (type) => {
		const newBlock = {
			type,
			...(type === "paragraph" && { text: "" }),
			...(type === "heading" && { text: "", level: 2 }),
			...(type === "list" && { items: [""] }),
			...(type === "image" && { src: "", alt: "", caption: "" }),
		};

		setFormData((prev) => ({
			...prev,
			content: [...prev.content, newBlock],
		}));
	};

	const updateContentBlock = (index, field, value) => {
		setFormData((prev) => ({
			...prev,
			content: prev.content.map((block, i) =>
				i === index ? { ...block, [field]: value } : block
			),
		}));
	};

	const removeContentBlock = (index) => {
		setFormData((prev) => ({
			...prev,
			content: prev.content.filter((_, i) => i !== index),
		}));
	};

	const moveContentBlock = (index, direction) => {
		const newContent = [...formData.content];
		const targetIndex = direction === "up" ? index - 1 : index + 1;

		if (targetIndex >= 0 && targetIndex < newContent.length) {
			[newContent[index], newContent[targetIndex]] = [
				newContent[targetIndex],
				newContent[index],
			];
			setFormData((prev) => ({ ...prev, content: newContent }));
		}
	};

	const addListItem = (blockIndex) => {
		setFormData((prev) => ({
			...prev,
			content: prev.content.map((block, i) =>
				i === blockIndex
					? { ...block, items: [...block.items, ""] }
					: block
			),
		}));
	};

	const updateListItem = (blockIndex, itemIndex, value) => {
		setFormData((prev) => ({
			...prev,
			content: prev.content.map((block, i) =>
				i === blockIndex
					? {
							...block,
							items: block.items.map((item, j) =>
								j === itemIndex ? value : item
							),
					  }
					: block
			),
		}));
	};

	const removeListItem = (blockIndex, itemIndex) => {
		setFormData((prev) => ({
			...prev,
			content: prev.content.map((block, i) =>
				i === blockIndex
					? {
							...block,
							items: block.items.filter(
								(_, j) => j !== itemIndex
							),
					  }
					: block
			),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Form Data:", formData);
		try {
			const response = await apiCreateBlog(formData);
			if (response.success) {
				alert("Created new blog post successfully!");
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Blog post created successfully!",
					confirmButtonText: "OK",
					confirmButtonColor: "#3085d6",
				});
				fetchBlogs();
				setIsModalOpen(false);
				resetForm();
			}
		} catch (error) {
			console.log("Error creating blog post:", error);
		}
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			content: [],
			category: "",
			image: "",
			featured: false,
		});
		setPreviewMode(false);
	};

	const renderContentBlock = (block, index) => {
		return (
			<div
				key={index}
				className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 mb-4 group hover:border-blue-300 transition-colors">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
						<span className="text-sm font-medium text-gray-600 capitalize bg-white px-2 py-1 rounded">
							{block.type}
						</span>
					</div>
					<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							type="button"
							onClick={() => moveContentBlock(index, "up")}
							disabled={index === 0}
							className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50">
							↑
						</button>
						<button
							type="button"
							onClick={() => moveContentBlock(index, "down")}
							disabled={index === formData.content.length - 1}
							className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50">
							↓
						</button>
						<button
							type="button"
							onClick={() => removeContentBlock(index)}
							className="p-1 text-red-400 hover:text-red-600">
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				</div>

				{block.type === "paragraph" && (
					<textarea
						value={block.text || ""}
						onChange={(e) =>
							updateContentBlock(index, "text", e.target.value)
						}
						placeholder="Enter content for paragraph..."
						className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
						rows="4"
					/>
				)}

				{block.type === "heading" && (
					<div className="space-y-3">
						<div className="flex gap-3">
							<select
								value={block.level || 2}
								onChange={(e) =>
									updateContentBlock(
										index,
										"level",
										parseInt(e.target.value)
									)
								}
								className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								{[1, 2, 3, 4, 5, 6].map((level) => (
									<option
										key={level}
										value={level}>
										H{level}
									</option>
								))}
							</select>
							<input
								type="text"
								value={block.text || ""}
								onChange={(e) =>
									updateContentBlock(
										index,
										"text",
										e.target.value
									)
								}
								placeholder="Enter the title..."
								className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
				)}

				{block.type === "list" && (
					<div className="space-y-2">
						{block.items?.map((item, itemIndex) => (
							<div
								key={itemIndex}
								className="flex gap-2">
								<input
									type="text"
									value={item}
									onChange={(e) =>
										updateListItem(
											index,
											itemIndex,
											e.target.value
										)
									}
									placeholder={`Section ${itemIndex + 1}...`}
									className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
								<button
									type="button"
									onClick={() =>
										removeListItem(index, itemIndex)
									}
									className="p-2 text-red-400 hover:text-red-600">
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => addListItem(index)}
							className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
							<Plus className="w-4 h-4" />
							Add section
						</button>
					</div>
				)}

				{block.type === "image" && (
					<div className="space-y-3">
						<input
							type="url"
							value={block.src || ""}
							onChange={(e) =>
								updateContentBlock(index, "src", e.target.value)
							}
							placeholder="URL image..."
							className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<input
							type="text"
							value={block.alt || ""}
							onChange={(e) =>
								updateContentBlock(index, "alt", e.target.value)
							}
							placeholder="Alt text..."
							className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<input
							type="text"
							value={block.caption || ""}
							onChange={(e) =>
								updateContentBlock(
									index,
									"caption",
									e.target.value
								)
							}
							placeholder="Caption text..."
							className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						{block.src && (
							<img
								src={block.src}
								alt={block.alt}
								className="max-w-full h-40 object-cover rounded-lg"
								onError={(e) =>
									(e.target.style.display = "none")
								}
							/>
						)}
					</div>
				)}
			</div>
		);
	};

	const renderPreview = () => {
		return (
			<div className="prose prose-lg max-w-none">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					{formData.title}
				</h1>
				<p className="text-xl text-gray-600 mb-8">
					{formData.description}
				</p>

				{formData.content.map((block, index) => {
					switch (block.type) {
						case "paragraph":
							return (
								<p
									key={index}
									className="mb-4">
									{block.text}
								</p>
							);
						case "heading": {
							const HeadingTag = `h${block.level}`;
							return React.createElement(
								HeadingTag,
								{
									key: index,
									className: `font-bold mb-4 ${
										block.level === 1
											? "text-3xl"
											: block.level === 2
											? "text-2xl"
											: "text-xl"
									}`,
								},
								block.text
							);
						}
						case "list":
							return (
								<ul
									key={index}
									className="list-disc list-inside mb-4 space-y-1">
									{block.items.map((item, i) => (
										<li key={i}>{item}</li>
									))}
								</ul>
							);
						case "image":
							return block.src ? (
								<img
									key={index}
									src={block.src}
									alt={block.alt}
									className="w-full rounded-lg mb-4"
								/>
							) : null;
						default:
							return null;
					}
				})}
			</div>
		);
	};

	return (
		<>
			{/* Trigger Button */}
			<button
				onClick={() => setIsModalOpen(true)}
				className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg cursor-pointer">
				<Plus className="w-5 h-5" />
				Write Post
			</button>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
									<Type className="w-5 h-5 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-gray-900">
										{previewMode
											? "Preview Post"
											: "Create New Post"}
									</h2>
									<p className="text-sm text-gray-600">
										{previewMode
											? "Review the post before posting"
											: "Create engaging content for the blog"}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => setPreviewMode(!previewMode)}
									className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
										previewMode
											? "bg-blue-100 text-blue-700"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}>
									<Eye className="w-4 h-4" />
									{previewMode ? "Edit" : "Preview"}
								</button>
								<button
									onClick={() => setIsModalOpen(false)}
									className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
									<X className="w-5 h-5" />
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="overflow-y-auto max-h-[calc(90vh-200px)]">
							{!previewMode ? (
								<div className="p-6 space-y-6">
									{/* Basic Info */}
									<div className="grid md:grid-cols-2 gap-6">
										<div className="md:col-span-2">
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Title of the post *
											</label>
											<input
												type="text"
												value={formData.title}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														title: e.target.value,
													}))
												}
												placeholder="Enter title..."
												className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
												required
											/>
										</div>

										<div className="md:col-span-2">
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Short description *
											</label>
											<textarea
												value={formData.description}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														description:
															e.target.value,
													}))
												}
												placeholder="Enter short description about the post..."
												className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
												rows="3"
												required
											/>
										</div>

										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Category *
											</label>
											<select
												value={formData.category}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														category:
															e.target.value,
													}))
												}
												className="w-full p-4 border border-gray-300 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												required>
												<option value="">
													Select a category
												</option>
												{categoriesBlog.map((cat) => (
													<option
														key={cat}
														value={cat}>
														{cat}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Thumbnail
											</label>
											<input
												type="url"
												value={formData.image}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														image: e.target.value,
													}))
												}
												placeholder="URL thumbnail..."
												className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>

										<div className="md:col-span-2">
											<label className="flex items-center gap-3 cursor-pointer">
												<input
													type="checkbox"
													checked={formData.featured}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															featured:
																e.target
																	.checked,
														}))
													}
													className="w-5 h-5 text-blue-600 rounded outline-none focus:ring-2 focus:ring-blue-500"
												/>
												<span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
													<Star className="w-4 h-4" />
													Mark as Featured
												</span>
											</label>
										</div>
									</div>

									{/* Content Builder */}
									<div>
										<div className="flex items-center justify-between mb-4">
											<label className="block text-sm font-semibold text-gray-700">
												Content *
											</label>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() =>
														addContentBlock(
															"paragraph"
														)
													}
													className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
													<Type className="w-4 h-4" />
													Paragraph
												</button>
												<button
													type="button"
													onClick={() =>
														addContentBlock(
															"heading"
														)
													}
													className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
													<Type className="w-4 h-4" />
													Heading
												</button>
												<button
													type="button"
													onClick={() =>
														addContentBlock("list")
													}
													className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
													<List className="w-4 h-4" />
													List
												</button>
												<button
													type="button"
													onClick={() =>
														addContentBlock("image")
													}
													className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
													<Image className="w-4 h-4" />
													Image
												</button>
											</div>
										</div>

										<div className="min-h-[200px] space-y-4">
											{formData.content.length === 0 ? (
												<div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
													<Type className="w-12 h-12 mx-auto mb-4 text-gray-400" />
													<p className="text-lg font-medium mb-2">
														No content yet
													</p>
													<p className="text-sm">
														Add a paragraph, title,
														list, or image to get
														started
													</p>
												</div>
											) : (
												formData.content.map(
													renderContentBlock
												)
											)}
										</div>
									</div>
								</div>
							) : (
								<div className="p-6">{renderPreview()}</div>
							)}
						</div>

						{/* Footer */}
						<div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => {
										setIsModalOpen(false);
										resetForm();
									}}
									className="px-6 py-2 cursor-pointer bg-main text-white font-medium rounded-lg hover:scale-105 transition-all">
									Cancel
								</button>
								<button
									onClick={handleSubmit}
									disabled={
										!formData.title ||
										!formData.description ||
										!formData.image ||
										!formData.category ||
										formData.content.length === 0
									}
									className="flex items-center gap-2 cursor-pointer px-6 py-2 font-medium bg-blue-600 hover:scale-105 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
									<Save className="w-4 h-4" />
									Publish Post
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(AddBlogModal);
