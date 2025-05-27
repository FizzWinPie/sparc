import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

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
    <View>
      <Text>Sign in</Text>
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
      <TouchableOpacity onPress={onSignInPress}>
        <Text>Continue</Text>
      </TouchableOpacity>
      <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <Link href="/sign-up">
          <Text>Don't have an account? Sign up</Text>
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
    </View>
  );
}
