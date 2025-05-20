import { Newspaper } from "lucide-react";
import React from "react";

const BlogPosts = () => {
	return (
		<div>
			<div className="relative mb-6">
				<div className="relative">
					<div className="flex items-center">
						<div className="mr-3 bg-teal-600 p-1.5 rounded-md shadow-sm">
							<Newspaper
								className="text-white"
								size={18}
							/>
						</div>
						<h3 className="text-xl font-bold uppercase text-gray-800">
							Blog Posts
						</h3>
					</div>
					<div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
					<div className="absolute -bottom-3 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent"></div>
				</div>
			</div>
		</div>
	);
};

export default BlogPosts;
