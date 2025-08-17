import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Spacing from "@/constants/Spacing";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ReactNativeModal from "react-native-modal";
import { useUser } from "@clerk/clerk-expo";
import Constants from "@/constants/Constants";
import Font from "@/constants/Font";
import { deleteUser, updateUser } from "@/lib/user";
import { router } from "expo-router";
import Avatar from '@/components/Avatar';


const ProfileUser = () => {
  const { user, isLoaded } = useUser();
  const hasPassword = user?.passwordEnabled;
  const clerkId = user?.id;
  const [avatarUrl, setAvatarUrl] = useState(user?.imageUrl ?? '')
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = async () => {
    try {
      if (!user) return;

      if (firstName && firstName !== user.firstName) {
        await user.update({ firstName });
      }

      if (email && email !== user.primaryEmailAddress?.emailAddress) {
        const newEmail = await user.createEmailAddress({ email });
        await newEmail.prepareVerification({ strategy: "email_code" });
        await user.update({ primaryEmailAddressId: newEmail.id });
      }

      if (newPassword) await handlePasswordUpdate();

      if (clerkId) await updateUser(email, clerkId, firstName, { avatarUrl });

      setEditModalVisible(false);
    } catch (err: any) {
      setErrorMessage(err?.errors?.[0]?.message || "Failed to update.");
      console.error("Update error:", err);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!user) return;

      if (hasPassword) {
        await user.updatePassword({ currentPassword, newPassword });
      } else {
        await user.updatePassword({ currentPassword: newPassword, newPassword });
      }
    } catch (err: any) {
      setErrorMessage(err?.errors?.[0]?.message || "Password update failed.");
      console.error("Password update error:", err);
    }
  };

  const handleDeleteAccount = () => {
    if (!user || !clerkId) return;

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(email, clerkId);
              await user.delete();
              router.replace("/(auth)/welcome");
            } catch (err) {
              console.error("Account deletion failed", err);
              setErrorMessage("Failed to delete account");
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: Spacing.lg,
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Avatar />
      <Text
        style={{ fontFamily: "bold", fontSize: Spacing.md, marginBottom: 4 }}
      >
        {firstName || "User"}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text style={{ fontFamily: "light", fontSize: 12 }}>{email}</Text>
        <Ionicons
          name="create-outline"
          color={Colors.accent}
          size={12}
          onPress={() => setEditModalVisible(true)}
        />
      </View>

      <ReactNativeModal
        isVisible={editModalVisible}
        onBackdropPress={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalIconContainer}>
            <Ionicons name="create-outline" size={20} color={Colors.accent} />
          </View>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <Text style={styles.modalSubtitle}>
            You can update your profile details below.
          </Text>

          <View style={styles.inputFieldsContainer}>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#888"
                style={styles.input}
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={20} color={Colors.accent} style={styles.inputIcon} />
              <TextInput
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor="#888"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            {hasPassword && (
              <>
                <View style={[styles.inputRow, { alignItems: "center" }]}>
                  <Ionicons name="lock-open-outline" size={20} color={Colors.accent} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Current Password"
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholderTextColor="#888"
                    style={styles.input}
                  />
                </View>
                <View style={[styles.inputRow, { alignItems: "center" }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.accent} style={styles.inputIcon} />
                  <TextInput
                    placeholder="New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholderTextColor="#888"
                    style={styles.input}
                  />
                </View>
              </>
            )}
          </View>

          {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={handleUpdate} style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteAccount}>
              <Text style={{ color: Colors.danger }}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default ProfileUser;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: Constants.borderRadius,
  },
  modalIconContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a1eade",
    width: 50,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 6,
    borderColor: "#c8f4ec",
    borderWidth: 3,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 8,
    alignSelf: "center",
    color: Colors.secondary,
  },
  modalSubtitle: {
    fontSize: Font.sm,
    fontFamily: "light",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.secondary,
  },
  inputFieldsContainer: { alignSelf: "flex-start", width: "100%", gap: Spacing.md },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  inputIcon: { marginRight: Spacing.sm, marginLeft: Spacing.xs },
  input: { flex: 1, color: "#222" },
  errorText: { color: "red", fontSize: 14, marginTop: 4 },
  modalButtonContainer: { alignItems: "center", marginTop: Spacing.lg, gap: Spacing.md },
  verifyButton: {
    backgroundColor: Colors.secondary,
    width: 250,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Constants.borderRadius,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "white",
    fontFamily: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
  },
});
