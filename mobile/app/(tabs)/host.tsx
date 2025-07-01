import React, { useState } from "react";
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
import WalletCardBalance from "@/components/WalletCardBalance";
import WalletCardTransactions from "@/components/WalletCardTransactions";
import RequestCard from "@/components/RequestCard";
import CarouselComponent from "@/components/CarouselComponent";
import { Ionicons } from "@expo/vector-icons";
import { createListing } from "@/lib/listing";
import { useUser } from "@clerk/clerk-expo";
import ListingModal from "@/components/modals/ListingModal";

export default function Host() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState<"requests" | "plugged">("requests");

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

  const handleCreateListing = async (listingData: {
    address: string;
    availabilitySchedule: string;
    chargerType: string;
    connectorType: string;
    powerOutput: string;
    pricePerHour: string;
    minPrice: string;
    instructions: string;
    images: string;
  }) => {
    if (!user) return;
    
    try {
      const newListing = await createListing({
        host_id: user.id,
        charger_type: listingData.chargerType,
        power_output_kw: listingData.powerOutput,
        connector_type: listingData.connectorType,
        address: listingData.address,
        latitude: 40.7831,
        longitude: -73.9712,
        availability_schedule: listingData.availabilitySchedule,
        price_per_hour: listingData.pricePerHour,
        min_price: listingData.minPrice,
        images: listingData.images,
        instructions: listingData.instructions,
        is_active: true,
      });
      console.log("Created listing:", newListing);
      setEditModalVisible(false);
    } catch (error) {
      console.error("Listing creation failed", error);
      throw error;
    }
  };

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
            wallet={1240.97}
            transactions={dummyData.payment_invoice}
          />
          <WalletCardTransactions
            wallet={1601.89}
            transactions={dummyData.payment_invoice}
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
            return <EmptyState message="No plugged-in sessions" />;
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
    padding: Spacing.lg 
  },
  scrollViewContent: {
    paddingBottom: 50
  },
  walletContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    marginTop: Spacing.lg
  },
  tabContainer: {
    flexDirection: "row",
    gap: 16,
    marginVertical: Spacing.lg
  },
  tabText: {
    fontWeight: "300",
    color: "gray"
  },
  tabTextSelected: {
    fontWeight: "bold",
    color: Colors.secondary
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginTop: 4
  },
  dotSelected: {
    backgroundColor: Colors.accent,
    alignSelf: "center"
  },
  emptyBox: {
    height: 180,
    borderWidth: 2,
    borderColor: Colors.blueVariations.aliceBlue,
    borderRadius: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted"
  },
  emptyImage: {
    width: 120,
    height: 80,
    resizeMode: "contain"
  },
  emptyText: {
    marginTop: Spacing.xs,
    color: Colors.basic.blue,
    fontSize: 12
  },
  stationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl
  },
  stationsTitle: {
    color: Colors.secondary,
    fontSize: Font.md,
    fontWeight: "700"
  },
  addIcon: {
    color: Colors.accent,
    paddingRight: 20
  },
});