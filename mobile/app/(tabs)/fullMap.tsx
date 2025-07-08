import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import ListingsMap from "@/components/ListingsMap";
import ProfileBar from "@/components/ProfileBar";
import { BlurView } from "expo-blur";
import Spacing from "@/constants/Spacing";
import SearchBar from "@/components/SearchBar";
import useListings from "@/utils/hooks/useListings";

const fullMap = () => {
  const { listings } = useListings();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ListingsMap listings={listings} snapPoints={["45%", "70%"]} />
        <View style={styles.searchBar}>
          <SearchBar />
        </View>
        <BlurView intensity={6} tint="light" style={styles.blurOverlay} />
        <View style={styles.profileBarWrapper}>
          <ProfileBar />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  blurOverlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 105,
    zIndex: 1,
  },
  searchBar: {
    zIndex: 2,
    position: "absolute",
    top: 80,
    width: "95%",
    alignSelf: "center",
  },

  profileBarWrapper: {
    position: "absolute",
    top: 60,
    paddingHorizontal: Spacing.lg,
    width: "100%",
    zIndex: 1,
  },
});

export default fullMap;
