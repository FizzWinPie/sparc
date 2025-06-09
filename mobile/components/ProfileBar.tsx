import { View, Text, StyleSheet } from "react-native";
import React from "react";
import dummyData from "@/constants/dummyData/dummy";
import { Ionicons } from "@expo/vector-icons";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";

const ProfileBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <Ionicons name="person-circle" style={styles.userIcon} />
        <Text style={styles.welcomeText}>
          Welcome, {dummyData.users[0].name}!
        </Text>
      </View>

      <View style={styles.iconSection}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          style={styles.icon}
        />
        <Ionicons name="notifications-outline" style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: Spacing.md,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: Spacing.md,
  },
  userIcon: {
    fontSize: 40,
  },
  welcomeText: {
    fontFamily: "regular",
  },
  iconSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: Spacing.md,
  },
  icon: {
    fontSize: Font.lg,
  },
});

export default ProfileBar;
