import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import MyCarCard from "./MyCarCard";
import dummyData from "@/constants/dummyData/dummy";
import Font from "@/constants/Font";
import SmallCard from "./SmallCard";
import Spacing from "@/constants/Spacing";
import BottomSheet from "@gorhom/bottom-sheet";
import { Listing } from "@/types";
import ListingBottomSheet from "./bottomSheet/ListingBottomSheet";

const HomeBottomScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%"], []);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const handleCardPress = (listing: Listing) => {
    setSelectedListing(listing);
    bottomSheetRef.current?.expand();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recommended for you</Text>
      <View style={styles.cardsRow}>
        <SmallCard
          listings={[dummyData.charger_listings[0]]}
          onPress={() => handleCardPress(dummyData.charger_listings[0])}
        />
        <SmallCard
          listings={[dummyData.charger_listings[1]]}
          onPress={() => handleCardPress(dummyData.charger_listings[1])}
        />
      </View>

      <Text style={[styles.sectionTitle, styles.bookingsTitle]}>
        Your bookings
      </Text>
      <View style={styles.cardsRow}>
        <MyCarCard bookings={[dummyData.bookings[0]]} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <ListingBottomSheet
          selectedListing={selectedListing}
          onChooseListing={() => bottomSheetRef.current?.close()}
        />
      </BottomSheet>
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
