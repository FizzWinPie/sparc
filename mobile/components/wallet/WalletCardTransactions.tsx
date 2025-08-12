import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import Constants from "@/constants/Constants";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

type Transaction = {
  _id: string;
  receiver: string;
  payer: string;
  amount: number;
};

type Props = {
  transactions: Transaction[];
};


export default function WalletCardTransactions({ transactions }: Props) {
  const {user} = useUser();
  return (
    <View
      style={{
        flex: 1,
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

        <ScrollView
          contentContainerStyle={{ gap: 4 }}
          showsVerticalScrollIndicator={false}
        >
          {transactions.length === 0 ? (
            <Text style={{ color: "#ccc", fontSize: Font.sm }}>No transactions</Text>
          ) : (
            transactions.slice().reverse().map((txn) => {
              const isReceiver = txn.receiver === user?.id;
              return (
                <View
                  key={txn._id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#eee", fontSize: Font.sm }}>
                    ID{txn._id.slice(-5).toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      color: isReceiver ? Constants.colors.accent : "white",
                      fontSize: Font.sm,
                      fontWeight: "bold",
                    }}
                  >
                    {isReceiver ? "+" : "-"}${Math.abs(txn.amount).toFixed(2)}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={{
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
        <Text style={{ fontSize: Font.sm, fontWeight: "400" }}>
          View All
        </Text>
      </TouchableOpacity>
    </View>
  );
}
