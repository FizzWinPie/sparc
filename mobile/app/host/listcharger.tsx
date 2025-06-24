import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

type FormFields = {
  charger_type: string;
  power_output_kw: string;
  connector_type: string;
  address: string;
  availability_schedule: string;
  price_per_hour: string;
  min_price: string;
  instructions: string;
  is_active: boolean;
  image_url: string;
};

const inputFields: {
  key: keyof FormFields;
  placeholder: string;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
}[] = [
  { key: "charger_type", placeholder: "Charger Type" },
  { key: "power_output_kw", placeholder: "Power Output (kW)", keyboardType: "numeric" },
  { key: "connector_type", placeholder: "Connector Type" },
  { key: "address", placeholder: "Address" },
  { key: "availability_schedule", placeholder: "Availability Schedule" },
  { key: "price_per_hour", placeholder: "Price Per Hour ($)", keyboardType: "numeric" },
  { key: "min_price", placeholder: "Minimum Price ($)", keyboardType: "numeric" },
  { key: "instructions", placeholder: "Instructions", multiline: true },
  { key: "image_url", placeholder: "Image URL" },
];

const ListCharger = () => {
  const router = useRouter();

  const [form, setForm] = useState<FormFields>({
    charger_type: "",
    power_output_kw: "",
    connector_type: "",
    address: "",
    availability_schedule: "",
    price_per_hour: "",
    min_price: "",
    instructions: "",
    is_active: false,
    image_url: "",
  });

  const handleInput = (field: keyof FormFields, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        host_id: "host id placeholder",
      };
      const res = await fetch(`{}:8000/api/listings`, { //need to add IP
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create listing");
      }

      const data = await res.json();
      Alert.alert("Success", "Listing Successfully Added!");
      console.log("Listing created:", data);
      router.push("/host");
    } catch (err: any) {
      console.error("Error submitting listing:", err);
      Alert.alert("Error", err.message);
    }
  };

  return (
    <>
     <Stack.Screen 
        options={{ 
          title: "List Your Charger",
          headerTitleStyle: {
            fontFamily: "bold",
            fontSize: Font.lg,
          },
          headerShown: true,
        }} 
      />
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.basic.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              padding: Spacing.lg,
              gap: Spacing.md,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={{ fontSize: Font.md, fontWeight: "bold" }}>
              Input Information about your charger
            </Text>

            {inputFields.map(({ key, placeholder, keyboardType, multiline }) => (
              <TextInput
                key={key}
                value={form[key] as string}
                placeholder={placeholder}
                keyboardType={keyboardType}
                onChangeText={(text) => handleInput(key, text)}
                placeholderTextColor= {Colors.basic.blue}
                multiline={multiline}
                style={{
                  backgroundColor: Colors.blueVariations.aliceBlue,
                  padding: Spacing.md,
                  borderRadius: Spacing.xl,
                  color: Colors.basic.black,
                  minHeight: multiline ? 80 : undefined,
                  textAlignVertical: multiline ? "top" : "center",
                }}
              />
            ))}

            <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.sm }}>
              <Text style={{ fontSize: Font.md }}>Active:</Text>
              <Switch
                value={form.is_active}
                onValueChange={(value) => handleInput("is_active", value)}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: Colors.secondary,
                padding: Spacing.md,
                borderRadius: Spacing.xl,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Colors.basic.white, fontFamily: "bold" }}>
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
  );
};

export default ListCharger;

