import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import {
  fetchNotifications,
  markNotificationRead,
  AppNotification,
} from "@/lib/notifications";

const timeAgo = (iso: string) => {
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return d.toLocaleString();
};

const COLORS = {
  bg: "#F6F7F9",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  unreadTint: "#F1F7FF",
  info: "#3B82F6",   
  border: "#E5E7EB",
};

export default function Notifications() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      const notes = await fetchNotifications(user.id);
      setData(notes);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded) load();
  }, [isLoaded, load]);

  const onPressItem = async (id: string) => {
    try {
      await markNotificationRead(id);
      setData(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));
    } catch {}
  };

  const markAllRead = async () => {
    const unreadIds = data.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length === 0) return;
    try {
      await Promise.all(unreadIds.map(id => markNotificationRead(id)));
      setData(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const displayed = useMemo(
    () => (filter === "unread" ? data.filter(n => !n.read) : data),
    [data, filter]
  );

  const renderItem = ({ item }: { item: AppNotification }) => {
    const unread = !item.read;
    const accentColor = unread ? COLORS.info : COLORS.border;
    const iconColor = unread ? COLORS.info : COLORS.muted;

    return (
      <TouchableOpacity
        onPress={() => onPressItem(item._id)}
        activeOpacity={0.85}
        style={styles.cardWrap}
      >
        <View style={[styles.card, unread && { backgroundColor: COLORS.unreadTint }]}>
          <View style={[styles.accent, { backgroundColor: accentColor }]} />
          <Ionicons
            name="notifications-outline"
            size={22}
            color={iconColor}
            style={{ marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={2} style={[styles.title, unread && styles.titleUnread]}>
              {item.message}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={14} color={COLORS.muted} />
              <Text style={styles.meta}>{timeAgo(item.createdAt)}</Text>
              {unread && (
                <>
                  <View style={styles.dot} />
                  <Text style={[styles.meta, { color: COLORS.info }]}>Unread</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!isLoaded || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { padding: 24 }]}>
        <Text style={{ marginBottom: 12 }}>Couldn’t load notifications.</Text>
        <TouchableOpacity onPress={load} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: COLORS.bg }]}>
      {/* header controls */}
      <View style={styles.topBar}>
        <View style={styles.segment}>
          <TouchableOpacity
            onPress={() => setFilter("all")}
            style={[styles.segBtn, filter === "all" && styles.segBtnActive]}
          >
            <Text style={[styles.segText, filter === "all" && styles.segTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter("unread")}
            style={[styles.segBtn, filter === "unread" && styles.segBtnActive]}
          >
            <Text style={[styles.segText, filter === "unread" && styles.segTextActive]}>Unread</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={markAllRead} style={styles.linkBtn}>
          <Ionicons name="checkmark-done-outline" size={18} color={COLORS.info} />
          <Text style={styles.linkBtnText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(n) => n._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="sparkles-outline" size={28} color={COLORS.muted} />
            <Text style={styles.emptyTitle}>You’re all caught up</Text>
            <Text style={styles.emptyText}>No notifications to show.</Text>
          </View>
        }
      />
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  topBar: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  segment: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    padding: 4,
    borderRadius: 10,
  },
  segBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  segBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  segText: { color: "#6B7280", fontWeight: "600" },
  segTextActive: { color: COLORS.text },

  linkBtn: { flexDirection: "row", alignItems: "center" },
  linkBtnText: { color: COLORS.info, marginLeft: 6, fontWeight: "600" },

  cardWrap: { paddingHorizontal: 2 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  accent: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 4,
    marginRight: 10,
  },
  title: { fontSize: 15, color: COLORS.text },
  titleUnread: { fontWeight: "700" },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  meta: { fontSize: 12, color: COLORS.muted },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 2,
  },

  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.info,
    borderRadius: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },

  emptyWrap: {
    paddingTop: 48,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  emptyText: { fontSize: 13, color: COLORS.muted },
});
