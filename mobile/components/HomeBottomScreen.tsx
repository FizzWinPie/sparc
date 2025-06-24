import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MyCarCard from "./MyCarCard";
import dummyData from "@/constants/dummyData/dummy";
import Font from "@/constants/Font";
import SmallCard from "./SmallCard";
import Spacing from "@/constants/Spacing";
import BottomSheet from "@gorhom/bottom-sheet";
import { Booking, Listing } from "@/types";
import ListingBottomSheet from "./bottomSheet/ListingBottomSheet";
import { getListings } from "@/lib/listing";
import { createBooking, getBookings, getBookingsByUser } from "@/lib/booking";
import { useUser } from "@clerk/clerk-expo";
import { useLoading } from "@/utils/LoadingContext";

const HomeBottomScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%"], []);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useUser();

  const handleCardPress = (listing: Listing) => {
    setSelectedListing(listing);
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByUser(user.id);
        setBookings(data);
      } catch (error) {
        console.error("Error getting bookings:", error);
      }
    };
    fetchBookings();
  }, []);

    const { setLoading } = useLoading();
  
    const bookingStartTime = new Date().toISOString();
    const bookingEndTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const calculatedCost = selectedListing?.price_per_hour || 10;
    const selectedBatteryLevel = "50%";
    
    const handleChooseListing = () => {
      bottomSheetRef.current?.close();
  
      Alert.alert(
        "Confirm Booking",
        "Are you sure you want to book this listing?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            style: "default",
            onPress: async () => {
              if (!selectedListing || !user) return;
              setLoading(true);
              const res = await createBooking({
                charger_listings_id: selectedListing._id,
                charger_listings_address: selectedListing.address,
                host_id: selectedListing.host_id,
                ev_owner_id: user.id,
                start_time: bookingStartTime,
                end_time: bookingEndTime,
                total_cost: calculatedCost,
                status: "pending",
                payment_status: "unpaid",
                rating_by_driver: null,
                rating_by_host: null,
                battery_level: selectedBatteryLevel,
                images: selectedListing.images,
              });
              console.log(res);
              setLoading(false);
            },
          },
        ]
      );
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
          onChooseListing={() => handleChooseListing()}
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
