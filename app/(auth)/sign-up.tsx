import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
}

export default function SignUpScreen() {
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
        router.back();
      }
    } catch (err) {
      console.error("SSO error", err);
    }
  };

  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignUpPress = async () => {
    console.log("Attempted singup -> implement the function")
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <View>
          <Image
            source={require("../../assets/images/car1.jpg")}
            style={styles.image}
          />
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
          Create New Account
        </Text>
        <TextInput
          autoCapitalize="none"
          value={username}
          placeholder="Username"
          onChangeText={(username) => setUsername(username)}
        />
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    gap: 3,
  },
  image: {
    width: "100%",
    height: 250,
  },
});
