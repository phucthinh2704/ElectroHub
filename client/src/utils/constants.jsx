import {
	Award,
	CheckCircle,
	CirclePlus,
	ContactRound,
	CreditCard,
	Headphones,
	Home,
	HomeIcon,
	MailQuestionIcon,
	MapPin,
	Rss,
	Settings,
	Shield,
	ShoppingCart,
	Truck,
	Users,
	Wrench,
	Zap,
} from "lucide-react";
import {
	AiOutlineHeart,
	AiOutlineHistory,
	AiOutlineHome,
	AiOutlineShoppingCart,
	AiOutlineUser,
} from "react-icons/ai";
import icons from "./icons";
import path from "./path";
const { AiOutlineDashboard, MdGroups, TbBrandProducthunt, RiBillLine } = icons;

export const navigation = [
	{ id: 1, path: `/${path.HOME}`, value: "Home", icon: Home },
	{
		id: 2,
		path: `/${path.PRODUCTS_ALL}`,
		value: "Products",
		icon: ShoppingCart,
	},
	{ id: 3, path: `/${path.BLOGS}`, value: "Blogs", icon: Rss },
	{
		id: 4,
		path: `/${path.OUR_SERVICES}`,
		value: "Our Services",
		icon: ContactRound,
	},
	{ id: 5, path: `/${path.FAQ}`, value: "FAQs", icon: MailQuestionIcon },
];

export const colors = [
	"red",
	"blue",
	"green",
	"black",
	"white",
	"yellow",
	"gray",
	"gold",
	"pink",
	"brown",
];

export const priceRanges = [
	{ label: "Under 2.000.000", min: 0, max: 2000000 },
	{ label: "2.000.000 - 5.000.000", min: 2000000, max: 5000000 },
	{ label: "5.000.000 - 10.000.000", min: 5000000, max: 10000000 },
	{ label: "10.000.000 - 15.000.000", min: 10000000, max: 15000000 },
	{ label: "15.000.000 - 30.000.000", min: 15000000, max: 30000000 },
	{ label: "30.000.000 - 50.000.000", min: 30000000, max: 50000000 },
	{ label: "Above 50.000.000", min: 50000000, max: null },
];

export const ratingLabels = {
	1: "Very Poor",
	2: "Poor",
	3: "Average",
	4: "Good",
	5: "Excellent",
};

export const stepsPayment = [
	{ id: 1, title: "Shipping", icon: MapPin },
	{ id: 2, title: "Payment", icon: CreditCard },
	{ id: 3, title: "Review", icon: CheckCircle },
];

export const services = [
	{
		icon: <Truck className="w-8 h-8" />,
		title: "Free Delivery",
		description:
			"Fast and reliable delivery to your doorstep within 24-48 hours for all orders above $50.",
		features: [
			"Same-day delivery available",
			"Real-time tracking",
			"Secure packaging",
		],
		color: "from-blue-400 to-cyan-400",
	},
	{
		icon: <Shield className="w-8 h-8" />,
		title: "Extended Warranty",
		description:
			"Comprehensive warranty coverage for all electronics with up to 3 years protection.",
		features: [
			"Accident protection",
			"Free replacements",
			"24/7 claim support",
		],
		color: "from-purple-400 to-pink-400",
	},
	{
		icon: <Wrench className="w-8 h-8" />,
		title: "Tech Support",
		description:
			"Expert technical assistance and troubleshooting for all your electronic devices.",
		features: [
			"Remote assistance",
			"On-site repairs",
			"Setup & installation",
		],
		color: "from-green-400 to-emerald-400",
	},
	{
		icon: <Headphones className="w-8 h-8" />,
		title: "24/7 Customer Care",
		description:
			"Round-the-clock customer support to assist you with any queries or concerns.",
		features: ["Live chat support", "Phone assistance", "Email support"],
		color: "from-orange-400 to-red-400",
	},
	{
		icon: <Zap className="w-8 h-8" />,
		title: "Device Setup",
		description:
			"Professional installation and setup services for complex electronic equipment.",
		features: ["Home installation", "Data transfer", "Configuration"],
		color: "from-yellow-400 to-orange-400",
	},
	{
		icon: <Award className="w-8 h-8" />,
		title: "Premium Care",
		description:
			"Exclusive membership program with special discounts and priority services.",
		features: ["Priority support", "Exclusive deals", "Early access"],
		color: "from-indigo-400 to-purple-400",
	},
];

export const categoriesBlog = [
	"Web Development",
	"Mobile Development",
	"AI & Machine Learning",
	"DevOps",
	"UI/UX Design",
	"Cybersecurity",
	"Data Science",
	"Cloud Computing",
];

export const categoriesFAQ = [
	{ id: "all", name: "All Questions", icon: Users },
	{ id: "orders", name: "Orders & Shipping", icon: Truck },
	{ id: "products", name: "Products", icon: Zap },
	{ id: "payment", name: "Payment", icon: CreditCard },
	{ id: "warranty", name: "Warranty", icon: Shield },
	{ id: "support", name: "Support", icon: Headphones },
];

export const faqData = [
	{
		id: 1,
		category: "orders",
		question: "How long does shipping take?",
		answer: "Standard shipping takes 3-7 business days within the continental US. Express shipping (1-3 days) and overnight shipping options are also available. International shipping times vary by destination, typically 7-21 business days.",
	},
	{
		id: 2,
		category: "orders",
		question: "Do you offer free shipping?",
		answer: "Yes! We offer free standard shipping on orders over $50 within the US. For orders under $50, shipping costs $5.99. Premium members enjoy free shipping on all orders regardless of amount.",
	},
	{
		id: 3,
		category: "orders",
		question: "Can I track my order?",
		answer: "Absolutely! Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order in real-time through your account dashboard or our mobile app.",
	},
	{
		id: 4,
		category: "products",
		question: "Are all products authentic and new?",
		answer: "Yes, we guarantee that all products sold on Electro Hub Digital are 100% authentic and brand new. We work directly with manufacturers and authorized distributors to ensure product authenticity.",
	},
	{
		id: 5,
		category: "products",
		question: "Do you test products before shipping?",
		answer: "While we don't test every individual item, all our products undergo quality control checks. Our suppliers perform rigorous testing, and we have a comprehensive quality assurance process in place.",
	},
	{
		id: 6,
		category: "products",
		question: "What if I receive a defective product?",
		answer: "If you receive a defective product, contact us within 48 hours of delivery. We'll arrange a free return and send you a replacement immediately. No questions asked - your satisfaction is our priority.",
	},
	{
		id: 7,
		category: "payment",
		question: "What payment methods do you accept?",
		answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. We also offer financing options through Klarna and Affirm for eligible purchases.",
	},
	{
		id: 8,
		category: "payment",
		question: "Is my payment information secure?",
		answer: "Absolutely. We use industry-standard SSL encryption and are PCI DSS compliant. Your payment information is never stored on our servers and is processed through secure, encrypted channels.",
	},
	{
		id: 9,
		category: "payment",
		question: "Can I get a refund?",
		answer: "Yes, we offer a 30-day money-back guarantee on most items. Products must be in original condition with all accessories and packaging. Refunds are processed within 5-7 business days after we receive the returned item.",
	},
	{
		id: 10,
		category: "warranty",
		question: "What warranty do you provide?",
		answer: "All products come with manufacturer warranties, which vary by brand and product type. Additionally, we offer extended warranty options for added peace of mind. Warranty details are clearly listed on each product page.",
	},
	{
		id: 11,
		category: "warranty",
		question: "How do I claim warranty service?",
		answer: 'To claim warranty service, log into your account and navigate to your order history. Select the item and click "Warranty Claim." You can also contact our support team directly with your order number and product details.',
	},
	{
		id: 12,
		category: "support",
		question: "How can I contact customer support?",
		answer: "Our customer support team is available 24/7 via live chat, email (support@electrohub.com), or phone (1-800-ELECTRO). We also have a comprehensive help center with tutorials and troubleshooting guides.",
	},
	{
		id: 13,
		category: "support",
		question: "Do you offer technical support?",
		answer: "Yes! Our certified technicians provide free technical support for all products purchased from us. This includes setup assistance, troubleshooting, and product education. Support is available via phone, chat, or video call.",
	},
];

export const adminSidebar = [
	{
		id: 1,
		type: "SINGLE",
		text: "DASHBOARD",
		icon: <AiOutlineDashboard size={20} />,
		path: `/${path.ADMIN}/${path.DASHBOARD}`,
	},
	{
		id: 2,
		type: "SINGLE",
		text: "MANAGE USERS",
		icon: <MdGroups size={20} />,
		path: `/${path.ADMIN}/${path.MANAGE_USERS}`,
	},
	{
		id: 3,
		type: "SINGLE",
		text: "MANAGE ORDERS",
		icon: <RiBillLine size={20} />,
		path: `/${path.ADMIN}/${path.MANAGE_ORDERS}`,
	},
	{
		id: 4,
		type: "SINGLE",
		text: "MANAGE CATEGORIES",
		icon: <RiBillLine size={20} />,
		path: `/${path.ADMIN}/${path.MANAGE_CATEGORIES}`,
	},
	{
		id: 5,
		type: "PARENT",
		text: "MANAGE PRODUCTS",
		icon: <TbBrandProducthunt size={20} />,
		submenu: [
			{
				text: "CREATE PRODUCT",
				path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
				icon: <CirclePlus size={20} />,
			},
			{
				text: "MANAGE PRODUCT",
				path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
				icon: <Settings size={20} />,
			},
		],
	},
	{
		id: 6,
		type: "SINGLE",
		text: "HOME PAGE",
		icon: <HomeIcon size={20} />,
		path: `/${path.HOME}`,
	},
];
export const memberSidebar = [
	{
		id: 1,
		type: "SINGLE",
		path: `/${path.HOME}`,
		text: "Home",
		icon: <AiOutlineHome size={20} />,
	},
	{
		id: 2,
		type: "SINGLE",
		path: `/${path.MEMBER}/${path.PERSONAL}`,
		text: "Personal Information",
		icon: <AiOutlineUser size={20} />,
	},
	{
		id: 3,
		type: "SINGLE",
		path: `/${path.MEMBER}/${path.MY_CART}`,
		text: "My Cart",
		icon: <AiOutlineShoppingCart size={20} />,
	},
	{
		id: 4,
		type: "SINGLE",
		path: `/${path.MEMBER}/${path.WISHLIST}`,
		text: "Wishlist",
		icon: <AiOutlineHeart size={20} />,
	},
	{
		id: 5,
		type: "SINGLE",
		path: `/${path.MEMBER}/${path.ORDER_HISTORY}`,
		text: "Order History",
		icon: <AiOutlineHistory size={20} />,
	},
];

export const tabsDetail = [
	{
	  id: 1,
	  title: "DESCRIPTION",
	  icon: (
		 <svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor">
			<path
			  fillRule="evenodd"
			  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
			  clipRule="evenodd"
			/>
		 </svg>
	  ),
	  content: `Technology: GSM / HSPA / LTE
		Dimensions: 153.8 x 75.5 x 7.6 mm
		Weight: 154 g
		Display: IPS LCD 5.5 inches
		Resolution: 720 x 1280
		OS: Android OS, v6.0 (Marshmallow)
		Chipset: Octa-core
		CPU: Octa-core
		Internal: 32 GB, 4 GB RAM
		Camera: 13MB - 20 MP`,
	},
	{
	  id: 2,
	  title: "WARRANTY",
	  icon: (
		 <svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor">
			<path
			  fillRule="evenodd"
			  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
			  clipRule="evenodd"
			/>
		 </svg>
	  ),
	  content: `Warranty Information
			LIMITED WARRANTIES
			Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
 
			Frames Used In Upholstered and Leather Products
			Limited Lifetime Warranty
			A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
	},
	{
	  id: 3,
	  title: "DELIVERY",
	  icon: (
		 <svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor">
			<path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
			<path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
		 </svg>
	  ),
	  content: `# 📦 Purchasing & Delivery
 
	  ## 📏 Before Making Your Purchase
 
	  Before completing your purchase, you should:
	  - Measure the area where you plan to place the furniture
	  - Measure doorways and hallways through which the furniture will pass to reach its final destination
 
	  ---
 
	  ## 🚛 Delivery Service
 
	  ### 📅 Delivery Scheduling
	  - Customers can choose the next available delivery day that fits their schedule
	  - Delivery time frame will be provided by Shopify Shop to route stops efficiently
	  - Customers cannot choose specific times
	  - You will be notified in advance of your scheduled time frame
  
	  ### 🏠 Delivery Preparation
 
	  Please ensure:
	  - ✅ Remove existing furniture, pictures, mirrors, accessories, etc. to prevent damage
	  - ✅ Clear the area where you want your new furniture placed
	  - ✅ Remove any items that may obstruct the delivery team's pathway
 
	  ### 🔧 Services Included
 
	  Shopify Shop will:
	  - 🚚 Deliver to your location
	  - 🔨 Assemble and set up your new furniture
	  - 🗑️ Remove all packing materials from your home
 
	  ---
 
	  ## 📞 Support
 
	  If you have any questions about delivery, please contact us before your scheduled delivery date.`,
	},
	{
	  id: 4,
	  title: "PAYMENT",
	  icon: (
		 <svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor">
			<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
			<path
			  fillRule="evenodd"
			  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
			  clipRule="evenodd"
			/>
		 </svg>
	  ),
	  content: `We accept various payment methods for your convenience, including major credit cards (Visa, Mastercard, American Express, Discover), debit cards with Visa or Mastercard, and digital wallets like PayPal, Apple Pay, Google Pay, and Samsung Pay.

		Online payments are secured with SSL encryption and PCI DSS compliance. Cash payments are accepted in-store and for local cash-on-delivery orders, with exact change preferred.

		We offer installment plans and buy-now-pay-later options for eligible purchases, subject to credit approval. Payments are processed immediately upon order confirmation, with card charges appearing on statements within 1-3 business days.

		Refunds are issued to the original payment method within 5-7 business days after we receive and inspect returned items. Large or special orders may require a deposit, with the remaining balance due before delivery or pickup, which will be communicated clearly.`,
	},
 ];
