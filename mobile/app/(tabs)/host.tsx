import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import dummyData from "../../constants/dummyData/dummy";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import Spacing from "../../constants/Spacing";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileBar from "@/components/ProfileBar";
import WalletCardBalance from "@/components/wallet/WalletCardBalance";
import WalletCardTransactions from "@/components/wallet/WalletCardTransactions";
import RequestCard from "@/components/host/RequestCard";
import CarouselComponent from "@/components/CarouselComponent";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import ListingModal from "@/components/modals/ListingModal";
import useCreateListing from "@/utils/hooks/useCreateListing";
import { ListingFormData } from "@/types";
import PluggedCard from "@/components/host/PluggedCard";

type Transaction = {
  _id: string;
  receiver: string;
  payer: string;
  amount: number;
};

type Props = {
  transactions: Transaction[];
  balance: number;
};

export default function Host() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"requests" | "plugged">(
    "requests"
  );

  const requests = dummyData.bookings.map((b) => ({
    id: b.id,
    name: dummyData.users.find((u) => u.id === b.ev_owner_id)?.name ?? "-",
    place:
      dummyData.charger_listings.find((c) => c.id === b.charger_listings_id)
        ?.address ?? "-",
    date: b.start_time.split("T")[0],
    time: `${new Date(b.start_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} -${new Date(b.end_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    price: b.total_cost.toString(),
  }));

  const { createNewListing } = useCreateListing();

  const handleCreateListing = async (listingData: ListingFormData) => {
    const listing = await createNewListing(listingData);
    console.log("Created listing:", listing);
    setEditModalVisible(false);
  };
  
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

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <ProfileBar />

        {/* Wallet Cards */}
        <View style={styles.walletContainer}>
          <WalletCardBalance
            balance={balance}
          />
          <WalletCardTransactions
            transactions={transactions}
          />
        </View>

        {/* Requests and Plugged In Bar */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setSelectedTab("plugged")}>
            <Text
              style={[
                styles.tabText,
                selectedTab === "plugged" && styles.tabTextSelected,
              ]}
            >
              Plugged In
            </Text>
            <View
              style={[
                styles.dot,
                selectedTab === "plugged" && styles.dotSelected,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab("requests")}>
            <Text
              style={[
                styles.tabText,
                selectedTab === "requests" && styles.tabTextSelected,
              ]}
            >
              Charge requests
            </Text>
            <View
              style={[
                styles.dot,
                selectedTab === "requests" && styles.dotSelected,
              ]}
            />
          </TouchableOpacity>
        </View>

        {(() => {
          if (selectedTab === "requests") {
            if (requests.length === 0) {
              return <EmptyState message="No active requests" />;
            } else {
              return requests.map((r) => (
                <RequestCard key={r.id} request={r} />
              ));
            }
          } else {
            if (requests.length === 0) {
              return <EmptyState message="No plugged-in sessions" />;
            } else {
              return requests.map((r) => (
                <PluggedCard key={r.id} plugged={r} />
              ));
            }
          }
        })()}

        {/* Charging Stations */}
        <View style={styles.stationsHeader}>
          <Text style={styles.stationsTitle}>My Charging Stations (Host)</Text>
          <TouchableOpacity onPress={() => setEditModalVisible(true)}>
            <Ionicons
              name="add-circle-sharp"
              size={25}
              style={styles.addIcon}
            />
          </TouchableOpacity>
        </View>

        <CarouselComponent />

        <ListingModal
          isVisible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onCreateListing={handleCreateListing}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyBox}>
    <Image
      source={require("../../assets/images/onboard/charging_request.png")}
      style={styles.emptyImage}
    />
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  walletContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    marginTop: Spacing.lg,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 16,
    marginVertical: Spacing.lg,
  },
  tabText: {
    fontWeight: "300",
    color: "gray",
  },
  tabTextSelected: {
    fontWeight: "bold",
    color: Colors.secondary,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  dotSelected: {
    backgroundColor: Colors.accent,
    alignSelf: "center",
  },
  emptyBox: {
    height: 180,
    borderWidth: 2,
    borderColor: Colors.blueVariations.aliceBlue,
    borderRadius: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
  },
  emptyImage: {
    width: 120,
    height: 80,
    resizeMode: "contain",
  },
  emptyText: {
    marginTop: Spacing.xs,
    color: Colors.basic.blue,
    fontSize: 12,
  },
  stationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl,
  },
  stationsTitle: {
    color: Colors.secondary,
    fontSize: Font.md,
    fontWeight: "700",
  },
  addIcon: {
    color: Colors.accent,
    paddingRight: 20,
  },
});
