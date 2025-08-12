import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { FontAwesome } from "@expo/vector-icons";

interface GoogleButtonProps {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
}

const GoogleButton = ({ origin, destination }: GoogleButtonProps) => {
  const openGoogleMaps = () => {
    if (!origin || !destination) return;
    
    const originStr = `${origin.latitude.toFixed(6)},${origin.longitude.toFixed(6)}`;
    const destinationStr = `${destination.latitude.toFixed(6)},${destination.longitude.toFixed(6)}`;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destinationStr}&travelmode=driving`;
    Linking.openURL(url).catch(err => console.error("Failed to open Google Maps:", err));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.navigationButton} onPress={openGoogleMaps}>
          <FontAwesome name="google" size={25} />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 85,
    right: 6,
    zIndex: 1,
  },
  navigationButton: {
    backgroundColor: "#fefefe",
    borderRadius: 30,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default GoogleButton;