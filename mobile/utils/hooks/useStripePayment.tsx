import { useStripe } from "@stripe/stripe-react-native";
import { Alert } from "react-native";

export function useStripePayment(userName: string = "N/A") {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async (amount: number) => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/payment-sheet`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      }
    );
    return response.json();
  };

  const initializePaymentSheet = async (amount: number) => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams(amount);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "plugPorch",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: { name: userName },
    });

    if (error) {
      Alert.alert("Error initializing payment", error.message);
      return false;
    }

    return true;
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code !== "Canceled") {
        Alert.alert(`Error code: ${error.code}`, error.message);
      }
      return false;
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      return true;
    }
  };

  return { initializePaymentSheet, openPaymentSheet };
}
