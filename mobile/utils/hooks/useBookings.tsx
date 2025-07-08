import { useEffect, useState } from "react";
import { getBookingsByUser } from "@/lib/booking";
import { Booking } from "@/types";

const useBookings = (userId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      try {
        const data = await getBookingsByUser(userId);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userId]);

  return { bookings };
};

export default useBookings;
