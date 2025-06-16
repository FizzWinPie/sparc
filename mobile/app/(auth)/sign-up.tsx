import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Alert,
  Button,
  SafeAreaView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth, useSignUp, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { ReactNativeModal } from "react-native-modal";
import InputField from "@/components/InputField";
import { fetchAPI } from "@/lib/fetch";
// import { BACKEND_URL } from '@env';
import { addNewUser } from "@/lib/auth";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import Constants from "@/constants/Constants";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
}

export default function SignUpScreen() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const { isLoaded, signUp, setActive } = useSignUp();
  // const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSelectAuth = async (strategy: Strategy) => {
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
    }
  };

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    // console.log(BACKEND_URL)
    if (!isLoaded) return;
    try {
      await signUp.create({
        // username: username,
        emailAddress: email,
        password: password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        if (completeSignUp.createdUserId) {
          await addNewUser(email, completeSignUp.createdUserId);
          console.log("email: ", email, "\nClerkId: ", completeSignUp.createdUserId);
        } else {
          throw new Error("User ID is missing after sign up.");
        }
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
        router.replace("/(tabs)/home");
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
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
        source={require("../../assets/images/onboard/world.png")}
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
          Hello!
        </Text>
        <Text style={{ fontSize: Font.md, marginBottom: Spacing.lg }}>
          <Text style={{ color: Colors.accent }}>Sign Up</Text> for a new
          account
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
              name="lock-closed-outline"
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
          onPress={() => onSignUpPress()}
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
        <Link href="/sign-in">
          <Text style={{ color: "gray" }}>
            Already have an account?{" "}
            <Text style={{ color: Colors.accent }}>Sign In</Text>
          </Text>
        </Link>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 45,
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

