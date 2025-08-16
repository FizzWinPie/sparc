import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Image, View, StyleSheet } from "react-native";

const Dot = () => <View style={styles.dot} />;

const MainLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Image
                source={require("../../assets/images/marker.png")}
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
              {focused && <Dot />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="fullMap"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="map-outline" size={size} color={color} />
              {focused && <Dot />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="host"
        options={{
          title: "Host",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="flash-outline" size={size} color={color} />
              {focused && <Dot />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="allListings"
        options={{
          title: "Listings",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="list-outline" size={size} color={color} />
              {focused && <Dot />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      {/* ↓ Add this: notifications lives in (tabs) but is hidden from tab bar */}
      <Tabs.Screen
        name="notifications"
        options={{ href: null, title: "Notifications" }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginTop: 2,
    alignSelf: "center",
  },
  tabBar: {
    position: "absolute",
    marginHorizontal: 70,
    marginBottom: 50,
    backgroundColor: Colors.primary,
    height: 40,
    width: 240,
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  iconContainer: {
    alignItems: "center",
  },
});

export default MainLayout;
