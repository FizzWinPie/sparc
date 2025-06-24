import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const Loader = () => (
  <View style={styles.overlay}>
    <BlurView
      intensity={15}
      tint="light"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9,
      }}
    >
      <LottieView
        source={require("../assets/animation/loadingAnimation.json")}
        autoPlay
        loop
        style={{ width: width * 0.6, height: width * 0.6 }}
      />
    </BlurView>
  </View>
);

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
