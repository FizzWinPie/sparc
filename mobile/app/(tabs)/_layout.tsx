import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Image, View } from "react-native";

const Dot = () => (
  <View
    style={{
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.accent,
      marginTop: 2,
      alignSelf: "center",
    }}
  />
);

const MainLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarStyle: {
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
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
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
            <View style={{ alignItems: "center" }}>
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
            <View style={{ alignItems: "center" }}>
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
            <View style={{ alignItems: "center" }}>
              <Ionicons name="list-outline" size={size} color={color} />
              {focused && <Dot />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
