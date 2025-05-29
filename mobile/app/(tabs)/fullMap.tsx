import { View, StyleSheet } from "react-native";
import React from "react";
import ListingsMap from "@/components/Map";
import dummyData from "@/constants/dummyData/dummy";
import ProfileBar from "@/components/ProfileBar";
import { BlurView } from "expo-blur";

const formattedListings = dummyData.charger_listings.map((listing) => ({
  id: listing.id,
  latitude: listing.latitude,
  longitude: listing.longitude,
  price_per_hour: listing.price_per_hour,
  is_active: listing.is_active,
}));

const fullMap = () => {
  return (
    <View style={styles.container}>
      <ListingsMap listings={formattedListings} />
      <BlurView intensity={12} tint="light" style={styles.blurOverlay} />
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
    zIndex: 1
  },

  profileBarWrapper: {
    position: 'absolute',
    top: 20,
    width: '100%',
    zIndex: 1,
  },
});


export default fullMap;
