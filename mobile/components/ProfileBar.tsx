import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import { router, useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { fetchUnreadCount } from "@/lib/notifications";

const ProfileBar = () => {
  const navigation = useNavigation();
  const { user, isLoaded } = useUser();
  const profilePic =
    (user?.publicMetadata?.avatarUrl as string) || user?.imageUrl || "";
  const [unread, setUnread] = useState(0);

  const loadCount = useCallback(async () => {
    try {
      if (!user) return;
      const c = await fetchUnreadCount(user.id);
      setUnread(c);
    } catch {}
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadCount();
    const id = setInterval(loadCount, 10000);
    return () => clearInterval(id);
  }, [user, loadCount]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userSection}
        onPress={() => router.push("./profile")}
      >
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.avatar} />
        ) : (
          <Ionicons
            name="person-circle"
            style={styles.userIcon}
            color={Colors.secondary}
          />
        )}
        <Text style={styles.welcomeText}>Welcome {user?.firstName ?? ""}</Text>
      </TouchableOpacity>

      <View style={styles.iconSection}>
        <TouchableOpacity onPress={() => router.push("./channels")}>
          <Ionicons name="chatbubble-ellipses-outline" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconWrap}
          onPress={() => router.push("/notifications")}
          accessibilityLabel="Notifications"
        >
          <Ionicons
            name="notifications-outline"
            style={styles.icon}
            color={unread > 0 ? "#FF3B30" : undefined}
          />
          {unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unread > 99 ? "99+" : String(unread)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between" },
  userSection: { flexDirection: "row", alignItems: "center", gap: 6 },
  userIcon: { fontSize: 40 },
  welcomeText: { fontFamily: "regular", color: Colors.secondary },
  iconSection: { flexDirection: "row", alignItems: "center", gap: 6 },
  iconWrap: { position: "relative", padding: 4 },
  icon: { fontSize: Font.lg },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#eee" },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  badgeText: { fontSize: 10, lineHeight: 12, color: "#fff", fontWeight: "700" },
});

export default ProfileBar;
