import { View, Text, StyleSheet } from "react-native";
import React, { useMemo, useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";

interface Listing {
  id: string;
  latitude: number;
  longitude: number;
  price_per_hour: number;
  is_active: boolean;
}

interface Props {
  listing: Listing[];
}

const ListingsBottomSheet = ({ listing }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1} // Start expanded to middle snap point
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "white" }}
      handleIndicatorStyle={{ backgroundColor: Colors.primary }}
    >
      <View style={styles.content}>
        {listing[0] && (
          <View key={listing[0].id} style={styles.listingItem}>
            <Text style={styles.text}>ID: {listing[0].id}</Text>
            <Text style={styles.text}>Price: ${listing[0].price_per_hour}/hr</Text>
            <Text style={styles.text}>
              Status: {listing[0].is_active ? "Available" : "Unavailable"}
            </Text>
          </View>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  listingItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "gray",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ListingsBottomSheet;