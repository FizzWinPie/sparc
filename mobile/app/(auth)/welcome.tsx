import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";

const Onboarding = () => {
  return (
    <View style={{ backgroundColor: "white" }}>
      <Text>Onboarding to the app</Text>
      <TouchableOpacity
        onPress={() => {
          router.replace(`/(auth)/sign-in`);
        }}
      >
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.replace(`/(auth)/sign-up`);
        }}
      >
        <Text>Sign Up</Text>
        <Text style={{ fontFamily: "bold", fontSize: Font.lg, padding: Spacing.xxl }}>
          Welcome to the app
        </Text>
        <Text style={{ fontFamily: "regular", fontSize: Font.md, padding: Spacing.md }}>
          Choose your listing
        </Text>
        <Text style={{ fontFamily: "light", fontSize: Font.sm, padding: Spacing.sm }}>
          The best in town
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding;
