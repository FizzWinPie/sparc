import { View, Text, Image, Touchable, TouchableOpacity } from "react-native";
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

const MyCarCard = ({ listings }: Props) => {
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
        justifyContent: "space-between",
        gap: 2,
        borderRadius: 10,
        backgroundColor: Colors.secondary,
        // overflow: "hidden",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingLeft: Spacing.md,
          paddingVertical: Spacing.sm,
        }}
      >
        <Text style={{ color: "white", fontFamily: "bold" }}>
          ID 45672 <Text style={{ color: Colors.accent }}>ONLINE</Text>
        </Text>
        <Image
          source={require("../assets/images/ev_profile.png")}
          style={{
            width: 140,
            height: 80,
          }}
          resizeMode="contain"
        />
        <Text style={{ color: "white", fontFamily: "bold" }}>
          Tesla Model X
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: Spacing.sm,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            gap: 10,
            paddingRight: Spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              gap: 2,
              alignContent: "center",
            }}
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
              {selectedListing.id}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Ionicons name="flash-outline" size={42} color={Colors.accent} />
            <Text
              style={{ fontFamily: "regular", color: "white", fontSize: 45 }}
            >
              72%
            </Text>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              // paddingRight: Spacing.md,
              // backgroundColor: "rgba(42, 157, 143, 0.35)",
              // borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "bold",
                color: Colors.accent,
                fontSize: Font.md,
              }}
            >
              STOP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MyCarCard;
