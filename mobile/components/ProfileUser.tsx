import { View, Text } from "react-native";
import React from "react";
import Spacing from "@/constants/Spacing";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const ProfileUser = () => {
  return (
    <View
      style={{
        paddingHorizontal: Spacing.lg,
        alignContent: "center",
        alignItems: "center",
        // backgroundColor: Colors.blueVariations.aliceBlue
      }}
    >
      <Ionicons name="person-circle" color={Colors.secondary} size={100} />
      <Text
        style={{ fontFamily: "bold", fontSize: Spacing.md, marginBottom: 4 }}
      >
        Alice
      </Text>
      <Text style={{ fontFamily: "light", fontSize: 12 }}>
        alice27@gmail.com
      </Text>
    </View>
  );
};

export default ProfileUser;
