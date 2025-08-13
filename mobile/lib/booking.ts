import { Booking } from "@/types/Booking";

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

export const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      throw new Error(`Failed to update booking ${bookingId}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to update Booking:", error);
    throw error;
  }
};

export const getBookingsByHost = async (hostId: string) => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bookings/host/${hostId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bookings/host/${hostId}`);

    if (!res.ok) throw new Error("Failed to fetch bookings for host");
    return await res.json();
  } catch (err) {
    console.error("Error fetching bookings for host:", err);
    throw err;
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to cancel booking");
    }

    return await res.json();
  } catch (error) {
    console.error("Cancel booking error:", error);
    throw error;
  }
};
