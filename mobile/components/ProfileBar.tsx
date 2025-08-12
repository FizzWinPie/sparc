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

  const [avatar, setAvatar] = useState<string>("");
  const [ver, setVer] = useState(0);

  const setIfDiff = useCallback((next: string) => {
    if (next && next !== avatar) {
      setAvatar(next);
      setVer((v) => v + 1);
    }
  }, [avatar]);

  const readUnsafeAvatar = useCallback(() => {
    const metaUrl = (user?.unsafeMetadata as any)?.avatarUrl as string | undefined;
    return metaUrl || "";
  }, [user?.unsafeMetadata]);

  useEffect(() => {
    if (!isLoaded) return;
    setIfDiff(readUnsafeAvatar());
  }, [isLoaded, readUnsafeAvatar, setIfDiff]);

  useEffect(() => {
    const onFocus = async () => {
      try { await user?.reload(); } catch {}
      setIfDiff(readUnsafeAvatar());
      loadCount();
    };
    const unsub = navigation.addListener("focus", onFocus);
    return () => unsub();
  }, [navigation, user, readUnsafeAvatar, setIfDiff, loadCount]);

  const avatarUri = useMemo(() => {
    if (!avatar) return "";
    const sep = avatar.includes("?") ? "&" : "?";
    return `${avatar}${sep}v=${ver}`;
  }, [avatar, ver]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userSection}
        onPress={() => router.push("./profile")}
        disabled={!isLoaded}
      >
        {avatarUri ? (
          <Image
            key={avatarUri}
            source={{ uri: avatarUri }}
            style={styles.avatar}
            onError={() => setAvatar("")}
          />
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
        <View style={styles.iconWrap}>
          <Ionicons name="chatbubble-ellipses-outline" style={styles.icon} />
        </View>

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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
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
