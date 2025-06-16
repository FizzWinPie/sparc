import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import { Booking } from "@/types";

interface BookingBottomSheetProps {
  selectedBooking: Booking | null;
  onChooseBooking: () => void;
}

const BookingBottomSheet = ({
  selectedBooking,
  onChooseBooking,
}: BookingBottomSheetProps) => {
  return (
    <BottomSheetView style={styles.contentContainer}>
      {selectedBooking ? (
        <>
          <Text style={styles.sheetTitle}>Booking Details</Text>
          <View style={styles.bookingHeader}>
            <Image
              source={require("../../assets/images/logo/splash-icon.png")}
              style={styles.bookingImage}
            />
            <View style={styles.bookingInfo}>
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingId}>
                  {selectedBooking.charger_listings_address.split(",")[0]}
                </Text>
                <View style={styles.locationContainer}>
                  <Ionicons
                    name="location-sharp"
                    size={Font.md}
                    color={Colors.accent}
                  />
                  <Text style={styles.locationText}>
                    Battery: {selectedBooking.battery_level}
                  </Text>
                </View>
                <Text style={styles.statusText}>
                  {new Date(selectedBooking.start_time).toLocaleString()} -{" "}
                  {new Date(selectedBooking.end_time).toLocaleTimeString()}
                </Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  ${selectedBooking.total_cost}
                </Text>
                <Text style={styles.statusText}>
                  Status: {selectedBooking.status}
                </Text>
                <Text style={styles.statusText}>
                  Payment: {selectedBooking.payment_status}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onChooseBooking}>
              <Text style={styles.buttonText}>View Invoice</Text>
            </TouchableOpacity>
            <View style={styles.calendarButton}>
              <Ionicons name="calendar" size={25} color={Colors.accent} />
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.sheetTitle}>No Booking Selected</Text>
          <Image
            source={require("../../assets/images/no-result.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No Booking Data Available</Text>
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
  bookingHeader: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  bookingImage: {
    borderRadius: 20,
    width: 60,
    height: 60,
  },
  bookingInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  bookingDetails: {
    flex: 1,
    justifyContent: "space-between",
    gap: 10,
  },
  bookingId: {
    fontFamily: "bold",
    fontSize: Font.md,
  },
  locationContainer: {
    flexDirection: "row",
    alignContent: "center",
    gap: 2,
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
});

export default BookingBottomSheet;
