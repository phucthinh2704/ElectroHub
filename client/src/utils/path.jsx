const path = {
	PUBLIC: "/",
	LOGIN: "login",
	HOME: "",
	ALL: "*",
	PRODUCTS_CATEGORY: "products/:category",
	PRODUCTS_DETAIL: "products/:category/:productId/:slug",
	BLOGS: "blogs",
	OUR_SERVICES: "services",
	FAQ: "faqs",
	ACCOUNT: "account",
	FAVORITE: "favorites",
	FORGOT_PASSWORD: "forgot-password",
	RESET_PASSWORD: "reset-password/:token",

	// Admin Routes
	ADMIN: "admin",
	DASHBOARD: "dashboard",
	MANAGE_USERS: "manage-users",
	MANAGE_PRODUCTS: "manage-products",
	MANAGE_ORDERS: "manage-orders",
	CREATE_PRODUCT: "create-product",

	// Member Routes
	MEMBER: "member",
	PERSONAL: "personal",
};

export default path;
