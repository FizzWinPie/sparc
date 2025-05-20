import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

const Onboarding = () => {
  return (
    <View>
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
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding;
