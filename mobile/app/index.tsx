import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const Index = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(tabs)/channels"} />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default Index;
