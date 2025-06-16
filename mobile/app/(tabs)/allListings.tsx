import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import dummyData from "@/constants/dummyData/dummy";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { Listing } from "@/types";
import Constants from "@/constants/Constants";
import BottomSheet from "@gorhom/bottom-sheet";
import ListingBottomSheet from "@/components/bottomSheet/ListingBottomSheet";
import ProfileBar from "@/components/ProfileBar";
import SearchBar from "@/components/SearchBar";

const allListings = () => {
  const listings = dummyData.charger_listings;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["45%", "70%"], []);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const extractAddress = (address: string) => {
    const addr = address.split(",")[0];
    const noNumber = addr.replace(/^\d+\s*/, "");
    return noNumber;
  };

  const handleCardPress = (listing: Listing) => {
    setSelectedListing(listing);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <View style={styles.shadowWrapper}>
      <TouchableOpacity
        style={styles.box}
        onPress={() => handleCardPress(item)}
      >
        {/* <View style={{ alignItems: "center" }}>
          <Ionicons
            name="star"
            size={15}
            color={Constants.colors.accent}
            style={{ position: "absolute", top: -8, zIndex: 1, backgroundColor: Colors.primary, borderRadius: 12 }}
            
          /> */}
        <Image source={{ uri: item.images }} style={styles.image} />
        {/* </View> */}
        <View style={styles.middleContent}>
          <Text
            style={{
              fontFamily: "bold",
              fontSize: Font.md,
              padding: Spacing.sm,
            }}
          >
            {extractAddress(item.address)}
          </Text>
          <View style={styles.bottomRow}>
            <View style={styles.bottomLeft}>
              <Ionicons name="location-sharp" size={14} color={Colors.accent} />
              <Text style={{ fontSize: Font.sm }}>3 miles away</Text>
            </View>
            <View style={styles.bottomRight}>
              {/* <FontAwesome5
                name="plug"
                size={14}
                color={Colors.blueVariations.steelBlue}
              /> */}
              <Image
                source={require("../../assets/images/level2a.png")}
                style={{ width: 16, height: 16 }}
              />
              <Text style={{ fontSize: Font.sm, color: Colors.secondary }}>
                Type 2
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "bold",
            fontSize: Font.md,
            padding: Spacing.md,
            position: "absolute",
            top: Spacing.sm,
            right: Spacing.sm,
          }}
        >
          ${item.price_per_hour}{" "}
          <Text style={{ fontFamily: "light", fontSize: Font.sm }}>/kWh</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.basic.white }}>
        {/* <Text style={{fontFamily: "bold",fontSize: Font.lg, textAlign: 'center',}}>All Listing</Text> */}
        <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}>
          <ProfileBar />
        </View>
        <View style={{ flex: 1, backgroundColor: Colors.basic.white }}>
          <View style={styles.searchBar}>
            <SearchBar />
          </View>

          {/* <View style={styles.searchcontainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={Font.lg}
              color="gray"
              style={styles.iconLeft}
            />
            <TextInput
              placeholder="Search for a charger near you"
              style={styles.searchInput}
              placeholderTextColor="gray"
            />
            <TouchableOpacity>
              <Ionicons
                name="filter"
                size={Font.lg}
                color="gray"
                style={styles.iconRight}
              />
            </TouchableOpacity>
          </View>
        </View> */}

          <View style={styles.navcontainer}>
            <View style={styles.navItem}>
              <Entypo name="map" size={Font.lg} color={Colors.basic.white} />
              <Text
                style={{
                  fontSize: Font.sm,
                  color: Colors.basic.white,
                  padding: Spacing.xs,
                }}
              >
                Map
              </Text>
            </View>
            <View style={styles.navItem}>
              <Ionicons name="list" size={Font.lg} color={Colors.basic.white} />
              <Text
                style={{
                  fontSize: Font.sm,
                  color: Colors.basic.white,
                  padding: Spacing.xs,
                }}
              >
                List
              </Text>
            </View>
            <View style={styles.navItem}>
              <Ionicons
                name="heart"
                size={Font.lg}
                color={Colors.basic.white}
              />
              <Text
                style={{
                  fontSize: Font.sm,
                  color: Colors.basic.white,
                  padding: Spacing.xs,
                }}
              >
                Favorites
              </Text>
            </View>
          </View>

          <View style={styles.listcontainer}>
            <FlatList
              data={listings}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
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
            onChooseListing={() => bottomSheetRef.current?.close()}
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
