import { View, StyleSheet } from "react-native";
import React from "react";
import ListingsMap from "@/components/ListingsMap";
import dummyData from "@/constants/dummyData/dummy";
import ProfileBar from "@/components/ProfileBar";
import { BlurView } from "expo-blur";

const formattedListings = dummyData.charger_listings.map((listing) => ({
  id: listing.id,
  host_id: listing.host_id,
  charger_type: listing.charger_type,
  power_output_kw: listing.power_output_kw,
  connector_type: listing.connector_type,
  address: listing.address,
  latitude: listing.latitude,
  longitude: listing.longitude,
  availability_schedule: listing.availability_schedule,
  price_per_hour: listing.price_per_hour,
  min_price: listing.min_price,
  images: listing.images,
  is_active: listing.is_active,
  instructions: listing.instructions,
  created_at: listing.created_at,
  updated_at: listing.updated_at,
}));

const fullMap = () => {
  return (
    <View style={styles.container}>
      <ListingsMap listings={formattedListings} snapPoints={["45%", "70%"]} />
      <BlurView intensity={6} tint="light" style={styles.blurOverlay} />
      <View style={styles.profileBarWrapper}>
        <ProfileBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  blurOverlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 105,
    zIndex: 1,
  },

  profileBarWrapper: {
    position: "absolute",
    top: 20,
    width: "100%",
    zIndex: 1,
  },
});

export default fullMap;
