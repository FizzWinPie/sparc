import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import Constants from "@/constants/Constants";
import Font from "@/constants/Font";
import { useLoading } from "@/utils/LoadingContext";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
}

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const{ setLoading } = useLoading();

  const onSelectAuth = async (strategy: Strategy) => {
    setLoading(true);
    try {
      const { createdSessionId, setActive: setSessionActive } =
        await startSSOFlow({
          strategy,
        });

      if (createdSessionId && setSessionActive) {
        await setSessionActive({ session: createdSessionId });
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      console.error("SSO error", err);
    } finally {
      setLoading(false);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
      }}
    >
      <Image
        source={require("../../assets/images/onboard/onboard2.png")}
        style={{ height: 220, width: 400, marginBottom: Spacing.md }}
        resizeMode="contain"
      />
      <View
        style={{
          width: "100%",
          paddingHorizontal: 50,
        }}
      >
        <Text
          style={{
            fontSize: Font.lg,
            fontWeight: "bold",
            marginBottom: Spacing.sm,
          }}
        >
          Welcome back!
        </Text>
        <Text style={{ fontSize: Font.md, marginBottom: Spacing.lg }}>
          <Text style={{color: Colors.accent}}>Sign In</Text> to your account
        </Text>
        <View
          style={{ alignSelf: "flex-start", width: "100%", gap: Spacing.md }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: 30,
              paddingHorizontal: Spacing.md,
              paddingVertical: 12,
            }}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={Colors.accent}
              style={{ marginRight: Spacing.sm, marginLeft: Spacing.xs }}
            />
            <TextInput
              autoCapitalize="none"
              value={email}
              placeholder="Enter email"
              placeholderTextColor="#888"
              onChangeText={setEmail}
              style={{
                flex: 1,
                color: "#222",
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: 30,
              paddingHorizontal: Spacing.md,
              paddingVertical: 12,
            }}
          >
            <Ionicons
              name="lock-open-outline"
              size={20}
              color={Colors.accent}
              style={{ marginRight: Spacing.sm, marginLeft: Spacing.xs }}
            />
            <TextInput
              value={password}
              placeholder="Enter password"
              secureTextEntry
              placeholderTextColor="#888"
              onChangeText={setPassword}
              style={{
                flex: 1,
                color: "#222",
              }}
            />
          </View>
        </View>
      </View>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => onSignInPress()}
          style={{
            backgroundColor: Colors.secondary,
            width: 250,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            borderRadius: Constants.borderRadius,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontFamily: "bold" }}>Continue</Text>
        </TouchableOpacity>
      </View>

      <View style={{ display: "flex", flexDirection: "row" }}>
        <Link href="/sign-up">
          <Text style={{ color: "gray" }}>
            Don't have an account?{" "}
            <Text style={{ color: Colors.accent }}>Sign up</Text>
          </Text>
        </Link>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 45
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
        <Text
          style={{
            marginHorizontal: Spacing.sm,
            color: "#888",
            fontWeight: "regular",
          }}
        >
          OR
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
      </View>

      <View style={{ gap: 15, alignSelf: "center" }}>
        <TouchableOpacity onPress={() => onSelectAuth(Strategy.Google)}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Image
              source={require("../../assets/images/google-logo.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text style={{ fontFamily: "regular" }}>Continue with Google</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSelectAuth(Strategy.Apple)}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="logo-apple" size={20} />
            <Text>Continue with Apple</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
