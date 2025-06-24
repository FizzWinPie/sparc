import React, { useRef, useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import Carousel, {
  ICarouselInstance,
} from "react-native-reanimated-carousel";
import OtherPage from "@/components/onboarding/OtherPage";
import WelcomePage from "@/components/onboarding/WelcomePage";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { useSharedValue } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    type: "page",
    title: "Charge Anywhere, Anytime",
    subtitle:
      "Find home EV chargers nearby — skip the lines and power up from driveways and garages around you.",
    image: require("../../assets/images/onboard/onboard3.png"),
  },
  {
    type: "page",
    title: "Turn Your Charger Into Income",
    subtitle:
      "Got a home charger? List it and earn money every time someone charges.",
    image: require("../../assets/images/onboard/house.png"),
  },
  {
    type: "component",
    title: "Welcome to plugPorch",
    subtitle: "Let's Get Started.",
    image: require("../../assets/images/onboard/onboard2.png"),
  },
];

const Onboarding = () => {
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useSharedValue<number>(0);

  const skipToEnd = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index: onboardingData.length - 1 });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {currentIndex !== onboardingData.length - 1 && (
        <TouchableOpacity onPress={skipToEnd} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={height}
        autoPlay={false}
        data={onboardingData}
        onProgressChange={progress}
        scrollAnimationDuration={500}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ index }) => {
          const item = onboardingData[index];

          if (item.type === "component") {
            return <WelcomePage />;
          }

          return (
            <View style={styles.slide}>
              <OtherPage
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                nextPage={() => {
                  if (carouselRef.current) {
                    carouselRef.current.next();
                  }
                }}
                progress={progress}
                data={onboardingData}
                carouselRef={carouselRef}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 30,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    color: Colors.accent,
    fontSize: Font.md,
    fontWeight: "regular",
  },
});

export default Onboarding;
