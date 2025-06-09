import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import debounce from "lodash.debounce";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import Constants from "@/constants/Constants";

const SearchBar = () => {
  const [addressInput, setAddressInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useMemo(
    () => debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  const handleInputChange = (text: string) => {
    setAddressInput(text);
    debouncedFetch(text);
  };

  const handleSelect = (item: any) => {
    setAddressInput(item.display_name);
    setSuggestions([]);
    console.log(item);
  };

  const handleClearInput = () => {
    setAddressInput("");
    setSuggestions([]);
    debouncedFetch.cancel();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} />
        <TextInput
          style={styles.input}
          value={addressInput}
          onChangeText={handleInputChange}
          placeholder="Search a charger near you"
        />
        {addressInput.length > 0 && (
          <Pressable onPress={handleClearInput}>
            <Ionicons name="close-circle" size={18} color="#ccc" />
          </Pressable>
        )}
        {loading && <ActivityIndicator size="small" />}
      </View>

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelect(item)}
              style={styles.suggestionItem}
            >
              <Text>{item.display_name}</Text>
            </Pressable>
          )}
          style={styles.suggestionList}
          keyboardShouldPersistTaps="always"
        />
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: Constants.borderRadius,
    paddingHorizontal: Spacing.md,
    paddingVertical: Constants.spacing.xs,
    shadowColor: "#ccc",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
    gap: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "regular",
    fontSize: Font.md,
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
