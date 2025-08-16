import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import Constants from "@/constants/Constants";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

type Request = {
  id: string;
  name: string;
  ev_owner_id: string;
  date: string;
  time: string;
  price: string;
  place: string;
  imageUrl: string;
};

type Props = {
  request: Request;
  onAccept?: () => void;
  onDecline?: () => void;
};

const RequestCard: React.FC<Props> = ({ request: r, onAccept, onDecline }) => {
  const { user } = useUser();
  const openConversation = (
    conversationId: string,
    imageUrl: string,
    listingName: string
  ) => {
    router.push({
      pathname: "/chat",
      params: {
        conversationId,
        imageUrl,
        listingName,
      },
    });
  };

  const sendMessage = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/conversations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user1: user?.id,
            user2: r.ev_owner_id,
            imageUrl: r.imageUrl,
            listingName: r.place.split(",")[0],
          }),
        }
      );
      if (!res.ok) {
        console.error("Failed to create conversation", await res.text());
        return;
      }

      const conversation = await res.json();
      openConversation(conversation._id, r.imageUrl, r.place.split(",")[0]);
    } catch (error) {
      console.error("Failed to create conversation", error);
    }
  };

  return (
    <View
      style={{
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: Constants.borderRadius,
        borderRadius: Constants.borderRadius,
      }}
    >
      <View
        key={r.id}
        style={{
          flexDirection: "row",
          borderWidth: 1,
          borderColor: Colors.blueVariations.aliceBlue,
          borderRadius: Constants.borderRadius,
          padding: Spacing.md,
          minHeight: 180,
          backgroundColor: Colors.primary,
          opacity: 0.97,
        }}
      >
        <View
          style={{ flex: 1, width: "50%", justifyContent: "space-between" }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Image
              source={{ uri: r.imageUrl || "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" }}
              style={{ width: 35, height: 35, borderRadius: 17.5, marginRight: 8 }}
            />
            <Text
              style={{
                fontWeight: "bold",
                color: Colors.secondary,
              }}
            >
              {r.name}
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons name="calendar" size={20} color={Colors.accent} />
              <Text
                style={{
                  color: Colors.secondary,
                  fontSize: Font.sm,
                }}
              >
                {r.date}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons name="time-outline" size={20} color={Colors.accent} />
              <Text
                style={{
                  color: Colors.secondary,
                  fontSize: Font.sm,
                }}
              >
                {r.time}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: Constants.fontSize.lg,
            }}
          >
            $ {r.price}
          </Text>
        </View>

        <View style={{ width: "50%", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: Spacing.sm,
            }}
          >
            <Ionicons name="location" size={16} color={Colors.accent} />
            <Text
              style={{
                color: Colors.secondary,
                fontSize: Font.sm,
                gap: 6,
              }}
            >
              {r.place.split(",")[1]}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={{
                borderRadius: Spacing.lg,
                paddingVertical: Spacing.sm,
                alignItems: "center",
                backgroundColor: Colors.accent,
              }}
              onPress={onAccept}
            >
              <Text
                style={{
                  fontSize: Font.sm,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Accept Booking
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{
                borderRadius: Spacing.lg,
                paddingVertical: Spacing.sm,
                alignItems: "center",
                backgroundColor: "white",
                borderColor: "gray",
                borderWidth: 1,
              }}
              onPress={onDecline}
            >
              <Text
                style={{
                  fontSize: Font.sm,
                  fontWeight: "bold",
                  color: "gray",
                }}
              >
                Decline Booking
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{
                borderRadius: Spacing.lg,
                paddingVertical: Spacing.sm,
                alignItems: "center",
                backgroundColor: "white",
                borderColor: Constants.colors.accent,
                borderWidth: 1,
              }}
              onPress={() => {
                sendMessage();
              }}
            >
              <View style={{ flex: 1, flexDirection: "row", gap: 6 }}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={Constants.colors.accent}
                />
                <Text
                  style={{
                    fontSize: Font.sm,
                    fontWeight: "bold",
                    color: Constants.colors.accent,
                  }}
                >
                  Send Message
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RequestCard;
