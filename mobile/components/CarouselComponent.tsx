import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import Constants from "@/constants/Constants";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ListingBottomSheet from "./bottomSheet/ListingBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { Booking, Listing } from "@/types";
import BookingBottomSheet from "./bottomSheet/BookingBottomSheet";
import dummyData from "@/constants/dummyData/dummy";

const bookingData = dummyData.bookings;

function CarouselComponent() {
  const progress = useSharedValue<number>(0);

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ["85%"], []);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null
  );
  const handleCardPress = (booking: Booking) => {
    setSelectedBooking(booking);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <View>
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
          source={{
            uri: item.images,
          }}
          style={{ width: "100%", height: "100%" }}
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "80%", gap: 4 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: Constants.fontSize.md,
                  fontWeight: "bold",
                }}
              >
                {item.charger_listings_address.split(",")[0]}
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: Constants.fontSize.sm,
                }}
              >
                Battery: {item.battery_level}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 6,
                  alignItems: "center",
                }}
                onPress={() => handleCardPress(item)}
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
                  }}
                >
                  View More
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: Constants.colors.accent,
                fontSize: 16,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              {item.status.toUpperCase()}
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
        data={bookingData}
        height={258}
        loop={bookingData.length > 1}
        pagingEnabled={bookingData.length > 1}
        snapEnabled={bookingData.length > 1}
        width={393}
        style={{ width: 393 }}
        // mode="vertical-stack"
        // mode="horizontal-stack"
        modeConfig={{
          stackInterval: 10,
          opacityInterval: 0.9,
        }}
        onProgressChange={progress}
        renderItem={renderItem}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BookingBottomSheet
          selectedBooking={selectedBooking}
          onChooseBooking={() => bottomSheetRef.current?.close()}
        />
      </BottomSheet>
    </View>
  );
}

export default CarouselComponent;
