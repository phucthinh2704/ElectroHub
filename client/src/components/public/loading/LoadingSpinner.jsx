import { memo } from "react";

const LoadingSpinner = () => (
	<div className="flex flex-col gap-4 items-center justify-center min-h-screen min-w-full">
		<div className="animate-spin rounded-full h-18 w-18 border-b-4 border-blue-500"></div>
		<span className="ml-3 text-gray-600">Loading...</span>
	</div>
);
export default memo(LoadingSpinner);
