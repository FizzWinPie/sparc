import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import Constants from "@/constants/Constants";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

type Transaction = {
  id: string;
  amount: number;
};

type Props = {
  wallet: number;
  transactions: Transaction[];
};

export default function WalletCardBalance({ wallet, transactions }: Props) {
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
          justifyContent: "space-between",
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
          Account Balance (Wallet)
        </Text>

        <Text
          style={{
            color: Colors.primary,
            fontSize: Font.lg,
            fontWeight: "bold",
          }}
        >
          $ 1512.32
        </Text>
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
      >
        <FontAwesome name="bank" size={18} />
        <Text style={{ fontSize: Font.sm, fontWeight: "regular" }}>
          Account Info
        </Text>
      </TouchableOpacity>
    </View>
  );
}
