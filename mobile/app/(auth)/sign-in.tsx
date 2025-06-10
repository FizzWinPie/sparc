import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import dummyData from "@/constants/dummyData/dummy.js";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
}

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { startSSOFlow } = useSSO();

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
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello!</Text>

      <Text style={styles.subtitle}>Sign in to your account</Text>

      <TextInput
        autoCapitalize="none"
        value={email}
        placeholder="Enter email"
        onChangeText={(email) => setEmail(email)}
      />

      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <TouchableOpacity style={styles.continueButton} onPress={onSignInPress}>
        <Text style={styles.container}> Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.otherLoginButton} onPress={() => onSelectAuth(Strategy.Apple)}>
        <Ionicons name="logo-apple" size={24} />
        <Text>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.otherLoginButton} onPress={() => onSelectAuth(Strategy.Google)}>
        <Ionicons name="logo-google" size={24} />
        <Text>Continue with Google</Text>
      </TouchableOpacity>

      <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <Link href="/sign-up">
          <Text>Don't have an account? Sign up</Text>
        </Link>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {  
  fontSize: Font.md,
  flex: 1,
  color:"white",
  justifyContent: "center",
  alignItems: "center",
  },
  title: {
    fontSize: Font.xlg,
    fontFamily: "bold",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Font.lg,
    fontFamily: "bold",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  continueButton:{
    width: "100%",
    height: 70,
    backgroundColor: 'darkcyan',
    justifyContent: "center",
    alignItems: "center",
  },
  otherLoginButton:{
    width: "70%",
    height: 50,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});
