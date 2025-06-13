import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { memo, useEffect } from "react";
import { apiCreateOrder } from "../../../apis";
import { useDispatch } from "react-redux";
import { getCurrent } from "../../../store/user/asyncAction";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// This value is from the props in the UI
const style = { layout: "vertical" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ currency, showSpinner, amount, payload }) => {
	const dispatchCurrent = useDispatch();
	const navigate = useNavigate();
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

	const handleSaveOrder = async () => {
		const orderData = {
			products: payload.products,
			total: payload.total * 25000,
			orderBy: payload.orderBy,
			status: "delivered",
			// status: "processing",
			address: payload.address,
		};
		const response = await apiCreateOrder(orderData);
		if (response.success) {
			dispatchCurrent(getCurrent());
			Swal.fire({
				icon: "success",
				title: "Order placed successfully!",
				text: "Your order has been placed successfully.",
				confirmButtonText: "Return to Home",
				allowOutsideClick: false,
				confirmButtonColor: "#d33",
			}).then(() => {
				navigate("/");
				// window.close();
			});
		}
	};
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
						if (response.status === "COMPLETED") {
							handleSaveOrder();
						}
					})
				}
			/>
		</>
	);
};

function Paypal({ amount, payload }) {
	return (
		<div style={{ maxWidth: "750px", minHeight: "200px" }}>
			<PayPalScriptProvider
				options={{
					clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
					components: "buttons",
					currency: "USD",
				}}>
				<ButtonWrapper
					payload={payload}
					showSpinner={false}
					currency={"USD"}
					amount={amount}
				/>
			</PayPalScriptProvider>
		</div>
	);
}

export default memo(Paypal);
