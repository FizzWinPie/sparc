import { View, Text, Image } from "react-native";
import React from "react";
import dummyData from "@/constants/dummyData/dummy";
import { Ionicons } from "@expo/vector-icons";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";

const ProfileBar = () => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: Spacing.md,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          padding: Spacing.md,
        }}
      >
        <Ionicons name="person-circle" style={{ fontSize: 40 }} />
        <Text style={{ fontFamily: "regular", }}>
          Welcome, {dummyData.users[0].name}!
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          padding: Spacing.md,
        }}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          style={{ fontSize: Font.lg }}
        />
        <Ionicons name="notifications-outline" style={{ fontSize: Font.lg }} />
      </View>
    </View>
  );
};

export default ProfileBar;
