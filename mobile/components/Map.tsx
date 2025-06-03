import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Spacing from "@/constants/Spacing";

interface Listing {
  id: string;
  latitude: number;
  longitude: number;
  price_per_hour: number;
  is_active: boolean;
}

interface Props {
  listings: Listing[];
}

const INITIAL_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

const ListingsMap = ({ listings }: Props) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["45%", "70%"], []);

  const onMarkerSelected = (item: Listing) => {
    setSelectedListing(item);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleChooseListing = () => {
    console.log("Chosen listing -> payment");
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton
          initialRegion={INITIAL_REGION}
          scrollEnabled={true}
          showsPointsOfInterest={false}
          customMapStyle={noLabelsMapStyle}
        >
          {listings.map((item) => (
            <Marker
              key={item.id}
              onPress={() => onMarkerSelected(item)}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
            >
              <View style={styles.marker}>
                <Image
                  source={require("../assets/images/marker.png")}
                  style={styles.markerImage}
                />
                <View style={styles.markerTextWrapper}>
                  <Ionicons
                    name="flash-sharp"
                    size={11}
                    style={{
                      color: item.is_active ? Colors.success : Colors.danger,
                    }}
                  />
                  <Text style={styles.markerPrice}>${item.price_per_hour}</Text>
                  <Text style={styles.markerUnit}>/kWh</Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          enableOverDrag={true}
        >
          <BottomSheetView style={styles.contentContainer}>
            {selectedListing ? (
              <>
                <Text style={styles.sheetTitle}>Select Listing</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "flex-start",
                    gap: 10,
                    marginBottom: 10,
                    // borderBlockColor: "black",
                    // borderWidth: 3,
                    // borderRadius: 10
                  }}
                >
                  <Image
                    source={require("../assets/images/logo/splash-icon.png")}
                    style={{ borderRadius: 20, width: 60, height: 60 }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flex: 1,
                      paddingHorizontal: Spacing.sm,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <Text style={{ fontFamily: "bold", fontSize: Font.md }}>
                        {selectedListing.id}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          gap: 2,
                        }}
                      >
                        <Ionicons
                          name="location-sharp"
                          size={Font.md}
                          color={Colors.accent}
                        />
                        <Text
                          style={{ fontFamily: "light", fontSize: Font.sm }}
                        >
                          3 miles away
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text style={{ fontFamily: "bold", fontSize: Font.md }}>
                        ${selectedListing.price_per_hour} {""}
                        <Text
                          style={{ fontFamily: "light", fontSize: Font.sm }}
                        >
                          /kWh
                        </Text>
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          marginTop: 4,
                        }}
                      >
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
                          style={{
                            fontFamily: "regular",
                            fontSize: Font.sm,
                            color: selectedListing.is_active
                              ? Colors.success
                              : Colors.danger,
                          }}
                        >
                          {selectedListing.is_active ? "Active" : "Inactive"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.button,
                      !selectedListing.is_active && { backgroundColor: "#ccc" },
                    ]}
                    onPress={handleChooseListing}
                    disabled={!selectedListing.is_active}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        !selectedListing.is_active && { color: "gray" },
                      ]}
                    >
                      {selectedListing.is_active
                        ? "Choose Listing"
                        : "Unavailable"}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      padding: Spacing.md,
                      borderRadius: 10,
                      backgroundColor: Colors.primary,
                    }}
                  >
                    <Ionicons name="calendar" size={25} color={Colors.accent} />
                  </View>
                </View>
              </>
            ) : (
              <View style={{ gap: 15 }}>
                <Text style={styles.sheetTitle}>Select Listing</Text>
                <Image
                  source={require("../assets/images/no-result.png")}
                  style={{ width: 170, height: 100, alignSelf: "center" }}
                />
                <Text
                  style={{
                    fontFamily: "bold",
                    fontSize: Font.md,
                    alignSelf: "center",
                  }}
                >
                  No Results...
                </Text>
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const noLabelsMapStyle = [
  {
    featureType: "administrative",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    transform: [{ scale: 1.0 }],
  },
  markerTextWrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
    borderRadius: 12,
    borderBottomWidth: 0.25,
    borderBottomColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
  },
  markerImage: {
    width: 26,
    height: 26,
    resizeMode: "cover",
  },
  markerPrice: {
    fontSize: Font.xs,
    fontWeight: "bold",
  },
  markerUnit: {
    fontSize: Font.xxs,
  },
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
  button: {
    flex: 1,
    backgroundColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: Font.md,
    fontFamily: "bold",
  },
});

export default ListingsMap;
