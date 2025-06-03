import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface Listing {
  id: string;
  latitude: number;
  longitude: number;
  price_per_hour: number;
  is_active: boolean;
  images: string;
}

interface Props {
  listings: Listing[];
}

const SmallCard = ({ listings }: Props) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(
    listings.length > 0 ? listings[0] : null
  );

  if (!selectedListing) {
    return (
      <View>
        <Text>No listing available</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignContent: "center",
        gap: 2,
        borderRadius: 10,
        backgroundColor: Colors.secondary,
        overflow: "hidden",
        
      }}
    >
      <Image
        // source={require("../assets/images/car1.jpg")}
        source={{ uri: selectedListing.images }}
        style={{
          width: 55,
          height: 80,
        }}
        resizeMode="cover"
      />
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          padding: Spacing.sm,
        }}
      >
        <View style={{ flex: 1, justifyContent: "space-between", gap: 10 }}>
          <Text
            style={{ fontFamily: "bold", fontSize: Font.md, color: "white" }}
          >
            {selectedListing.id}
          </Text>

          <View
            style={{ flexDirection: "row", gap: 2, alignContent: "center" }}
          >
            <Ionicons
              name="location-sharp"
              size={Font.md}
              color={Colors.accent}
            />
            <Text
              style={{
                fontFamily: "regular",
                fontSize: Font.sm,
                color: "white",
              }}
            >
              3 miles
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SmallCard;
