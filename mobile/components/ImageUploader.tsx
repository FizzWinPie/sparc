import React, { useState } from "react";
import { View, Button, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";

const CLOUD_URL = "https://api.cloudinary.com/v1_1/drrcgoosq/upload";
const UPLOAD_PRESET = "Sparc2025";

interface Props {
  label?: string;
  onUrl: (url: string) => void;
}

export default function ImageUploader({
  label = "Upload image",
  onUrl,
}: Props) {
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const pickUpload = async () => {
    const pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });
    if (pick.canceled) return;

    setBusy(true);
    const form = new FormData();
    form.append("file", {
      uri: pick.assets[0].uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);
    form.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(CLOUD_URL, { method: "POST", body: form });
    const json = await res.json();
    setBusy(false);
    setPreview(json.secure_url);
    onUrl(json.secure_url);
  };

  return (
    <View style={{ alignItems: "center", marginVertical: 12 }}>
      {preview && (
        <Image
          source={{ uri: preview }}
          style={{ width: 170, height: 170, borderRadius: 8, marginBottom: 8 }}
        />
      )}
      {busy ? (
        <ActivityIndicator />
      ) : (
        <Button title={label} onPress={pickUpload} />
      )}
    </View>
  );
}
