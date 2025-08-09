import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import { Listing } from "@/types";
import useRatings from "@/utils/hooks/useRatings";
import Stars from "../Stars"
import { router } from "expo-router";


interface ListingBottomSheetProps {
  selectedListing: Listing | null;
  onChooseListing: () => void;
}

const ListingBottomSheet = ({
  selectedListing,
  onChooseListing,
}: ListingBottomSheetProps) => {
  const rating = useRatings(selectedListing?.host_id ?? "");

  return (
    <BottomSheetView style={styles.contentContainer}>
      {selectedListing ? (
        <>
          <Text style={styles.sheetTitle}>Select Listing</Text>
          <View style={styles.listingHeader}>
            <Image
              source={require("../../assets/images/logo/splash-icon.png")}
              style={styles.listingImage}
            />
            <View style={styles.listingInfo}>
              <View style={styles.listingDetails}>

                {/* Address */}
                <Text style={styles.listingId}>
                  {selectedListing.address.split(",")[0]}
                </Text>

                {/* Stars */}
                {/* <Stars rating = {rating} size={14} style = {styles.starsContainer} /> */}
                <Stars rating={rating} size={14} style={styles.starsContainer} onPress={() => {
                  console.log("Stars pressed");
                  if (!selectedListing) return;
                  router.push({
                    pathname: "../reviews/[hostId]",
                    params: { hostId: selectedListing.host_id },
                  });
                }}/>
                
                {/* Location */}
                <View style={styles.locationContainer}>
                  <Ionicons
                    name="location-sharp"
                    size={Font.md}
                    color={Colors.accent}
                  />
                  <Text style={styles.locationText}>3 miles away</Text>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  ${selectedListing.price_per_hour}{" "}
                  <Text style={styles.priceUnit}>/kWh</Text>
                </Text>
                <View style={styles.statusContainer}>
                  <Ionicons
                    name="flash-sharp"
                    size={Font.md}
                    style={{
                      color: selectedListing.is_active
                        ? Colors.success
                        : Colors.danger,
                    }}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: selectedListing.is_active
                          ? Colors.success
                          : Colors.danger,
                      },
                    ]}
                  >
                    {selectedListing.is_active ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                !selectedListing.is_active && styles.disabledButton,
              ]}
              onPress={onChooseListing}
              disabled={!selectedListing.is_active}
            >
              <Text
                style={[
                  styles.buttonText,
                  !selectedListing.is_active && styles.disabledButtonText,
                ]}
              >
                {selectedListing.is_active ? "Choose Listing" : "Unavailable"}
              </Text>
            </TouchableOpacity>
            <View style={styles.calendarButton}>
              <Ionicons name="calendar" size={25} color={Colors.accent} />
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.sheetTitle}>Select Listing</Text>
          <Image
            source={require("../../assets/images/no-result.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No Results...</Text>
        </View>
      )}
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: Spacing.lg,
    gap: 10,
  },
  sheetTitle: {
    fontWeight: "bold",
    fontSize: Font.lg,
    marginBottom: 20,
    alignSelf: "center",
  },
  listingHeader: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  listingImage: {
    borderRadius: 20,
    width: 60,
    height: 60,
  },
  listingInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  listingDetails: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 4,
  },
  listingId: {
    fontFamily: "bold",
    fontSize: Font.md,
  },
  locationContainer: {
    flexDirection: "row",
    alignContent: "center",
    gap: 2,
    marginTop: 2,
  },
  locationText: {
    fontFamily: "light",
    fontSize: Font.sm,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceText: {
    fontFamily: "bold",
    fontSize: Font.md,
  },
  priceUnit: {
    fontFamily: "light",
    fontSize: Font.sm,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    marginTop: 4,
  },
  statusText: {
    fontFamily: "regular",
    fontSize: Font.sm,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: Font.md,
    fontFamily: "bold",
  },
  disabledButtonText: {
    color: "gray",
  },
  calendarButton: {
    padding: Spacing.md,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  emptyState: {
    gap: 15,
  },
  emptyImage: {
    width: 170,
    height: 100,
    alignSelf: "center",
  },
  emptyText: {
    fontFamily: "bold",
    fontSize: Font.md,
    alignSelf: "center",
  },
  starsContainer: {
    marginTop: 1,
  },
});

export default ListingBottomSheet;
