import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignUp, useSSO, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { ReactNativeModal } from "react-native-modal";
import { addNewUser } from "@/lib/user";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import Constants from "@/constants/Constants";
import { VerificationCodeInput } from "@/components/CodeVerification";
import { useLoading } from "@/utils/LoadingContext";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
}

export default function SignUpScreen() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [code, setCode] = useState("");
  const { user } = useUser();
  const { setLoading } = useLoading();

  const onSelectAuth = async (strategy: Strategy) => {
    try {
      setLoading(true);

      const { createdSessionId, setActive: setSessionActive } =
        await startSSOFlow({
          strategy,
        });

      if (createdSessionId && setSessionActive) {
        await setSessionActive({ session: createdSessionId });
        if (user) {
          const email = user.primaryEmailAddress?.emailAddress;
          const clerkId = user.id;
          // const name = user.firstName || "";
          // const phoneNumber = user.phoneNumbers?.[0]?.phoneNumber || "";
          
          if (email && clerkId) {
            await addNewUser(email, clerkId);
          } else {
            console.error("Email or ClerkId is undefined");
          }
        }
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      console.error("SSO error", err);
    } finally {
      setLoading(false)
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);

      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: email.split("@")[0],
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert(
        "Code resent",
        "Check your email for the new verification code."
      );
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to resend code");
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code,
      });
      if (completeSignUp.status === "complete") {
        if (completeSignUp.createdUserId) {
          await addNewUser(email, completeSignUp.createdUserId);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={require("../../assets/images/onboard/world.png")}
        style={styles.headerImage}
        resizeMode="contain"
      />
      <View style={styles.formContainer}>
        <Text style={styles.helloText}>Hello!</Text>
        <Text style={styles.signUpText}>
          <Text style={{ color: Colors.accent }}>Sign Up</Text> for a new
          account
        </Text>
        <View style={styles.inputFieldsContainer}>
          <View style={styles.inputRow}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={Colors.accent}
              style={styles.inputIcon}
            />
            <TextInput
              autoCapitalize="none"
              value={email}
              placeholder="Enter email"
              placeholderTextColor="#888"
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={Colors.accent}
              style={styles.inputIcon}
            />
            <TextInput
              value={password}
              placeholder="Enter password"
              secureTextEntry
              placeholderTextColor="#888"
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onSignUpPress} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signInLinkContainer}>
        <Link href="/sign-in">
          <Text style={{ color: "gray" }}>
            Already have an account?{" "}
            <Text style={{ color: Colors.accent }}>Sign In</Text>
          </Text>
        </Link>
      </View>

      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => onSelectAuth(Strategy.Google)}>
          <View style={styles.socialButton}>
            <Image
              source={require("../../assets/images/google-logo.png")}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSelectAuth(Strategy.Apple)}>
          <View style={styles.socialButton}>
            <Ionicons name="logo-apple" size={20} />
            <Text>Continue with Apple</Text>
          </View>
        </TouchableOpacity>

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onBackdropPress={() =>
            setVerification({ ...verification, state: "default" })
          }
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="mail" size={20} color={Colors.accent} />
            </View>
            <Text style={styles.modalTitle}>Verify your email</Text>
            <Text style={styles.modalSubtitle}>
              We have sent a verification code to your email{"\n"}
              <Text style={styles.modalEmail}>{email}</Text>
            </Text>
            <VerificationCodeInput value={code} setValue={setCode} />
            {verification.error && (
              <Text style={styles.errorText}>{verification.error}</Text>
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={onPressVerify}
                style={styles.verifyButton}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
              <View style={styles.resendContainer}>
                <Text style={{ color: "gray" }}>Didn't receive a code? </Text>
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={{ color: Colors.accent }}>Resend Code</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ReactNativeModal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  headerImage: {
    height: 220,
    width: 400,
    marginBottom: Spacing.md,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 50,
  },
  helloText: {
    fontSize: Font.lg,
    fontWeight: "bold",
    marginBottom: Spacing.sm,
  },
  signUpText: {
    fontSize: Font.md,
    marginBottom: Spacing.lg,
  },
  inputFieldsContainer: {
    alignSelf: "flex-start",
    width: "100%",
    gap: Spacing.md,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  input: {
    flex: 1,
    color: "#222",
  },
  buttonContainer: {
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: Colors.secondary,
    width: 250,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Constants.borderRadius,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontFamily: "bold",
  },
  signInLinkContainer: {
    display: "flex",
    flexDirection: "row",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 45,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: Spacing.sm,
    color: "#888",
    fontWeight: "400",
  },
  socialContainer: {
    gap: 15,
    alignSelf: "center",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialText: {
    fontFamily: "regular",
  },
  modalContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: Constants.borderRadius,
  },
  modalIconContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a1eade",
    width: 50,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 6,
    borderColor: "#c8f4ec",
    borderWidth: 3,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 8,
    alignSelf: "center",
    color: Colors.secondary,
  },
  modalSubtitle: {
    fontSize: Font.sm,
    fontFamily: "light",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.secondary,
  },
  modalEmail: {
    color: Colors.accent,
    fontFamily: "regular",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  modalButtonContainer: {
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  verifyButton: {
    backgroundColor: Colors.secondary,
    width: 250,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Constants.borderRadius,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "white",
    fontFamily: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
  },
});
