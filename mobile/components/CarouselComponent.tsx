import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import Constants from "@/constants/Constants";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Listing } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { deleteListing, getListingsByHostId } from "@/lib/listing";
import { useUser } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import Font from "@/constants/Font";
import { ScrollView } from "react-native-gesture-handler";

function CarouselComponent({ refreshTrigger }: { refreshTrigger: number }) {
  const progress = useSharedValue<number>(0);
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

  const [selectedHostListing, setSelectedHostListing] =
    useState<Listing | null>(null);

  const { user } = useUser();
  const [hostListingData, sethostListingData] = useState([]);

  const handleCardPress = (hostListing: Listing) => {
    setSelectedHostListing(hostListing);
    setEditModalVisible(true);
    setAddress(hostListing.address);
    setAvailabilitySchedule(hostListing.availability_schedule);
    setChargerType(hostListing.charger_type);
    setConnectorType(hostListing.connector_type);
    setPowerOutput(hostListing.power_output_kw.toString());
    setPricePerHour(hostListing.price_per_hour.toString());
    setMinPrice(hostListing.min_price.toString());
    setInstructions(hostListing.instructions);
    setImages(hostListing.images);
  };

  const handleUpdate = () => {
    console.log("update");
  };

  const handleDelete = async () => {
    if (!selectedHostListing?._id) return;

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this listing? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteListing(selectedHostListing._id);
              setEditModalVisible(false);
              if (!user) return;
              const updatedListings = await getListingsByHostId(user.id);
              sethostListingData(updatedListings);
            } catch (err) {
              console.error("Listing deletion failed", err);
              setErrorMessage("Failed to delete listing");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (!user) return;

    const fetchListingByHost = async () => {
      try {
        const data = await getListingsByHostId(user.id);
        sethostListingData(data);
      } catch (error) {
        console.error("Error getting bookings:", error);
      }
    };
    fetchListingByHost();
  }, [refreshTrigger]);


  const renderItem = ({ item }: { item: Listing }) => (
    <View>
      <View style={styles.cardContainer}>
        <Image
          source={{
            uri: item.images,
          }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardOverlay}>
          <View style={styles.cardRow}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.address.split(",").slice(0, 2)}</Text>
              <Text style={styles.cardBattery}>
                {item.availability_schedule}
              </Text>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={() => handleCardPress(item)}
              >
                <Ionicons
                  name="arrow-forward-outline"
                  color={Colors.accent}
                  size={15}
                />
                <Text style={styles.cardButtonText}>View More</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardStatus}>
              {item.is_active ? "ACTIVE" : "INACTIVE"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View id="carousel-component">
      {hostListingData.length === 0 ? (
  <View style={styles.emptyBox}>
    <Image
      source={require("../assets/images/onboard/house2.png")}
      style={styles.emptyImage}
    />
    <Text style={styles.emptyText}>No listings found. Add a new one to get started!</Text>
  </View>
      ) : (
        <Carousel
          autoPlayInterval={2000}
          data={hostListingData}
          height={258}
          loop={hostListingData.length > 1}
          pagingEnabled={hostListingData.length > 1}
          snapEnabled={hostListingData.length > 1}
          width={393}
          style={{ width: 393 }}
          modeConfig={{
            stackInterval: 10,
            opacityInterval: 0.9,
          }}
          onProgressChange={progress}
          renderItem={renderItem}
        />
      )}
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
              <Ionicons name="create-outline" size={20} color={Colors.accent} />
            </View>
            <Text style={styles.modalTitle}>Edit Listing</Text>
            <Text style={styles.modalSubtitle}>
              Update your listing details below.
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
                  onChangeText={setAddress}
                  placeholder="Address"
                  placeholderTextColor="#888"
                  style={styles.input}
                />
              </View>

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
                onPress={handleUpdate}
                style={styles.verifyButton}
              >
                <Text style={styles.verifyButtonText}>Update Listing</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text style={{ color: Colors.danger }}>Delete Listing</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ReactNativeModal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "85%",
    height: "100%",
    borderRadius: Constants.borderRadius,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 48, 73, 0.92)",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInfo: {
    width: "80%",
    gap: 4,
  },
  cardTitle: {
    color: "#fff",
    fontSize: Constants.fontSize.md,
    fontWeight: "bold",
  },
  cardBattery: {
    color: "#fff",
    fontSize: Constants.fontSize.sm,
  },
  cardButton: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  cardButtonText: {
    color: Colors.accent,
    fontSize: Constants.fontSize.sm,
  },
  cardStatus: {
    color: Constants.colors.accent,
    fontSize: 16,
    fontWeight: "bold",
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
    emptyBox: {
      height: 200,
      borderWidth: 2,
      borderColor: Colors.blueVariations.aliceBlue,
      borderRadius: Spacing.sm,
      justifyContent: "center",
      alignItems: "center",
      borderStyle: "dotted"
    },
    emptyImage: {
      width: 180,
      height: 140,
      resizeMode: "contain"
    },
    emptyText: {
      marginTop: Spacing.xs,
      color: Colors.basic.blue,
      fontSize: 12
    },
});

export default CarouselComponent;
