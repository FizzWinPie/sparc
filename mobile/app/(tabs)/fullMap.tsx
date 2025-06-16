import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import ListingsMap from "@/components/ListingsMap";
import dummyData from "@/constants/dummyData/dummy";
import ProfileBar from "@/components/ProfileBar";
import { BlurView } from "expo-blur";
import Spacing from "@/constants/Spacing";
import SearchBar from "@/components/SearchBar";

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ListingsMap listings={formattedListings} snapPoints={["45%", "70%"]} />
        <View style={styles.searchBar}>
          <SearchBar />
        </View>
        <BlurView intensity={6} tint="light" style={styles.blurOverlay} />
        <View style={styles.profileBarWrapper}>
          <ProfileBar />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  searchBar: {
    zIndex: 2,
    position: "absolute",
    top: 80,
    width: "95%",
    alignSelf: "center",
  },

  profileBarWrapper: {
    position: "absolute",
    top: 60,
    paddingHorizontal: Spacing.lg,
    width: "100%",
    zIndex: 1,
  },
});

export default fullMap;
