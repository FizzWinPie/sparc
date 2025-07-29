import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { BlurView } from "expo-blur";
import ProfileBar from "@/components/ProfileBar";
import ListingsMap from "@/components/ListingsMap";
import HomeBottomScreen from "@/components/HomeBottomScreen";
import SearchBar from "@/components/SearchBar";
import Spacing from "@/constants/Spacing";
import useListings from "@/utils/hooks/useListings";
import Message from "@/components/Message";
import { useUser } from "@clerk/clerk-expo";
import GoogleButton from "@/components/GoogleButton";
import AppleButton from "@/components/AppleMapsButton";

const Home = () => {
  const { listings } = useListings();
  const {user} = useUser();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.map}>
          <BlurView intensity={5} tint="light" style={styles.blurOverlay} />
          <View style={styles.profileBarWrapper}>
            <ProfileBar />
          </View>
          <View style={styles.searchBar}>
            <SearchBar />
          </View>
          <ListingsMap listings={listings} snapPoints={["60%"]} />
        </View>
        <View style={styles.bottomScreen}>
          {/* <Message conversationId={"687fe7c31c42c3b567b480d2"} userId={user?.id ?? ""} /> */}
          <HomeBottomScreen />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    height: "50%",
  },
  bottomScreen: {
    height: "50%",
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 105,
    zIndex: 1,
  },
  profileBarWrapper: {
    position: "absolute",
    top: 60,
    paddingHorizontal: Spacing.lg,
    width: "100%",
    zIndex: 1,
  },
  searchBar: {
    zIndex: 2,
    position: "absolute",
    top: 80,
    width: "95%",
    alignSelf: "center",
  },
});

export default Home;
