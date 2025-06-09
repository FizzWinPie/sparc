import { Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/SearchBar";
import { SignOutButton } from "@/components/SignOutButton";

const allListings = () => {
  return (
    <SafeAreaView>
      <Text>Shows all possible ev listings in the form of a list</Text>
      <SearchBar />
      <SignOutButton />
    </SafeAreaView>
  );
};

export default allListings;
