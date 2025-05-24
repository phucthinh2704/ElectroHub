import path from "./path";
import {
	Heart,
	Home,
	ShoppingCart,
	User,
	MailQuestionIcon,
	Rss,
	ContactRound,
} from "lucide-react";

export const navigation = [
	{ id: 1, path: `/${path.HOME}`, value: "Home", icon: Home },
	{ id: 2, path: `/${path.PRODUCTS_CATEGORY}`, value: "Products", icon: ShoppingCart },
	{ id: 3, path: `/${path.BLOGS}`, value: "Blogs", icon: Rss },
	{
		id: 4,
		path: `/${path.OUR_SERVICES}`,
		value: "Our Services",
		icon: ContactRound,
	},
	{ id: 5, path: `/${path.FAVORITE}`, value: "Favorites", icon: Heart },
	{ id: 6, path: `/${path.FAQ}`, value: "FAQs", icon: MailQuestionIcon },
	{ id: 7, path: `/${path.ACCOUNT}`, value: "Account", icon: User },
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
	{ label: "2.000.000 - 4.000.000", min: 2000000, max: 4000000 },
	{ label: "4.000.000 - 6.000.000", min: 4000000, max: 6000000 },
	{ label: "6.000.000 - 8.000.000", min: 6000000, max: 8000000 },
	{ label: "8.000.000 - 10.000.000", min: 8000000, max: 10000000 },
	{ label: "Over 10.000.000", min: 10000000, max: null }
];

export const tabs = [
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
		content: `Purchasing & Delivery
			  Before you make your purchase, it's helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
			  Picking up at the store
			  Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser's responsibility to make sure the correct items are picked up and in good condition.
			  Delivery
			  Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
			  In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
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
		content: `Purchasing & Delivery
			  Before you make your purchase, it's helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
			  Picking up at the store
			  Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser's responsibility to make sure the correct items are picked up and in good condition.
			  Delivery
			  Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
			  In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
	},
];
