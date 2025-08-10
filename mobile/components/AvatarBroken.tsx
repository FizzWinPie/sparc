import React, { useState } from "react";
import {
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

const CLOUD_URL = "https://api.cloudinary.com/v1_1/drrcgoosq/upload";
const UPLOAD_PRESET = "Sparc2025";

interface Props {
  size?: number;
  startUrl?: string;
  onChange: (url: string) => Promise<void> | void;
}


export default function ProfileAvatar({
  size = 140,
  startUrl,
  onChange,
}: Props) {
  const {user} = useUser();
  const [url, setUrl] = useState(startUrl);
  const [busy, setBusy] = useState(false);

    const pick = async () => {
    const pic = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
      base64: true,
    });
    
    if (pic.canceled) return;

    setBusy(true);
    
    try {
      // Option 1: Upload to Cloudinary first
      const fd = new FormData();
      fd.append("file", {
        uri: pic.assets[0].uri,
        name: "avatar.jpg",
        type: pic.assets[0].mimeType || "image/jpeg",
      } as any);
      fd.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(CLOUD_URL, { method: "POST", body: fd });
      const json = await res.json();
      
      setUrl(json.secure_url);
      
      // Option 2: Set profile image directly from base64
      if (pic.assets[0].base64 && user) {
        const base64Data = `data:${pic.assets[0].mimeType};base64,${pic.assets[0].base64}`;
        await user.setProfileImage({ file: base64Data });
      }
      
      await onChange(json.secure_url);
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableOpacity onPress={pick} disabled={busy}>
      {busy ? (
        <ActivityIndicator size="large" />
      ) : url ? (
        <Image
          source={{ uri: url }}
          style={[styles.img, { width: size, height: size }]}
        />
      ) : (
        <Ionicons name="person-circle" size={size} color="#0a2d48" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  img: { borderRadius: 999 },
});
