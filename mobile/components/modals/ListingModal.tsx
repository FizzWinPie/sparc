import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import Constants from "@/constants/Constants";
import ImageUploader from "../../components/ImageUploader";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    latitude?: number;
    longitude?: number;
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

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number } | null>(null);

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
        latitude: selectedCoords?.lat,
        longitude: selectedCoords?.lon,
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
        <KeyboardAwareScrollView
          enableOnAndroid
          extraHeight={100}
          keyboardOpeningTime={0}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
            <ImageUploader
              label="Upload Charger Photo"
              onUrl={setImages}         
            />
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
        </KeyboardAwareScrollView>
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

export default ListingModal;