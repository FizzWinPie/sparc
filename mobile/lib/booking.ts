export const getBookings = async() => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  } catch (error) {
    console.error("Failed to get Bookings:", error);
    throw error;
  }
}

export const getBookingsByUser = async(userId: string) => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bookings/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  } catch (error) {
    console.error("Failed to get Bookings:", error);
    throw error;
  }
}

export const createBooking = async (bookingData: any) => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    return await res.json();
  } catch (error) {
    console.error("Failed to create Booking:", error);
    throw error;
  }
};
