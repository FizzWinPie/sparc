import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import Constants from "@/constants/Constants";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";

import { SharedValue } from "react-native-reanimated";
import {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

interface OtherPageProps {
  nextPage: () => void;
  title: string;
  subtitle: string;
  image: number;
  progress: SharedValue<number>;
  data: any[];
  carouselRef: React.RefObject<ICarouselInstance | null>;
}

const OtherPage: React.FC<OtherPageProps> = ({
  nextPage,
  title,
  subtitle,
  image,
  progress,
  data,
  carouselRef,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={image} style={styles.image} resizeMode="contain" />
        <Text style={styles.welcome}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={{
            backgroundColor: Colors.secondary,
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
          }}
          activeDotStyle={{ backgroundColor: Colors.accent }}
          containerStyle={{
            gap: 12,
            // paddingTop: 20
            position: "absolute",
            bottom: 300,
            // bottom: 80,
            alignSelf: "center",
          }}
          onPress={(index) => {
            carouselRef.current?.scrollTo({
              count: index - progress.value,
              animated: true,
            });
          }}
        />

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={nextPage}
          style={[styles.button, { backgroundColor: Colors.secondary }]}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>NEXT</Text>
            {/* <Ionicons
              name="chevron-forward-outline"
              size={15}
              color="white"
              style={{ marginLeft: 2 }}
            /> */}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  image: {
    height: 220,
    width: 390,
    marginBottom: Spacing.md,
  },
  welcome: {
    fontSize: Spacing.lg,
    fontFamily: "regular",
    textAlign: "center",
    marginBottom: Spacing.md,
    color: Colors.accent,
  },
  subtitle: {
    fontSize: Font.sm,
    fontFamily: "light",
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
  },
  buttons: {
    alignItems: "center",
  },
  button: {
    width: 250,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Constants.borderRadius,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "bold",
  },
});

export default OtherPage;
