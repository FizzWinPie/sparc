import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const CLOUD_URL     = 'https://api.cloudinary.com/v1_1/drrcgoosq/upload';
const UPLOAD_PRESET = 'Sparc2025';

interface Props {
  size?: number;
  startUrl?: string;
  onChange: (p: { remoteUrl: string; localUri: string; type?: string | null }) => Promise<void> | void;
}

export default function Avatar({ size = 140, startUrl, onChange }: Props) {
  const [url, setUrl] = useState(startUrl);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (startUrl && startUrl !== url) setUrl(startUrl);
  }, [startUrl]);

  const pick = async () => {
    const MEDIA_IMAGES =
      (ImagePicker as any).MediaType?.Images ??
      ImagePicker.MediaTypeOptions.Images;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: MEDIA_IMAGES as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (result.canceled) return;

    const asset = result.assets[0];

    try {
      setBusy(true);

      const fd = new FormData();
      fd.append('file', {
        uri: asset.uri,
        name: 'avatar.jpg',
        type: asset.mimeType || 'image/jpeg',
      } as any);
      fd.append('upload_preset', UPLOAD_PRESET);

      const res  = await fetch(CLOUD_URL, { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.secure_url) {
        throw new Error(json?.error?.message || 'Upload failed');
      }

      setUrl(json.secure_url); 
      await onChange({
        remoteUrl: json.secure_url,
        localUri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
      });
    } catch (e: any) {
      Alert.alert('Upload failed', e?.message ?? 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableOpacity onPress={pick} disabled={busy} accessibilityRole="imagebutton">
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
  img: { borderRadius: 999, backgroundColor: '#eee' },
});
