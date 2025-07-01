import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import { Entypo, Ionicons } from "@expo/vector-icons";

const AllListingsNav = () => {
  return (
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
        <Ionicons name="heart" size={Font.lg} color={Colors.basic.white} />
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

export default AllListingsNav;
