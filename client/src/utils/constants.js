import { IoMdHome } from "react-icons/io";
import {
	RiCustomerServiceFill,
	RiProductHuntFill,
} from "react-icons/ri";
import {
	FaBlog,
	FaQuestionCircle,
} from "react-icons/fa";
import path from "./path";

export const navigation = [
	{
		id: 1,
		value: "HOME",
		path: `/${path.HOME}`,
		icon: IoMdHome,
	},
	{
		id: 2,
		value: "PRODUCTS", 
		path: `/${path.PRODUCTS}`,
		icon: RiProductHuntFill,
	},
	{
		id: 3,
		value: "BLOGS",
		path: `/${path.BLOGS}`,
		icon: FaBlog,
	},
	{
		id: 4,
		value: "OUR SERVICES",
		path: `/${path.OUR_SERVICES}`,
		icon: RiCustomerServiceFill,
	},
	{
		id: 5,
		value: "FAQs",
		path: `/${path.FAQ}`,
		icon: FaQuestionCircle,
	},
];
