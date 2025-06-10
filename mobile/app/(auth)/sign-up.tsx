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
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth, useSignUp, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { ReactNativeModal } from "react-native-modal";
import InputField from "@/components/InputField";
import { fetchAPI } from "@/lib/fetch";
// import { BACKEND_URL } from '@env';
import { addNewUser } from "@/lib/auth";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import dummyData from "@/constants/dummyData/dummy.js";

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
          console.log(email, completeSignUp.createdUserId);
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
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.mainContainer}>
        <View>
          <Image
            source={require("../../assets/images/car1.jpg")}
            style={styles.image}
          />
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
          Create New Account
        </Text>
        {/* <TextInput
          autoCapitalize="none"
          value={username}
          placeholder="Enter username"
          onChangeText={(username) => setUsername(username)}
        /> */}
        <TextInput
          autoCapitalize="none"
          value={email}
          placeholder="Enter email"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          autoCapitalize="none"
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignUpPress}>
          <Text>Continue</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          <Text>Already have an account?</Text>
          <Link href="/sign-in">
            <Text>Sign in</Text>
          </Link>
        </View>
        <TouchableOpacity onPress={() => onSelectAuth(Strategy.Apple)}>
          <Ionicons name="logo-apple" size={24} />
          <Text>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSelectAuth(Strategy.Google)}>
          <Ionicons name="logo-google" size={24} />
          <Text>Continue with Google</Text>
        </TouchableOpacity>

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onBackdropPress={() =>
            setVerification({ ...verification, state: "default" })
          }
          onModalHide={() => {
            if (verification.state === "success") {
              // setShowSuccessModal(true);
            }
          }}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to {email}.
            </Text>
            <InputField
              label={"Code"}
              // icon={"~/assets/images/icon.png"}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text style={styles.error}>{verification.error}</Text>
            )}
            <Button title="Verify Email" onPress={onPressVerify} />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    gap: 3,
  },
  image: {
    width: "100%",
    height: 250,
  },
  container: {
    backgroundColor: "white",
    paddingHorizontal: 28,
    paddingVertical: 36,
    borderRadius: 24,
    minHeight: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 20,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
});
