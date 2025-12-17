import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
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
import { getBookingsByHost, updateBooking } from "@/lib/booking";
import { useListings } from "@/utils/ListingContext";
import { createNotification } from "@/lib/notifications";
//import useListings from "@/utils/hooks/useListings";

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
  const [refreshListingsVersion, setRefreshListingsVersion] = useState(0);
  const [selectedTab, setSelectedTab] = useState<"requests" | "plugged">(
    "requests"
  );
  const [acceptedRequests, setAcceptedRequests] = useState<any[]>([]);
  const [declinedRequests, setDeclinedRequests] = useState<string[]>([]);
  const [acceptedBookings, setAcceptedBookings] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const { createNewListing } = useCreateListing();
  const { refreshListings } = useListings();

  const handleCreateListing = async (listingData: ListingFormData) => {
    const listing = await createNewListing(listingData);
    setEditModalVisible(false);
    await refreshListings();
    setRefreshListingsVersion((prev) => prev + 1);
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

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        const bookings = await getBookingsByHost(user.id);
        const pending = bookings.filter((b: any) => b.status === "pending");
        const formatted = pending.map((b: any) => ({
          id: b._id,
          name: b.ev_owner_name ?? "Unknown",
          ev_owner_id: b.ev_owner_id,
          place: b.charger_listings_address ?? "-",
          date: b.start_time.split("T")[0],
          imageUrl: b.images,
          time: `${new Date(b.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${new Date(b.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          price: b.total_cost.toString(),
        }));
        setPendingRequests(formatted);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      }
    };
    fetchRequests();
  }, [user]);

useEffect(() => {
  const fetchAcceptedBookings = async () => {
    try {
      if (!user) return;
      const bookings = await getBookingsByHost(user.id);
      const accepted = bookings.filter((b: any) => b.status === "accepted");
      const formatted = accepted.map((b: any) => ({
        id: b._id,
        name: b.ev_owner_name ?? "Unknown",
        ev_owner_id: b.ev_owner_id,
        place: b.charger_listings_address ?? "-",
        date: b.start_time?.split("T")[0] ?? "-",
        imageUrl: b.images,
        time: `${new Date(b.start_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(b.end_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        price: b.total_cost?.toString() ?? "0",
      }));
      setAcceptedBookings(formatted);
    } catch (error) {
      console.error("Error fetching accepted bookings:", error);
    }
  };
  fetchAcceptedBookings();
}, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    const requestToAccept = pendingRequests.find((r) => r.id === requestId);
    if (!requestToAccept) return;
    try {
      await updateBooking(requestId, { status: "accepted" });
      setAcceptedRequests((prev) => [...prev, requestToAccept]);
      setAcceptedBookings((prev) => [...prev, requestToAccept]);
      await createNotification(requestToAccept.ev_owner_id, `Your booking at ${requestToAccept.place.split(",")[0]} was accepted 🎉`, false);
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    const requestToDecline = pendingRequests.find((r) => r.id === requestId);
    if (!requestToDecline) return;
    try {
      await updateBooking(requestId, { status: "declined" });
      setDeclinedRequests((prev) => [...prev, requestId]);
      await createNotification(requestToDecline.ev_owner_id, `Your booking request at ${requestToDecline.place.split(",")[0]} was declined`, false);
    } catch (error) {
      console.error("Failed to decline request", error);
    }
  };

  const filteredRequests = pendingRequests.filter(
    (r) => !declinedRequests.includes(r.id) && !acceptedRequests.find((a) => a.id === r.id)
  );

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

        {/* Requests and PluggedIn Bar */}
        <View
          style={{ flexDirection: "row", gap: 16, marginVertical: Spacing.lg }}
        >
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
            if (filteredRequests.length === 0) {
              return (
                <View style={[styles.emptyBox, { height: 120 }]}>
                  <Image
                    source={require("../../assets/images/onboard/driving.png")}
                    style={{ width: 70, height: 50, resizeMode: "contain" }}
                  />
                  <Text style={[{ fontSize: Font.sm, marginTop: Spacing.xs, color: Colors.basic.blue}]}>
                    No active requests
                  </Text>
                </View>
              );
            } else {
              return filteredRequests.map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  onAccept={() => handleAcceptRequest(r.id)}
                  onDecline={() => handleDeclineRequest(r.id)}
                />
              ));
            }
          } else {
            if (acceptedBookings.length === 0) {
              return (
                <View style={[styles.emptyBox, { height: 120 }]}>
                  <Image
                    source={require("../../assets/images/onboard/charging_request.png")}
                    style={{ width: 70, height: 50, resizeMode: "contain" }}
                  />
                  <Text style={[{ fontSize: Font.sm, marginTop: Spacing.xs, color: Colors.basic.blue}]}>
                    No plugged-in sessions
                  </Text>
                </View>
              );
            } else {
              return acceptedBookings.map((r) => (
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

        <CarouselComponent refreshTrigger={refreshListingsVersion}/>

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
