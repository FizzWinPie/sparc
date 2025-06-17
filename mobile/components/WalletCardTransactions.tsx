import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import Constants from "@/constants/Constants";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";

type Transaction = {
  id: string;
  amount: number;
};

type Props = {
  wallet: number;
  transactions: Transaction[];
};

export default function WalletCardTransactions({
  wallet,
  transactions,
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        // margin: Spacing.sm,
        marginTop: Spacing.lg,
        borderRadius: Constants.borderRadius,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        opacity: 0.97,
        maxWidth: "50%",
        height: 120,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.secondary,
          borderRadius: Constants.borderRadius,
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          justifyContent: "space-between"
        }}
      >
        <Text
          style={{
            color: Colors.primary,
            fontSize: Font.sm,
            marginBottom: Spacing.xs,
            fontWeight: "bold",
          }}
        >
          Recent Transactions
        </Text>

        <ScrollView style={{ gap: 2 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "#eee", fontSize: Font.sm }}>ID42456</Text>
            <Text
              style={{
                color: "white",
                fontSize: Font.sm,
                fontWeight: "bold",
              }}
            >
              -$15.94
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "#eee", fontSize: Font.sm }}>ID12476</Text>
            <Text
              style={{
                color: Constants.colors.accent,
                fontSize: Font.sm,
                fontWeight: "bold",
              }}
            >
              +$12.37
            </Text>
          </View>
        </ScrollView>
        
      </View>
      <TouchableOpacity
        style={{
          // flex: 1,
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          paddingVertical: Spacing.sm,
          borderRadius: Constants.borderRadius,
        }}
        onPress={() => router.push("/(tabs)/profile")}
      >
        <Ionicons name="arrow-forward-outline" size={15} />
        <Text style={{ fontSize: Font.sm, fontWeight: "regular" }}>
          View All
        </Text>
      </TouchableOpacity>
    </View>
  );
}
