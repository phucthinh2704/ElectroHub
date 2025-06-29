const path = {
	PUBLIC: "/",
	LOGIN: "login",
	HOME: "",
	ALL: "*",
	PRODUCTS_ALL: "products/all",
	PRODUCTS_DETAIL: "products/:category/:productId/:slug",
	PRODUCTS_CATEGORY: "products/:category",
	BLOGS: "blogs",
	DETAIL_BLOGS: "blogs/:blogId",
	OUR_SERVICES: "services",
	FAQ: "faqs",
	ACCOUNT: "account",
	FAVORITE: "favorites",
	FORGOT_PASSWORD: "forgot-password",
	RESET_PASSWORD: "reset-password/:token",
	CHECKOUT: "checkout",

	// Admin Routes
	ADMIN: "admin",
	DASHBOARD: "dashboard",
	MANAGE_USERS: "manage-users",
	MANAGE_PRODUCTS: "manage-products",
	MANAGE_ORDERS: "manage-orders",
	MANAGE_CATEGORIES: "manage-categories",
	CREATE_PRODUCT: "create-product",

	// Member Routes
	MEMBER: "member",
	PERSONAL: "personal",
	MY_CART: "my-cart",
	ORDER_HISTORY: "order-history",
	WISHLIST: "wishlist",
};

export default path;
