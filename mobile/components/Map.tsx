import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";

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
  const onMarkerSelected = (item: Listing) => {
    console.log(item);
    // pass the id to find info for listing and a) make separate listing page or b) do a modal/uberclone scrollup thing
  };

  return (
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
    </View>
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

  // map: {
  //   ...StyleSheet.absoluteFillObject,
  // },

  marker: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
      transform: [{ scale: 1.0 }], // overall scale
  },

  markerTextWrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
    borderRadius: 12,
    // shadowColor: "black",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 1,
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
});

export default ListingsMap;
