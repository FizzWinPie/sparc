import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import Constants from "@/constants/Constants";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const imageData = [
  "https://qmerit.com/wp-content/uploads/2024/05/Qmerit-home-ev-charging-station-cost.jpg",
  "https://www.brickunderground.com/sites/default/files/2023-09/iStock-1344638615.jpg",
];

function CarouselComponent() {
  const progress = useSharedValue<number>(0);

  const renderItem = ({ item }: { item: string }) => (
    <View
      style={{
        width: "85%",
        height: "100%",
        borderRadius: Constants.borderRadius,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Image
        source={{ uri: item }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 48, 73, 0.92)",
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.md,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ width: "80%", gap: 4 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: Constants.fontSize.md,
                fontWeight: "bold",
              }}
            >
              Casa Blanca
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: Constants.fontSize.sm,
                fontWeight: "400",
              }}
            >
              1/2 plugs available
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 6,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="arrow-forward-outline"
                color={Colors.accent}
                size={15}
              />
              <Text
                style={{
                  color: Colors.accent,
                  fontSize: Constants.fontSize.sm,
                  fontWeight: "regular",
                }}
              >
                View
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                color: Constants.colors.accent,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              ONLINE
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View id="carousel-component">
      <Carousel
        autoPlayInterval={2000}
        data={imageData}
        height={258}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={393}
        style={{ width: 393 }}
        mode="horizontal-stack"
        modeConfig={{
          stackInterval: 10,
          opacityInterval: 0.9,
        }}
        onProgressChange={progress}
        renderItem={renderItem}
      />
    </View>
  );
}

export default CarouselComponent;
