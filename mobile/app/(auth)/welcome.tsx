import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image, Button, ImageBackground } from "react-native";
import React from "react";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import dummyData from "@/constants/dummyData/dummy.js";

const Onboarding = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/evcharging.jpg")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome to PlugPorch</Text>
        <Button
          color="green"
          title="Sign In"
          onPress={() => {
            router.replace(`/(auth)/sign-in`);
          } } />
          <Button
          title="New User? Sign Up Now"
          onPress={() => {
            router.replace(`/(auth)/sign-up`);
          } } />
      </SafeAreaView>
    </ImageBackground>
  );  
}
 
const styles = StyleSheet.create({
  background:{
    flex: 1,
    justifyContent: "center",
  },
  loginButton:{
    backgroundColor: "blue:",
  },
  container: {  
    flex: 1,
    justifyContent: "center", 
  },
  title: {
    fontSize: Font.xlg,
    fontFamily: "bold",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Font.lg,
    fontFamily: "bold",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
});

export default Onboarding;
