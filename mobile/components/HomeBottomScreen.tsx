import { View, Text, StyleSheet } from "react-native";
import React from "react";
import MyCarCard from "./MyCarCard";
import dummyData from "@/constants/dummyData/dummy";
import Font from "@/constants/Font";
import SmallCard from "./SmallCard";
import Spacing from "@/constants/Spacing";

const HomeBottomScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Recommended for you
      </Text>
      <View style={styles.cardsRow}>
        <SmallCard listings={[dummyData.charger_listings[0]]} />
        <SmallCard listings={[dummyData.charger_listings[1]]} />
      </View> 

      <Text style={[styles.sectionTitle, styles.bookingsTitle]}>
        Your bookings
      </Text>
      <View style={styles.cardsRow}>
        <MyCarCard bookings={[dummyData.bookings[0]]} />
      </View>
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
