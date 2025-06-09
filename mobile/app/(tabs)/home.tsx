import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import ProfileBar from "@/components/ProfileBar";
import dummyData from "@/constants/dummyData/dummy";
import ListingsMap from "@/components/ListingsMap";
import HomeBottomScreen from "@/components/HomeBottomScreen";
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

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <BlurView intensity={5} tint="light" style={styles.blurOverlay} />
        <View style={styles.profileBarWrapper}>
          <ProfileBar />
        </View>
        <View style={{ zIndex: 2, position: "absolute", top: 80, width: "95%", alignSelf: "center" }}>
          <SearchBar />
        </View>
        <ListingsMap listings={formattedListings} snapPoints={["60%"]} />
      </View>

      <View style={styles.bottomScreen}>
        <HomeBottomScreen />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: "50%",
  },
  bottomScreen: {
    height: "50%",
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

export default Home;
