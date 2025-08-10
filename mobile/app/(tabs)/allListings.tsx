import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import { Ionicons } from "@expo/vector-icons";
import { Listing } from "@/types";
import BottomSheet from "@gorhom/bottom-sheet";
import ListingBottomSheet from "@/components/bottomSheet/ListingBottomSheet";
import ProfileBar from "@/components/ProfileBar";
import SearchBar from "@/components/SearchBar";
import { useLoading } from "@/utils/LoadingContext";
import { createBooking } from "@/lib/booking";
import { useUser } from "@clerk/clerk-expo";
import AllListingsNav from "@/components/AllListingsNav";
//import useListings from "@/utils/hooks/useListings";
import { useFocusEffect } from "@react-navigation/native";

import ListingCard from "@/components/ListingCard";
import { useListings } from "@/utils/ListingContext";

const allListings = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["45%", "70%"], []);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const { setLoading } = useLoading();
  const { user } = useUser();

  const bookingStartTime = new Date().toISOString();
  const bookingEndTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const calculatedCost = selectedListing?.price_per_hour || 10;
  const selectedBatteryLevel = "50%";

  //const { listings } = useListings();
  const { listings, refreshListings } = useListings();

  useFocusEffect(
    useCallback(() => {
      refreshListings();
    }, [refreshListings])
  );

  const handleChooseListing = () => {
    bottomSheetRef.current?.close();
    Alert.alert(
      "Confirm Booking",
      "Are you sure you want to book this listing?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            if (!selectedListing || !user) return;
            setLoading(true);
            const res = await createBooking({
              charger_listings_id: selectedListing._id,
              charger_listings_address: selectedListing.address,
              host_id: selectedListing.host_id,
              ev_owner_id: user.id,
              start_time: bookingStartTime,
              end_time: bookingEndTime,
              total_cost: calculatedCost,
              status: "pending",
              payment_status: "unpaid",
              rating_by_driver: null,
              rating_by_host: null,
              battery_level: selectedBatteryLevel,
              images: selectedListing.images,
            });
            console.log(res);
            setLoading(false);
          },
        },
      ]
    );
  };

  const handleCardPress = (listing: Listing) => {
    setSelectedListing(listing);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <ListingCard listing={item} onPress={handleCardPress} />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.basic.white }}>
        <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}>
          <ProfileBar />
        </View>
        <View style={{ flex: 1, backgroundColor: Colors.basic.white }}>
          <View style={styles.searchBar}>
            <SearchBar />
          </View>

          <AllListingsNav />

          <View style={styles.listcontainer}>
            <FlatList
              data={listings}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
            />
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
        >
          <ListingBottomSheet
            selectedListing={selectedListing}
            onChooseListing={() => {
              handleChooseListing();
            }}
          />
        </BottomSheet>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  searchcontainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  searchBar: {},
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  navcontainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listcontainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  box: {
    flexDirection: "row",
    backgroundColor: Colors.basic.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  shadowWrapper: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 10,
  },

  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 6,
  },
  middleContent: {
    flex: 1,
    justifyContent: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  bottomRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});

export default allListings;
