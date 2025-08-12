import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LoadingProvider } from "@/utils/LoadingContext";
import { StripeProvider } from '@stripe/stripe-react-native';

export {
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    light: require("../assets/fonts/Inter-ExtraLight.ttf"),  
    regular: require("../assets/fonts/Inter-Regular.ttf"),
    bold: require("../assets/fonts/Inter-SemiBold.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView>
      <LoadingProvider>
        <ClerkProvider
          tokenCache={tokenCache}
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ClerkLoaded>
            <StripeProvider
              publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
              merchantIdentifier="merchant.identifier" 
              urlScheme="your-url-scheme" 
            >
              <SafeAreaProvider>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </SafeAreaProvider>
            </StripeProvider>
          </ClerkLoaded>
        </ClerkProvider>
      </LoadingProvider>
    </GestureHandlerRootView>
  );
}
