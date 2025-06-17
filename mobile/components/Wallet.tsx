import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import dummyData from '@/constants/dummyData/dummy';
import Colors from '@/constants/Colors';
import Font from '@/constants/Font';
import Spacing from '@/constants/Spacing';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from "expo-router";
import { SignOutButton } from './SignOutButton';

const Wallet = () => {
  const balance = dummyData.payment_invoice.reduce((total, invoice) => total + invoice.amount, 0);
  const userName = dummyData.users[0].name;

  const invoices = dummyData.payment_invoice;
  const renderTransaction = ({ item }: { item: typeof dummyData.payment_invoice[0] }) => {
    const date = new Date(item.created_at);
    const formattedDate = date.toDateString() === new Date().toDateString()
      ? `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
      <View style={styles.transactionCard}>
        <View>
          <FontAwesome name="credit-card" size={15} color={Colors.basic.red} padding= {10} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: Font.sm}}>Send/Recieve placeholder</Text>
          <Text style={{ fontSize: Font.xs}}>{formattedDate}</Text>
        </View>
        <Text style={{ fontFamily: "bold", fontSize: Font.md, color:Colors.success}}> ${item.amount.toFixed(2)}</Text>
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
              {userName}
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
          $ {balance.toFixed(2)}
        </Text>
      </View>

      <Pressable style={styles.withdrawCard}>
        <MaterialCommunityIcons
          name="bank-transfer-out"
          size={24}
          color={Colors.basic.red}
        />
        <Text style={{ fontSize: Font.md, color: Colors.basic.black }}>
          Withdraw from Wallet
        </Text>
      </Pressable>

      <View style={styles.transactionsHeader}>
        <Text style={{ fontSize: Font.md, color: Colors.basic.black }}>
          Transactions
        </Text>
        <Text style={{ fontSize: Font.xs, color: Colors.basic.blue }}>
          See All
        </Text>
      </View>

      <FlatList
        data={invoices}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  withdrawCard: {
    backgroundColor: "#eeeeee",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },

  transactionsHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  transactionCard: {
    flexDirection: 'row',
    backgroundColor: Colors.basic.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default Wallet;