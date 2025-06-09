import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Listing } from "@/types";

interface Props {
  listings: Listing[];
  onPress?: () => void;
}

const SmallCard = ({ listings, onPress }: Props) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(
    listings.length > 0 ? listings[0] : null
  );

  if (!selectedListing) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/logo/splash-icon.png")}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>No Results...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: selectedListing.images }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {selectedListing.address.split(",")[0]}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons
              name="location-sharp"
              size={Font.md}
              color={Colors.accent}
            />
            <Text style={styles.locationText}>3 miles</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    gap: 2,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    overflow: "hidden",
    maxWidth: "50%",
  },
  image: {
    width: 60,
    height: 80,
  },
  infoContainer: {
    flexDirection: "column",
    flex: 1,
    padding: Spacing.sm,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    fontFamily: "regular",
    fontSize: Font.sm,
    color: "white",
  },
  locationContainer: {
    flexDirection: "row",
    gap: 2,
    alignContent: "center",
  },
  locationText: {
    fontFamily: "regular",
    fontSize: Font.sm,
    color: "white",
  },
  sheetTitle: {
    fontWeight: "bold",
    fontSize: Font.lg,
    marginBottom: 20,
    alignSelf: "center",
  },
  emptyState: {
    flex: 1,
  },
  emptyImage: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  emptyText: {
    fontSize: Font.md,
    alignSelf: "center",
    color: "white",
  },
});

export default SmallCard;
