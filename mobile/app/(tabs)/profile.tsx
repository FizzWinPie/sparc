import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Wallet from "@/components/Wallet";
import ProfileBar from "@/components/ProfileBar";
import { SignOutButton } from "@/components/SignOutButton";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import ProfileUser from "@/components/ProfileUser";

const Profile = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: Spacing.lg, marginVertical: Spacing.sm}}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" style={{fontFamily: "bold", fontSize: Spacing.md, color: Colors.secondary}}/>
        </TouchableOpacity>
        <SignOutButton />
      </View>
      <ProfileUser />
      <Wallet />
    </SafeAreaView>
  );
};

export default Profile;
