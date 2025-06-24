import { View, Text, Button } from 'react-native'
import React from 'react'
import { SignOutButton } from '@/components/SignOutButton'
import { useRouter } from "expo-router";

const host = () => {
  const router = useRouter();

  return (
    <View style={{backgroundColor: "white"}}>
      <Text>Host Page</Text>
      <Button title="lallet" onPress={() => router.push("/host/wallet")} /> 
      <Button title="List Charger" onPress={() => router.push("/host/listcharger")} /> 
    </View>
  )
}

export default host;
