import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { FontAwesome } from "@expo/vector-icons";

interface AppleButtonProps {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  isBooked: boolean;
}

const AppleButton = ({ origin, destination, isBooked }: AppleButtonProps) => {
  const openAppleMaps = () => {
    if (!origin || !destination) return;
    
    const originStr = `${origin.latitude.toFixed(6)},${origin.longitude.toFixed(6)}`;
    const destinationStr = `${destination.latitude.toFixed(6)},${destination.longitude.toFixed(6)}`;
    
    const url = `http://maps.apple.com/?daddr=${originStr},${destinationStr}&dirflg=d`;
    console.log()
    Linking.openURL(url).catch(err => console.error("Failed to open Apple Maps:", err));
  };

  if (!isBooked) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.navigationButton} onPress={openAppleMaps}>
          <FontAwesome name="apple" size={25} />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 55,
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

export default AppleButton;