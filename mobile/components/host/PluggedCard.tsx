import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import Constants from "@/constants/Constants";

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
};

const PluggedCard: React.FC<Props> = ({ plugged: r }) => {
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
              size={35}
              color={Constants.colors.accent}
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

          <View style={{gap: 12}}>
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
              {r.place.split(",")[0]}
            </Text>
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
            >
              <Text
                style={{
                  fontSize: Font.sm,
                  fontWeight: "bold",
                  color: "gray",
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

export default PluggedCard;
