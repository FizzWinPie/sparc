import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Listing } from "@/types";
import Constants from "@/constants/Constants";
import useRatings from "@/utils/hooks/useRatings";
import Stars from "./Stars";

interface Props {
  listings: Listing[];
  onPress?: () => void;
}

const SmallCard = ({ listings, onPress }: Props) => {
  const selectedListing = listings.length > 0 ? listings[0] : null;
  const rating = useRatings(selectedListing?.host_id ?? "");

  if (!selectedListing) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require("../assets/images/no-result.png")}
          style={styles.emptyImage}
          resizeMode="cover"
        />
        <Text style={styles.emptyTitle}>No Listings...</Text>
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

          {/* Address title */}
          <Text style={styles.title}>
            {selectedListing.address.split(",")[0]}
          </Text>
          
          {/* Stars */}
          <Stars rating = {rating} style = {styles.starsContainer} />

          {/* Location */}
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
  emptyContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: Constants.borderRadius,
    backgroundColor: "white",
    maxWidth: "50%",
    borderWidth: 2,
    borderColor: Colors.blueVariations.aliceBlue,
    borderStyle: "dotted",
    height: 85,
  },
  emptyImage: {
    width: 70,
    height: 70,
    resizeMode: "contain"
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
    justifyContent: "flex-start",
    gap: 5,
  },
  title: {
    fontFamily: "regular",
    fontSize: Font.sm,
    color: "white",
  },
  emptyTitle: {
    fontFamily: "regular",
    color: Colors.basic.blue,
    fontSize: Font.xs,
  },
  locationContainer: {
    flexDirection: "row",
    gap: 2,
    alignContent: "center",
    marginTop: 3,
  },
  locationText: {
    fontFamily: "regular",
    fontSize: Font.ssm,
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
  emptyText: {
    fontSize: Font.md,
    alignSelf: "center",
    color: "white",
  },
  starsContainer: {
    marginTop: 1,
  },

});

export default SmallCard;
