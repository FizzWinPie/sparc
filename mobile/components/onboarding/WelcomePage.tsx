import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import dummyData from "@/constants/dummyData/dummy.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "@/constants/Constants";
import { Ionicons } from "@expo/vector-icons";

const WelcomePage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/onboard/onboard1.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.welcome}>
          Welcome to{" "}
          <Text style={styles.brand}>
            plug
            <Text style={styles.brandHighlight}>Porch</Text>
          </Text>
        </Text>
        <Text>Let's get started!</Text>
        <Ionicons name="chevron-down" color={Colors.accent} style={{fontFamily: "bold"}}/>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => router.replace(`/(auth)/sign-in`)}
          style={[styles.button, { backgroundColor: Colors.secondary }]}
        >
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace(`/(auth)/sign-up`)}
          style={[
            styles.button,
            { backgroundColor: Colors.accent, marginTop: Spacing.md },
          ]}
        >
          <Text style={styles.signUpLine}>
            <Text style={styles.newUserText}>New User?</Text>
            <Text style={styles.signUpText}> SIGN UP NOW</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-evenly",
    alignItems: "center",
    // padding: Spacing.lg,
  },
  header: {
    alignItems: "center",
  },
  image: {
    height: 220,
    width: 400,
    marginBottom: Spacing.md,
  },
  welcome: {
    fontSize: Spacing.lg,
    fontFamily: "regular",
    textAlign: "center",
    marginBottom: 4,
  },
  brand: {
    fontFamily: "bold",
    color: Colors.accent,
  },
  brandHighlight: {
    color: Colors.secondary,
    fontFamily: "bold",
  },
  buttons: {
    alignItems: "center",
  },
  button: {
    width: 250,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Constants.borderRadius,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "bold",
  },
  signUpLine: {
    textAlign: "center",
  },
  newUserText: {
    color: "#D3D3D3",
    fontFamily: "bold",
  },
  signUpText: {
    color: "white",
    fontFamily: "bold",
  },
});

export default WelcomePage;
