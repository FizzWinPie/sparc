export const createTransaction = async (
  payer: string,
  receiver: string,
  bookingId: string,
  amount: number
) => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payer,
          receiver,
          bookingId,
          amount,
        }),
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Failed to register transaction details:", error);
    throw error;
  }
};
