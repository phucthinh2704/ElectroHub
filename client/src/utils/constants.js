import path from "./path";
import { Heart, Home, ShoppingCart, User, MailQuestionIcon, Rss, ContactRound } from "lucide-react";

export const navigation = [
	{ id: 1, path: `/${path.HOME}`, value: "Home", icon: Home },
	{ id: 2, path: `/${path.PRODUCTS}`, value: "Products", icon: ShoppingCart },
	{ id: 3, path: `/${path.BLOGS}`, value: "Blogs", icon: Rss },
	{ id: 4, path: `/${path.OUR_SERVICES}`, value: "Our Services", icon: ContactRound },
	{ id: 5, path: `/${path.FAVORITE}`, value: "Favorites", icon: Heart },
	{ id: 6, path: `/${path.FAQ}`, value: "FAQs", icon: MailQuestionIcon },
	{ id: 7, path: `/${path.ACCOUNT}`, value: "Account", icon: User },
];

