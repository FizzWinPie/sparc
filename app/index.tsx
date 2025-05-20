import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const Index = () => {
  const { isSignedIn } = useAuth();
  console.log("Signed In:", isSignedIn);

  if (isSignedIn) {
    return <Redirect href={"/(tabs)/fullMap"} />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default Index;
