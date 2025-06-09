import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Booking } from "@/types";

interface Props {
  bookings: Booking[];
}

const MyCarCard = ({ bookings }: Props) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    bookings.length > 0 ? bookings[0] : null
  );

  if (!selectedBooking) {
    return (
      <View>
        <Text>No booking available</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => console.log("My Car Card pressed")}
    >
      <View style={styles.leftSection}>
        <Text style={styles.idText}>
          ID {selectedBooking.id} <Text style={styles.onlineText}>ONLINE</Text>
        </Text>
        <Image
          source={require("../assets/images/ev_profile.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.modelText}>Tesla Model X</Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.rightContent}>
          <View style={styles.locationRow}>
            <Ionicons
              name="location-sharp"
              size={Font.md}
              color={Colors.accent}
            />
            <Text style={styles.locationText}>
              {selectedBooking.charger_listings_address.split(",")[0]}
            </Text>
          </View>
          <View style={styles.batteryRow}>
            <Ionicons name="flash-outline" size={42} color={Colors.accent} />
            <Text style={styles.batteryText}>
              {selectedBooking.battery_level ?? "72%"}
            </Text>
          </View>
          <TouchableOpacity style={styles.stopButton}>
            <Text style={styles.stopText}>STOP</Text>
          </TouchableOpacity>
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
    justifyContent: "space-between",
    gap: 2,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  leftSection: {
    flex: 1,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  idText: {
    color: "white",
    fontFamily: "bold",
  },
  onlineText: {
    color: Colors.accent,
  },
  image: {
    width: 140,
    height: 80,
  },
  modelText: {
    color: "white",
    fontFamily: "bold",
  },
  rightSection: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: Spacing.sm,
  },
  rightContent: {
    flex: 1,
    justifyContent: "space-between",
    gap: 10,
    paddingRight: Spacing.md,
  },
  locationRow: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 2,
    alignContent: "center",
  },
  locationText: {
    fontFamily: "regular",
    fontSize: Font.sm,
    color: "white",
  },
  batteryRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  batteryText: {
    fontFamily: "regular",
    color: "white",
    fontSize: 45,
  },
  stopButton: {
    alignSelf: "flex-end",
  },
  stopText: {
    fontFamily: "bold",
    color: Colors.accent,
    fontSize: Font.md,
  },
});

export default MyCarCard;
