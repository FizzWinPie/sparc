import { View, Text, StyleSheet, Image } from "react-native";
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
  const snapPoints = useMemo(() => ["30%", "70%"], []);
  
  const onMarkerSelected = (item: Listing) => {
    setSelectedListing(item);
    bottomSheetRef.current?.snapToIndex(1);
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
                <Text>ID: {selectedListing.id}</Text>
                <Text>Lat: {selectedListing.latitude}</Text>
                <Text>Lng: {selectedListing.longitude}</Text>
                <Text>Price: ${selectedListing.price_per_hour}/kWh</Text>
                <Text>
                  Status: {selectedListing.is_active ? "Active" : "Inactive"}
                </Text>
              </>
            ) : (
              <Text>Select a marker</Text>
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
    fontSize: 18,
    marginBottom: 10,
    alignSelf: "center",
  },
});

export default ListingsMap;
