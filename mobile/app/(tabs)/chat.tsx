import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import Message from "@/components/Message";
import Spacing from "@/constants/Spacing";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Image } from "react-native";

type ChatParams = {
  conversationId?: string;
  imageUrl?: string;
  listingName?: string;
};

export default function Chat() {
  const { conversationId, imageUrl, listingName } = useLocalSearchParams<ChatParams>();

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1, paddingBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          marginVertical: Spacing.sm,
          borderBottomWidth: 0.3,
          borderBottomColor: "#ccc",
          paddingBottom: Spacing.lg,
          gap: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            style={{ fontFamily: "bold", fontSize: Spacing.md, color: Colors.accent }}
          />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Image
            source={{
              uri:
                (typeof imageUrl === "string" && imageUrl.length > 0
                  ? imageUrl
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Lykan_HyperSport.jpg/960px-Lykan_HyperSport.jpg"),
            }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />

          <Text
            style={{
              fontFamily: "bold",
              fontSize: Spacing.md,
              alignSelf: "center",
              color: Colors.secondary,
            }}
          >
            {(typeof listingName === "string" && listingName) || "Booking"}
          </Text>
        </View>
      </View>

      <Message conversationId={String(conversationId || "")} />
    </SafeAreaView>
  );
}
