import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import { Listing } from "@/types";

type Props = {
  listing: Listing;
  onPress: (listing: Listing) => void;
};

const ListingCard = ({ listing, onPress }: Props) => {
  const addressParts = listing.address.split(",").slice(0, 2).map(s => s.trim());
  const formattedAddress = addressParts.join(" ");
  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  return (
    <View style={styles.shadowWrapper}>
      <TouchableOpacity style={styles.box} onPress={() => onPress(listing)}>
        <Image source={{ uri: listing.images }} style={styles.image} />
        <View style={styles.middleContent}>
          <Text style={styles.addressText}>
            {truncateText(formattedAddress, 15)}
          </Text>
          <View style={styles.bottomRow}>
            <View style={styles.bottomLeft}>
              <Ionicons name="location-sharp" size={14} color={Colors.accent} />
              <Text style={styles.metaText}>3 miles away</Text>
            </View>
            <View style={styles.bottomRight}>
              <Image
                source={require("../assets/images/level2a.png")}
                style={{ width: 16, height: 16 }}
              />
              <Text style={styles.metaText}>Type 2</Text>
            </View>
          </View>
        </View>
        <Text style={styles.priceText}>
          ${listing.price_per_hour}
          <Text style={styles.unitText}> /kWh</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 10,
  },
  box: {
    flexDirection: "row",
    backgroundColor: Colors.basic.white,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 6,
  },
  middleContent: {
    flex: 1,
    justifyContent: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  bottomRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  addressText: {
    fontFamily: "bold",
    fontSize: Font.md,
    padding: Spacing.sm,
  },
  metaText: {
    fontSize: Font.sm,
    color: Colors.secondary,
  },
  priceText: {
    fontFamily: "bold",
    fontSize: Font.md,
    padding: Spacing.md,
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
  },
  unitText: {
    fontFamily: "light",
    fontSize: Font.sm,
  },
});

export default ListingCard;
