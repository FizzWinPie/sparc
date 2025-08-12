import { View, Text, StyleSheet } from "react-native";
import { useMemo, useRef, useState } from "react";
import MyCarCard from "./MyCarCard";
import Font from "@/constants/Font";
import SmallCard from "./SmallCard";
import Spacing from "@/constants/Spacing";
import BottomSheet from "@gorhom/bottom-sheet";
import { Listing } from "@/types";
import ListingBottomSheet from "./bottomSheet/ListingBottomSheet";
import { createBooking } from "@/lib/booking";
import { useUser } from "@clerk/clerk-expo";
import useListings from "@/utils/hooks/useListings";
import useBookings from "@/utils/hooks/useBookings";
import { useStripePayment } from "@/utils/hooks/useStripePayment";
import { createTransaction } from "@/lib/transaction";

const HomeBottomScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%"], []);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const { user } = useUser();
  const { listings } = useListings();
  const { bookings } = useBookings(user?.id);
  const [loading, setLoading] = useState(false);
  const { initializePaymentSheet, openPaymentSheet } = useStripePayment(
    user?.fullName ?? "N/A"
  );

  const handleCardPress = async (listing: Listing) => {
    setSelectedListing(listing);
    bottomSheetRef.current?.expand();
    await initializePaymentSheet(listing.price_per_hour * 100);
  };

  const bookingStartTime = new Date().toISOString();
  const bookingEndTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const selectedBatteryLevel = "50%";

  const handleChooseListing = async () => {
    if (!selectedListing || !user) return;

    bottomSheetRef.current?.close();

    const success = await openPaymentSheet();
    if (!success) return;

    setLoading(true);
    const bookingResult = await createBooking({
      charger_listings_id: selectedListing._id,
      charger_listings_address: selectedListing.address,
      host_id: selectedListing.host_id,
      ev_owner_id: user.id,
      start_time: bookingStartTime,
      end_time: bookingEndTime,
      total_cost: selectedListing.price_per_hour,
      status: "approved",
      payment_status: "paid",
      rating_by_driver: null,
      rating_by_host: null,
      battery_level: selectedBatteryLevel,
      images: selectedListing.images,
    });

    const transactionResult = await createTransaction(
      user.id,
      selectedListing.host_id,
      bookingResult._id,
      selectedListing.price_per_hour
    );
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recommended for you</Text>
      <View style={styles.cardsRow}>
        <SmallCard
          listings={[listings[0]]}
          onPress={() => handleCardPress(listings[0])}
        />
        <SmallCard
          listings={[listings[1]]}
          onPress={() => handleCardPress(listings[1])}
        />
      </View>

      <Text style={[styles.sectionTitle, styles.bookingsTitle]}>
        Your bookings
      </Text>
      <View style={styles.cardsRow}>
        <MyCarCard bookings={[bookings[0]]} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <ListingBottomSheet
          selectedListing={selectedListing}
          onChooseListing={handleChooseListing}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: "bold",
    fontSize: Font.md,
  },
  bookingsTitle: {
    marginTop: 15,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
});

export default HomeBottomScreen;
