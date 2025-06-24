import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import ListingsMap from "@/components/ListingsMap";
import ProfileBar from "@/components/ProfileBar";
import { BlurView } from "expo-blur";
import Spacing from "@/constants/Spacing";
import SearchBar from "@/components/SearchBar";
import { Listing } from "@/types";
import { getListings } from "@/lib/listing";

const fullMap = () => {
  const [listings, setListings] = useState<Listing[]>([]);

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ListingsMap listings={listings} snapPoints={["45%", "70%"]} />
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
