import React, { useState } from 'react';
import { TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const CLOUD_URL     = 'https://api.cloudinary.com/v1_1/drrcgoosq/upload';
const UPLOAD_PRESET = 'Sparc2025';

interface Props {
  size?: number;          
  startUrl?: string;      
  onChange: (url: string) => Promise<void> | void; 
}

export default function ProfileAvatar({ size = 140, startUrl, onChange }: Props) {
  const [url, setUrl]   = useState(startUrl);
  const [busy, setBusy] = useState(false);

  const pick = async () => {
    const pic = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });
    if (pic.canceled) return;

    setBusy(true);
    const fd = new FormData();
    fd.append('file', { uri: pic.assets[0].uri, name: 'avatar.jpg', type: 'image/jpeg' } as any);
    fd.append('upload_preset', UPLOAD_PRESET);

    const res  = await fetch(CLOUD_URL, { method: 'POST', body: fd });
    const json = await res.json();
    setBusy(false);

    setUrl(json.secure_url);
    await onChange(json.secure_url);   // let parent store URL
  };

  return (
    <TouchableOpacity onPress={pick} disabled={busy}>
      {busy ? (
        <ActivityIndicator size="large" />
      ) : url ? (
        <Image source={{ uri: url }} style={[styles.img, { width: size, height: size }]} />
      ) : (
        <Ionicons name="person-circle" size={size} color="#0a2d48" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  img: { borderRadius: 999 },
});
