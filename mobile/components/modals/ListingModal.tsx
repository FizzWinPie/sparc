import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import Constants from "@/constants/Constants";

interface ListingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateListing: (listingData: {
    address: string;
    availabilitySchedule: string;
    chargerType: string;
    connectorType: string;
    powerOutput: string;
    pricePerHour: string;
    minPrice: string;
    instructions: string;
    images: string;
  }) => Promise<void>;
}

const ListingModal: React.FC<ListingModalProps> = ({
  isVisible,
  onClose,
  onCreateListing,
}) => {
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

  const handleCreateListing = async () => {
    try {
      await onCreateListing({
        address,
        availabilitySchedule,
        chargerType,
        connectorType,
        powerOutput,
        pricePerHour,
        minPrice,
        instructions,
        images,
      });
      // Clear form on success
      setAddress("");
      setAvailabilitySchedule("");
      setChargerType("");
      setConnectorType("");
      setPowerOutput("");
      setPricePerHour("");
      setMinPrice("");
      setInstructions("");
      setImages("");
      setErrorMessage("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to create listing");
      }
    }
  };

  return (
    <ReactNativeModal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalIconContainer}>
            <Ionicons name="create-outline" size={20} color={Colors.accent} />
          </View>
          <Text style={styles.modalTitle}>Create New Listing</Text>
          <Text style={styles.modalSubtitle}>Fill out all fields below</Text>

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
              onPress={handleCreateListing}
              style={styles.verifyButton}
            >
              <Text style={styles.verifyButtonText}>Create Listing</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
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
});

export default ListingModal;