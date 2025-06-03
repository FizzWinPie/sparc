import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfileBar from "@/components/ProfileBar";
import dummyData from "@/constants/dummyData/dummy";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import MapScreen from "@/components/MapScreen";
import SmallCard from "@/components/SmallCard";
import MyCarCard from "@/components/MyCarCard";

interface Listing {
  id: string;
  latitude: number;
  longitude: number;
  price_per_hour: number;
  is_active: boolean;
}

const INITIAL_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
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

const Home = () => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const onMarkerSelected = (item: Listing) => {
    setSelectedListing(item);
    console.log("Marker selected:", item.id);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.map}>
        <BlurView intensity={5} tint="light" style={styles.blurOverlay} />
        <View style={styles.profileBarWrapper}>
          <ProfileBar />
        </View>
        <MapScreen />
      </View>
      <View style={{ height: "50%" }}>
        <View style={{ flex: 1, padding: Spacing.lg }}>
          <Text
            style={{
              fontFamily: "bold",
              fontSize: Font.md,
            }}
          >
            Recommended for you
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 10,
              gap: 10,
            }}
          >
            <SmallCard listings={[dummyData.charger_listings[0]]} />
            <SmallCard listings={[dummyData.charger_listings[1]]} />
          </View>

          <Text
            style={{
              fontFamily: "bold",
              fontSize: Font.md,
              marginTop: 15,
            }}
          >
            Your bookings
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <MyCarCard listings={[dummyData.charger_listings[0]]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
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
  marker: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    transform: [{ scale: 1.0 }],
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

export default Home;
