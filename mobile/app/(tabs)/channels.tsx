import { Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";

type LastMessage = {
  text?: string;
};

type Conversation = {
  _id: string;
  listingName: string;
  imageUrl: string;
  lastMessage: LastMessage;
  updatedAt: string;
};

export default function channels() {
  const { user } = useUser();
  const userId = user?.id;
  const [data, setData] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId) return;
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/conversations/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        // console.log(data);
        setData(data);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      }
    };

    fetchConversations();
  }, [userId]);

  const openConversation = (
    conversationId: string,
    imageUrl: string,
    listingName: string
  ) => {
    router.push({
      pathname: "/chat",
      params: { conversationId, imageUrl, listingName },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          marginVertical: Spacing.sm,
          justifyContent: "space-between",
          borderBottomWidth: 0.3,
          borderBottomColor: "#ccc",
          paddingBottom: Spacing.lg,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            style={{
              fontFamily: "bold",
              fontSize: Spacing.md,
              color: Colors.accent,
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "bold",
            fontSize: Spacing.md,
            alignSelf: "center",
            color: Colors.secondary,
          }}
        >
          Channels
        </Text>
        <View />
      </View>

      {data.length > 0 ? (
        data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: Spacing.lg,
              marginVertical: Spacing.sm,
              justifyContent: "space-between",
              borderBottomWidth: 0.3,
              borderBottomColor: "#ccc",
              paddingBottom: Spacing.lg,
            }}
            onPress={() =>
              openConversation(item._id, item.imageUrl, item.listingName)
            }
          >
            <Image
              source={{
                uri:
                  item.imageUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Lykan_HyperSport.jpg/960px-Lykan_HyperSport.jpg",
              }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
            <View style={{ flex: 1, marginHorizontal: Spacing.md }}>
              <Text
                style={{
                  fontSize: Spacing.md,
                  fontWeight: "bold",
                  color: Colors.secondary,
                }}
              >
                {item.listingName || "Booking Conversation"}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: "gray",
                  marginTop: Spacing.xs,
                }}
              >
                {item.lastMessage?.text || "No messages yet"}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: Colors.accent,
              }}
            >
              {new Date(item.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }) || "10:30 AM"}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: Colors.secondary }}>
            No conversations found
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
