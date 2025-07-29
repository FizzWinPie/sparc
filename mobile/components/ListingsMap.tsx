import { View, Text, StyleSheet, Image } from "react-native";
import React, { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ListingBottomSheet from "./bottomSheet/ListingBottomSheet";
import { Listing } from "@/types/Listing";
import { useUser } from "@clerk/clerk-expo";
import { createBooking } from "@/lib/booking";
import { useStripePayment } from "@/utils/hooks/useStripePayment";
import useBookings from "@/utils/hooks/useBookings";
import { useLoading } from "@/utils/LoadingContext";

interface Props {
  listings: Listing[];
  snapPoints?: string[];
}

const INITIAL_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

const ListingsMap = ({ listings, snapPoints = ["50%"] }: Props) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { user } = useUser();
  const { setLoading } = useLoading();
  const { bookings } = useBookings(user?.id);

  const { initializePaymentSheet, openPaymentSheet } = useStripePayment(
    user?.fullName ?? "N/A"
  );

  const onMarkerSelected = async (item: Listing) => {
    setSelectedListing(item);
    bottomSheetRef.current?.snapToIndex(0);
    await initializePaymentSheet(item.price_per_hour * 100);
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

    const res = await createBooking({
      charger_listings_id: selectedListing._id,
      charger_listings_address: selectedListing.address,
      host_id: selectedListing.host_id,
      ev_owner_id: user.id,
      start_time: bookingStartTime,
      end_time: bookingEndTime,
      total_cost: selectedListing.price_per_hour,
      status: "pending", //need to change
      payment_status: "paid",
      rating_by_driver: null,
      rating_by_host: null,
      battery_level: selectedBatteryLevel,
      images: selectedListing.images,
    });

    console.log("Booking result:", res);
    setLoading(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton
          initialRegion={INITIAL_REGION}
          scrollEnabled
          showsPointsOfInterest={false}
          customMapStyle={noLabelsMapStyle}
        >
          {listings.map((item) => (
            <Marker
              key={item._id}
              onPress={() => onMarkerSelected(item)}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
            >
              <View style={styles.marker}>
                <Image
                  source={require("../assets/images/marker.png")}
                  style={styles.markerImage}
                />
                <View style={styles.markerTextWrapper}>
                  <Ionicons
                    name="flash-sharp"
                    size={11}
                    color={item.is_active ? Colors.success : Colors.danger}
                  />
                  <Text style={styles.markerPrice}>${item.price_per_hour}</Text>
                  <Text style={styles.markerUnit}>/kWh</Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>

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
    </GestureHandlerRootView>
  );
};

const noLabelsMapStyle = [
  {
    featureType: "administrative",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    transform: [{ scale: 1 }],
  },
  markerTextWrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
    borderRadius: 12,
    borderBottomWidth: 0.25,
    borderBottomColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
  },
  markerImage: {
    width: 26,
    height: 26,
    resizeMode: "cover",
  },
  markerPrice: {
    fontSize: Font.xs,
    fontWeight: "bold",
  },
  markerUnit: {
    fontSize: Font.xxs,
  },
});

export default ListingsMap;
