import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalButton({ amount }) {
  return (
    <PayPalScriptProvider options={{ 
      "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID 
    }}>
      <PayPalButtons
        createOrder={(data, actions) => actions.order.create({
          purchase_units: [{ amount: { value: amount }}]
        })}
        onApprove={async (data, actions) => {
          await actions.order.capture();
          // Handle successful payment
        }}
      />
    </PayPalScriptProvider>
  );
} 