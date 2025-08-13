import React from "react";
import { View, Text, TouchableOpacity, Alert, Platform, ToastAndroid } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import Constants from "@/constants/Constants";
import { cancelBooking } from "@/lib/booking";

type Plugged = {
  id: string;
  name: string;
  date: string;
  time: string;
  price: string;
  place: string;
};

type Props = {
  plugged: Plugged;
  onCancel: (id: string) => void;
};

const PluggedCard: React.FC<Props> = ({ plugged: r, onCancel }) => {

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // For iOS or other platforms, fallback to alert or implement a custom toast component
      Alert.alert("", message);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelBooking(r.id);
              onCancel(r.id);
              showToast("Booking cancelled successfully.");
            } catch (error) {
              showToast("Failed to cancel booking.");
            }
          },
        },
      ]
    );
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
          borderColor: Colors.secondary,
          borderRadius: Constants.borderRadius,
          padding: Spacing.md,
          minHeight: 180,
          backgroundColor: Colors.secondary,
          opacity: 0.97,
        }}
      >
        <View style={{ flex: 1, width: "50%", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Ionicons
              name="person-circle"
              size={40}
              color={Colors.basic.white}
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                fontWeight: "bold",
                color: Colors.basic.white,
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
              <Ionicons name="calendar" size={20} color={Colors.basic.white} />
              <Text
                style={{
                  color: Colors.basic.white,
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
              <Ionicons name="time-outline" size={20} color={Colors.basic.white} />
              <Text
                style={{
                  color: Colors.basic.white,
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
              color: Colors.basic.white,
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
            <Ionicons name="location" size={16} color={Colors.blueVariations.vistaBlue} />
            <Text
              style={{
                color: Colors.basic.white,
                fontSize: Font.sm,
                gap: 6,
                maxWidth: 160,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {r.place.split(",")[1]}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={handleCancel}
              style={{
                borderRadius: Spacing.lg,
                paddingVertical: Spacing.sm,
                alignItems: "center",
                backgroundColor: "white",
                borderColor: "gray",
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: Font.sm,
                  fontWeight: "bold",
                  color: "#404040",
                }}
              >
                Cancel Session
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
            >
              <View style={{ flex: 1, flexDirection: "row", gap: 6 }}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={Colors.blueVariations.polynesianBlue}
                />
                <Text
                  style={{
                    fontSize: Font.sm,
                    fontWeight: "bold",
                    color: Colors.blueVariations.polynesianBlue,
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

export default PluggedCard;