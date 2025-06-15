import { memo } from "react";
import formatMoney from "../../../utils/formatMoney";
import { Star, Heart, Eye, ShoppingCart } from "lucide-react";

const ProductListItem = ({ product }) => (
	<div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex">
		<div className="relative w-48 h-32">
			<img
				src={product.thumb}
				alt={product.title}
				className="w-full h-full object-cover"
			/>
			{product.discount > 0 && (
				<span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
					-{product.discount}%
				</span>
			)}
		</div>

		<div className="flex-1 p-4">
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
							{product.brand}
						</span>
						<span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
							{product.category}
						</span>
					</div>

					<h3 className="font-semibold text-gray-800 mb-2">
						{product.title}
					</h3>

					<p className="text-sm text-gray-600 mb-2">
						{product.description.join(" • ")}
					</p>

					<div className="flex items-center gap-4 mb-2">
						<div className="flex items-center">
							<Star
								size={14}
								className="text-yellow-400 fill-current"
							/>
							<span className="text-sm text-gray-600 ml-1">
								{product.totalRatings} ({product.ratingCount})
							</span>
						</div>
						<span className="text-sm text-gray-500">
							Sold: {product.sold}
						</span>
						<span
							className={`text-sm ${
								product.stock > 10
									? "text-green-600"
									: "text-orange-600"
							}`}>
							Stock: {product.stock}
						</span>
					</div>
				</div>

				<div className="text-right">
					<div className="mb-2">
						<div className="text-lg font-bold text-red-600">
							{formatMoney(product.price)}
						</div>
						{product.discount > 0 && (
							<div className="text-sm text-gray-500 line-through">
								{formatMoney(product.originalPrice)}
							</div>
						)}
					</div>

					<div className="flex gap-2">
						<button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
							<Heart size={16} />
						</button>
						<button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
							<Eye size={16} />
						</button>
						<button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center gap-1">
							<ShoppingCart size={16} />
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
);
export default memo(ProductListItem);
