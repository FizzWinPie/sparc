import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Wallet from "@/components/Wallet";
import ProfileBar from "@/components/ProfileBar";
import { SignOutButton } from "@/components/SignOutButton";

const Profile = () => {
  return (
    <>
      {/* <ProfileBar /> */}
      <Wallet />
    </>
  );
};

export default Profile;
