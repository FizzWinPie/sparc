import { TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLoading } from "@/utils/LoadingContext";
import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";

export default function ProfileAvatar() {
  const { user } = useUser();
  const { setLoading } = useLoading();
  const [uploading, setUploading] = useState(false);
  const profilePic = (user?.publicMetadata?.avatarUrl as string) || user?.imageUrl || '';

  const handleInput = async () => {
    if (!user) return;
    
    setLoading(true);
    setUploading(true);
    
    try {
      const picture = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
        base64: true,
      });

      if (picture.canceled || !picture.assets[0]) {
        return;
      }

      if (picture.assets[0].base64) {
        const base64Data = `data:${picture.assets[0].mimeType};base64,${picture.assets[0].base64}`;
        await user.setProfileImage({ file: base64Data });
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handleInput} disabled={uploading}>
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : profilePic ? (
        <Image 
          source={{ uri: profilePic }} 
          style={{ width: 160, height: 160, borderRadius: 999 }} 
        />
      ) : (
        <Ionicons name="person-circle" size={160} color="#0a2d48" />
      )}
    </TouchableOpacity>
  );
}
