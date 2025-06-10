import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";

// This value is from the props in the UI
const style = { layout: "vertical" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ currency, showSpinner, amount }) => {
	const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
	useEffect(() => {
		dispatch({
			type: "resetOptions",
			value: {
				...options,
				currency: currency,
				intent: "capture",
			},
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currency, showSpinner]);
	return (
		<>
			{showSpinner && isPending && <div className="spinner" />}
			<PayPalButtons
				style={style}
				disabled={false}
				forceReRender={[style, currency, amount]}
				fundingSource={undefined}
				createOrder={(data, actions) =>
					actions.order
						.create({
							purchase_units: [
								{
									amount: {
										currency_code: currency,
										value: amount,
									},
								},
							],
						})
						.then((orderId) => orderId)
				}
				onApprove={(data, actions) =>
					actions.order.capture().then(async (response) => {
						console.log(response);
						// if(response.status === "COMPLETED") {
						//     console.log(response);
						// }
					})
				}
			/>
		</>
	);
};

export default function Paypal({ amount }) {
	return (
		<div style={{ maxWidth: "750px", minHeight: "200px" }}>
			<PayPalScriptProvider
				options={{
					clientId: "test",
					components: "buttons",
					currency: "USD",
				}}>
				<ButtonWrapper showSpinner={false} currency={"USD"} amount={amount} />
			</PayPalScriptProvider>
		</div>
	);
}
