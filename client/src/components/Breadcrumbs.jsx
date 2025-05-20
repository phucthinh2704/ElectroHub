import React from "react";
import { ChevronRight, Home, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import useBreadCrumbs from "use-react-router-breadcrumbs";

const Breadcrumbs = ({ title, category }) => {
	// Tạo routes cho breadcrumbs
	const routes = [
		{
			path: "/",
			breadcrumb: () => (
				<div className="flex items-center gap-1">
					<Home size={15} />
					<span>HOME</span>
				</div>
			),
		},
		{
			path: "/:category",
			breadcrumb: () => (
				<div className="flex items-center gap-1">
					<Tag size={15} />
					<span>{category}</span>
				</div>
			),
		},
		{ path: "/:category/:pid/:title", breadcrumb: title },
	];

	const breadcrumbs = useBreadCrumbs(routes);

	return (
		<nav
			aria-label="Breadcrumbs"
			className="py-3">
			<ol className="flex flex-wrap items-center gap-1 text-sm font-medium">
				{breadcrumbs
					.filter((el) => el.match.route)
					.map(({ match, breadcrumb }, index, self) => (
						<li
							key={match.pathname}
							className="flex items-center">
							<Link
								to={match.pathname}
								className={`flex items-center px-2 py-1 rounded-md transition-all duration-200 ${
									index === self.length - 1
										? "bg-blue-100 text-blue-700 font-semibold"
										: "hover:bg-gray-100 text-gray-600 hover:text-blue-600"
								}`}>
								{breadcrumb}
							</Link>

							{index !== self.length - 1 && (
								<ChevronRight
									size={16}
									className="mx-1 text-gray-400"
								/>
							)}
						</li>
					))}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
