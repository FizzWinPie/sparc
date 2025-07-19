import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import dummyData from "../../constants/dummyData/dummy";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import Spacing from "../../constants/Spacing";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileBar from "@/components/ProfileBar";
import Constants from "@/constants/Constants";
import WalletCardBalance from "@/components/WalletCardBalance";
import WalletCardTransactions from "@/components/WalletCardTransactions";
import RequestCard from "@/components/RequestCard";
import CarouselComponent from "@/components/CarouselComponent";
import { Ionicons } from "@expo/vector-icons";
import ReactNativeModal from "react-native-modal";
import { createListing } from "@/lib/listing";
import { useUser } from "@clerk/clerk-expo";
import PluggedInCard from "@/components/PluggedInCard";
import { updateBooking, getBookingsByHost } from "@/lib/booking";

export default function Host() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [address, setAddress] = useState("");
  const [availabilitySchedule, setAvailabilitySchedule] = useState("");
  const [chargerType, setChargerType] = useState("");
  const [connectorType, setConnectorType] = useState("");
  const [powerOutput, setPowerOutput] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [instructions, setInstructions] = useState("");
  const [images, setImages] = useState("");

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [acceptedRequests, setAcceptedRequests] = useState<any[]>([]);
  const [declinedRequests, setDeclinedRequests] = useState<string[]>([]);
  const [acceptedBookings, setAcceptedBookings] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const { user } = useUser();

  const [selectedTab, setSelectedTab] = useState<"requests" | "plugged">(
    "requests"
  );

  const handleCreateListing = async () => {
    if (!user) return;
    try {
      const newListing = await createListing({
        host_id: user.id,
        charger_type: chargerType,
        power_output_kw: powerOutput,
        connector_type: connectorType,
        address: address,
        latitude: selectedCoords?.lat,//40.7831, // fix
        longitude: selectedCoords?.lon, //-73.9712,
        availability_schedule: availabilitySchedule,
        price_per_hour: pricePerHour,
        min_price: minPrice,
        images: images,
        instructions: instructions,
        is_active: true,
      });
      console.log("Created listing:", newListing);
      setEditModalVisible(false);
    } catch (error) {
      console.error("Listing creation failed", error);
    }
  };

  /*
  // Static needs to be fixed to be updated using the data
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
  */

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;

      try {
        const bookings = await getBookingsByHost(user.id);
        console.log("Bookings from getBookingsByHost:", bookings);
        console.log("userID", user.id)
        const pending = bookings.filter((b: any) => b.status === "pending");

        const formatted = pending.map((b: any) => ({
          id: b._id,
          name: b.ev_owner_name ?? "Unknown",
          place: b.charger_listings_address ?? "-",
          date: b.start_time.split("T")[0],
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
        setAcceptedBookings(accepted);
      } catch (error) {
        console.error("Error fetching accepted bookings:", error);
      }
    };

    fetchAcceptedBookings();
  }, [user]);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            "User-Agent": "plugPorch/1.0",
          },
        }
      );
      const data = await response.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    setAddress(item.display_name);
    setSelectedCoords({ lat: parseFloat(item.lat), lon: parseFloat(item.lon) });
    setSuggestions([]);
    console.log("Selected coordinates:", item.lat, item.lon);
  };

  const handleAcceptRequest = async (requestId: string) => {
    const requestToAccept = pendingRequests.find((r) => r.id === requestId);
    if (!requestToAccept) return;
    try {
      await updateBooking(requestId, { status: "accepted" });
      setAcceptedRequests((prev) => [...prev, requestToAccept]);
      setAcceptedBookings((prev) => [...prev, requestToAccept]);
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await updateBooking(requestId, { status: "declined" });
      setDeclinedRequests((prev) => [...prev, requestId]);
    } catch (error) {
      console.error("Failed to decline request", error);
    }
  };

  const filteredRequests = pendingRequests.filter(
    (r) => !declinedRequests.includes(r.id) && !acceptedRequests.find((a) => a.id === r.id)
  );

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <ProfileBar />

        {/* Wallet */}
        <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
          <WalletCardBalance
            wallet={1240.97}
            transactions={dummyData.payment_invoice}
          />
          <WalletCardTransactions
            wallet={1601.89}
            transactions={dummyData.payment_invoice}
          />
        </View>

        {/* Requests */}
        <View
          style={{ flexDirection: "row", gap: 16, marginVertical: Spacing.lg }}
        >
          <TouchableOpacity onPress={() => setSelectedTab("plugged")}>
            <Text
              style={{
                fontWeight: selectedTab === "plugged" ? "bold" : "300",
                color: selectedTab === "plugged" ? Colors.secondary : "gray",
              }}
            >
              Plugged In
            </Text>
            <View
              style={[
                styles.dot,
                { marginTop: 4 },
                selectedTab === "plugged" && styles.dotSelected,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab("requests")}>
            <Text
              style={{
                fontWeight: selectedTab === "requests" ? "bold" : "300",
                color: selectedTab === "requests" ? Colors.secondary : "gray",
              }}
            >
              Charge requests
            </Text>
            <View
              style={[
                styles.dot,
                { marginTop: 4 },
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
                    source={require("../../assets/images/noRequest-icon.png")}
                    style={{ width: 50, height: 50, resizeMode: "contain" }}
                  />
                  <Text style={[styles.emptyTxt, { fontSize: 12 }]}>
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
                    source={require("../../assets/images/noRequest-icon.png")}
                    style={{ width: 50, height: 50, resizeMode: "contain" }}
                  />
                  <Text style={[styles.emptyTxt, { fontSize: 12 }]}>
                    No plugged-in sessions
                  </Text>
                </View>
              );
            } else {
              return acceptedBookings.map((b) => (
                <PluggedInCard key={b.id} booking={b} />
              ));
            }
          }

        })()}

        {/* Stations */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: Spacing.sm,
            marginTop: Spacing.xl,
          }}
        >
          <Text
            style={{
              color: Colors.secondary,
              fontSize: Font.md,
              fontWeight: "700",
            }}
          >
            My Charging Stations (Host)
          </Text>
          <TouchableOpacity onPress={() => setEditModalVisible(true)}>
            <Ionicons
              name="add-circle-sharp"
              size={25}
              style={{ color: Colors.accent, paddingRight: 20 }}
            />
          </TouchableOpacity>
        </View>

        <CarouselComponent />
        <ReactNativeModal
          isVisible={editModalVisible}
          onBackdropPress={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 10 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalIconContainer}>
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={Colors.accent}
                />
              </View>
              <Text style={styles.modalTitle}>Create New Listing</Text>
              <Text style={styles.modalSubtitle}>
                Fill out all fields below
              </Text>

              <View style={styles.inputFieldsContainer}>
                {/* Address */}
                <View style={styles.inputRow}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={Colors.accent}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={address}
                    onChangeText={(text) => {
                      setAddress(text);
                    }}
                    placeholder="Address"
                    placeholderTextColor="#888"
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => fetchSuggestions(address)}>
                    <Ionicons name="search-outline" size= {Font.lg} color="#888" style={{paddingLeft: 8}} />
                  </TouchableOpacity>
                </View>

                {suggestions.length > 0 && (
                  <View style={styles.suggestionList}>
                    {suggestions.map((item) => (
                      <Pressable
                        key={item.place_id}
                        onPress={() => handleSelectSuggestion(item)}
                        style={styles.suggestionItem}
                      >
                        <Text>{item.display_name}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}

                {/* Availability Schedule */}
                <View style={styles.inputRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={Colors.accent}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={availabilitySchedule}
                    onChangeText={setAvailabilitySchedule}
                    placeholder="Availability (e.g. Mon-Fri: 9am-5pm)"
                    placeholderTextColor="#888"
                    style={styles.input}
                  />
                </View>

                {/* Charger Type */}
                <View style={styles.inputRow}>
                  <Ionicons
                    name="flash-outline"
                    size={20}
                    color={Colors.accent}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={chargerType}
                    onChangeText={setChargerType}
                    placeholder="Charger Type (e.g. Level 1)"
                    placeholderTextColor="#888"
                    style={styles.input}
                  />
                </View>

                {/* Connector Type */}
                <View style={styles.inputRow}>
                  <Ionicons
                    name="swap-horizontal-outline"
                    size={20}
                    color={Colors.accent}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={connectorType}
                    onChangeText={setConnectorType}
                    placeholder="Connector Type (e.g. J1772)"
                    placeholderTextColor="#888"
                    style={styles.input}
                  />
                </View>

                {/* Power Output (kW) */}
                <View style={styles.inputRow}>
                  <Ionicons
                    name="battery-charging-outline"
                    size={20}
                    color={Colors.accent}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={powerOutput}
                    onChangeText={setPowerOutput}
                    placeholder="Power Output (kW)"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                {/* Price Per Hour */}
                <View style={styles.inputRow}>
                  <Ionicons
                    name="pricetag-outline"
                    size={20}
                    color={Colors.accent}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={pricePerHour}
                    onChangeText={setPricePerHour}
                    placeholder="Price Per Hour"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                {/* Minimum Price */}
                <View style={styles.inputRow}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={Colors.accent}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholder="Minimum Price"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                {/* Instructions */}
                <View style={styles.inputRow}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={Colors.accent}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={instructions}
                    onChangeText={setInstructions}
                    placeholder="Special Instructions"
                    placeholderTextColor="#888"
                    style={styles.input}
                  />
                </View>

                {/* Image URL */}
                <View style={styles.inputRow}>
                  <Ionicons
                    name="image-outline"
                    size={20}
                    color={Colors.accent}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={images}
                    onChangeText={setImages}
                    placeholder="Image URL"
                    placeholderTextColor="#888"
                    style={styles.input}
                  />
                </View>
              </View>

              {!!errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={handleCreateListing}
                  style={styles.verifyButton}
                >
                  <Text style={styles.verifyButtonText}>Create Listing</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ReactNativeModal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.primary, padding: Spacing.lg },
  row: { flexDirection: "row", alignItems: "center" },
  h1: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Font.md,
    fontWeight: "600",
    color: Colors.secondary,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: Constants.borderRadius,
    padding: Spacing.sm,
    margin: Spacing.sm,
  },
  label: {
    color: Colors.primary,
    fontSize: Font.sm,
    marginBottom: Spacing.xs,
    fontWeight: "regular",
  },
  big: { color: Colors.primary, fontSize: Font.lg, fontWeight: "bold" },
  txn: { color: "#eee", fontSize: Font.sm, fontWeight: "light" },
  sub: {
    color: Colors.secondary,
  },
  emptyBox: {
    height: 90,
    borderWidth: 2,
    borderColor: Colors.blueVariations.aliceBlue,
    borderRadius: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
  },
  emptyTxt: {
    marginTop: Spacing.xs,
    color: Colors.basic.blue,
    fontSize: Font.sm,
  },
  reqCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.blueVariations.aliceBlue,
    borderRadius: Constants.borderRadius,
    padding: Spacing.md,
    gap: 6,
  },
  reqTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  reqName: { fontWeight: "600", color: Colors.secondary },
  reqLoc: {
    color: Colors.secondary,
    fontSize: Font.sm,
  },
  reqLine: {
    color: Colors.secondary,
    fontSize: Font.sm,
    marginBottom: Spacing.xs,
  },
  rowBtn: { flexDirection: "column", gap: 6 },
  btn: {
    flex: 1,
    borderRadius: Spacing.xs,
    paddingVertical: Spacing.xs,
    alignItems: "center",
  },
  btnGreen: { backgroundColor: Colors.success },
  btnGray: { backgroundColor: Colors.blueVariations.aliceBlue },
  btnTxt: { fontSize: Font.sm, fontWeight: "600", color: Colors.secondary },
  price: { marginTop: Spacing.xs, fontWeight: "700", color: Colors.secondary },
  stationWrapper: { marginTop: Spacing.sm },
  stationHeader: {
    borderRadius: Spacing.sm,
    overflow: "hidden",
    backgroundColor: Colors.secondary,
  },
  stationInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.sm,
  },
  stationRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  title: { color: Colors.primary, fontSize: Font.sm, fontWeight: "700" },
  small: { color: Colors.blueVariations.aliceBlue, fontSize: Font.sm },
  online: { color: Colors.success, fontSize: Font.sm },
  detailBox: {
    borderWidth: 1,
    borderColor: Colors.blueVariations.aliceBlue,
    borderTopWidth: 0,
    borderBottomLeftRadius: Spacing.sm,
    borderBottomRightRadius: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.primary,
  },
  infoRow: { flexDirection: "row", marginBottom: Spacing.xs },
  infoLabel: { width: 110, fontWeight: "600", color: Colors.secondary },
  infoValue: { flex: 1, color: Colors.secondary },
  detailText: { color: Colors.secondary, fontSize: Font.sm },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
  },
  dotSelected: {
    backgroundColor: Colors.accent,
    alignSelf: "center",
  },
  modalContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: Constants.borderRadius,
    maxHeight: "70%",
  },
  modalIconContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a1eade",
    width: 50,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 6,
    borderColor: "#c8f4ec",
    borderWidth: 3,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "center",
    color: Colors.secondary,
  },
  modalSubtitle: {
    fontSize: Font.sm,
    fontWeight: "300",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.secondary,
  },
  inputFieldsContainer: {
    alignSelf: "flex-start",
    width: "100%",
    gap: Spacing.md,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  input: {
    flex: 1,
    color: "#222",
  },
  modalButtonContainer: {
    alignItems: "center",
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  verifyButton: {
    backgroundColor: Colors.secondary,
    width: 250,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Constants.borderRadius,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  suggestionList: {
      backgroundColor: "#fff",
      borderRadius: Constants.borderRadius,
      marginTop: 4,
      maxHeight: 200,
    },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
