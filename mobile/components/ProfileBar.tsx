import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import dummyData from "@/constants/dummyData/dummy";
import { Ionicons } from "@expo/vector-icons";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import { router, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";

const ProfileBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userSection} onPress={() => router.push("./profile")}>
        <Ionicons name="person-circle" style={styles.userIcon} color={Colors.secondary}/>
        <Text style={styles.welcomeText}>
          Welcome, {dummyData.users[0].name}!
        </Text>
      </TouchableOpacity>

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
    // marginHorizontal: Spacing.lg,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    // padding: Spacing.md,
  },
  userIcon: {
    fontSize: 40,
  },
  welcomeText: {
    fontFamily: "regular",
    color: Colors.secondary,
  },
  iconSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    // padding: Spacing.md,
  },
  icon: {
    fontSize: Font.lg,
  },
});

export default ProfileBar;
