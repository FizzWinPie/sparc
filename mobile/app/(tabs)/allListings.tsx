import { Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignOutButton } from "@/components/SignOutButton";
import CarouselComponent from "@/components/CarouselComponent";

const allListings = () => {
  return (
    <SafeAreaView>
      <Text>Shows all possible ev listings in the form of a list</Text>
      <SignOutButton />
      <CarouselComponent />
    </SafeAreaView>
  );
};

export default allListings;
