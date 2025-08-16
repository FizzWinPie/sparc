import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import {
  Ionicons,
} from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { Transaction } from "@/types";

const Wallet = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/transaction/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setTransactions(data.transactions);
        setBalance(data.balance);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchTransactions();
  }, [user?.id]);

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const date = new Date(item.createdAt);
    const formattedDate =
      date.toDateString() === new Date().toDateString()
        ? `Today at ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;

    const isReceiver = item.receiver === user?.id;

    return (
      <View style={styles.transactionCard}>
        <View>
          <Ionicons
            name= {isReceiver ? "trending-up-outline" : "trending-down-outline"}
            size={15}
            color={isReceiver ? Colors.accent : Colors.danger}
            padding={10}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontFamily: "bold" }}>Transaction ID: {item._id.slice(-10).toUpperCase()}</Text>
          <Text style={{ fontSize: 12, fontFamily: "light" }}>{isReceiver ? "Received from Acc.***" + item.payer.slice(-3) : "Sent to Acc.***" + item.receiver.slice(-3)}</Text>
          <Text style={{ fontSize: 9, fontFamily: "light"}}>{formattedDate}</Text>
        </View>
        <Text
          style={{
            fontFamily: "bold",
            fontSize: Font.md,
            color: isReceiver ? Colors.success : Colors.danger,
          }}
        >
          {isReceiver ? "" : "-"}${Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: Colors.basic.white }}>
      <View style={styles.balanceCard}>
        <View style={styles.headerRow}>
          <Text style={{ fontSize: Font.md, color: Colors.basic.white }}>
            Hello{" "}
            <Text style={{ fontFamily: "bold", color: Colors.basic.white }}>
              {user?.fullName}
            </Text>
          </Text>
          <Ionicons name="wallet" size={24} color={Colors.basic.white} />
        </View>
        <Text
          style={{
            fontSize: Font.sm,
            color: Colors.basic.white,
            marginTop: 10,
          }}
        >
          Your Wallet Balance
        </Text>
        <Text
          style={{
            fontFamily: "bold",
            fontSize: Font.lg,
            color: Colors.basic.white,
            marginTop: 10,
          }}
        >
          {balance >= 0 ? "+" : "-"}${Math.abs(balance).toFixed(2)}
        </Text>
      </View>

      {/* <TouchableOpacity style={styles.withdrawCard}>
        <MaterialCommunityIcons
          name="bank-transfer-out"
          size={24}
          color={Colors.basic.red}
        />
        <Text style={{ fontSize: Font.md, color: Colors.basic.black }}>
          Withdraw from Wallet
        </Text>
      </TouchableOpacity> */}

      <View style={styles.transactionsHeader}>
        <Text style={{ fontSize: Font.md, color: Colors.basic.black }}>
          Transactions
        </Text>
        <Text style={{ fontSize: 12, color: Colors.basic.blue }}>
          See All
        </Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    margin: 20,
    padding: 20,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  withdrawCard: {
    backgroundColor: "#eeeeee",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },

  transactionsHeader: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  transactionCard: {
    flexDirection: "row",
    backgroundColor: Colors.basic.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default Wallet;
