import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dummyData from "../../constants/dummyData/dummy";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import Spacing from "../../constants/Spacing";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileBar from "@/components/ProfileBar";
import Constants from "@/constants/Constants";
import WalletCard from "@/components/WalletCardTransactions";
import WalletCardBalance from "@/components/WalletCardBalance";
import WalletCardTransactions from "@/components/WalletCardTransactions";
import RequestCard from "@/components/RequestCard";

const formattedListings = dummyData.charger_listings.map((listing) => ({
  id: listing.id,
  host_id: listing.host_id,
  charger_type: listing.charger_type,
  power_output_kw: listing.power_output_kw,
  connector_type: listing.connector_type,
  address: listing.address,
  latitude: listing.latitude,
  longitude: listing.longitude,
  availability_schedule: listing.availability_schedule,
  price_per_hour: listing.price_per_hour,
  min_price: listing.min_price,
  images: listing.images,
  is_active: listing.is_active,
  instructions: listing.instructions,
  created_at: listing.created_at,
  updated_at: listing.updated_at,
}));

const formattedBookings = dummyData.bookings.map((booking) => ({
  id: booking.id,
  listing_id: booking.charger_listings_id,
  host_id: booking.host_id,
  start_time: booking.start_time,
  end_time: booking.end_time,
  total_cost: booking.total_cost,
  status: booking.status,
}));

const formattedInvoices = dummyData.payment_invoice.map((invoice) => ({
  id: invoice.id,
  booking_id: invoice.booking_id,
  host_id: invoice.recipient.id,
  user_id: invoice.payer.id,
  amount_paid: invoice.amount,
  payment_method: invoice.payment_method,
  paid_at: invoice.created_at,
  status: invoice.status,
  created_at: invoice.created_at,
  updated_at: invoice.created_at,
}));

export default function Host() {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const requests = dummyData.bookings.map((b) => ({
    id: b.id,
    name: dummyData.users.find((u) => u.id === b.ev_owner_id)?.name ?? "-",
    place:
      dummyData.charger_listings.find((c) => c.id === b.charger_listings_id)
        ?.address ?? "-",
    date: b.start_time.split("T")[0],
    time: `${new Date(b.start_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} – ${new Date(b.end_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    price: b.total_cost.toString(),
  }));

  const toggle = (id: string) => {
    LayoutAnimation.easeInEaseOut();
    setOpenIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  return (
    <SafeAreaView style={s.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.row}>
          <Ionicons name="person-circle" size={36} color={Colors.secondary} />
          <Text style={s.h1}>Welcome, {dummyData.users[2].id}</Text>
        </View>
        {/* <ProfileBar /> */}

        {/* Wallet */}
        <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
          <WalletCardBalance
            wallet={1240}
            transactions={dummyData.payment_invoice}
          />
          <WalletCardTransactions
            wallet={1601}
            transactions={dummyData.payment_invoice}
          />
        </View>

        {/* Requests */}
        <Text style={[s.sub, { marginTop: Spacing.xl }]}>Charge requests</Text>

        {requests.length === 0 ? (
          <View style={[s.emptyBox, { height: 120 }]}>
            <Image
              source={require("../../assets/images/noRequest-icon.png")}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
            <Text style={[s.emptyTxt, { fontSize: 12 }]}>
              No active requests
            </Text>
          </View>
        ) : (
          requests.map((r) => <RequestCard key={r.id} request={r} />)
        )}

        {/* Stations */}
        <Text style={[s.sub, { marginTop: Spacing.xl }]}>
          My Charging Stations
        </Text>

        {dummyData.charger_listings.map((st) => {
          const open = openIds.includes(st.id);
          return (
            <View key={st.id} style={s.stationWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggle(st.id)}
                style={s.stationHeader}
              >
                <View style={s.stationInfo}>
                  <View>
                    <Text style={s.title}>{st.address.split(",")[0]}</Text>
                    <Text style={s.small}>{st.charger_type}</Text>
                  </View>
                  <View style={s.stationRight}>
                    <Text style={s.online}>ONLINE</Text>
                    <Ionicons
                      name={open ? "chevron-down" : "chevron-forward"}
                      size={20}
                      color={Colors.primary}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {open && (
                <View style={s.detailBox}>
                  <Info label="Connector" value={st.connector_type} />
                  <Info label="Power" value={`${st.power_output_kw} kW`} />
                  <Info label="Schedule" value={st.availability_schedule} />
                  <Info label="Price / h" value={`€ ${st.price_per_hour}`} />
                  <Info label="Min price" value={`€ ${st.min_price}`} />
                  <Text style={[s.label, { marginTop: Spacing.sm }]}>
                    Instructions
                  </Text>
                  <Text style={s.detailText}>{st.instructions}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.primary, padding: Spacing.lg },
  row: { flexDirection: "row", alignItems: "center" },
  h1: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Font.md,
    fontWeight: "600",
    color: Colors.secondary,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: Constants.borderRadius,
    padding: Spacing.sm,
    margin: Spacing.sm,
  },
  label: {
    color: Colors.primary,
    fontSize: Font.sm,
    marginBottom: Spacing.xs,
    fontWeight: "regular",
  },
  big: { color: Colors.primary, fontSize: Font.lg, fontWeight: "bold" },
  txn: { color: "#eee", fontSize: Font.sm, fontWeight: "light" },
  sub: {
    fontSize: Font.md,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  emptyBox: {
    height: 90,
    borderWidth: 2,
    borderColor: Colors.blueVariations.aliceBlue,
    borderRadius: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
  },
  emptyTxt: {
    marginTop: Spacing.xs,
    color: Colors.basic.blue,
    fontSize: Font.sm,
  },
  reqCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.blueVariations.aliceBlue,
    borderRadius: Constants.borderRadius,
    padding: Spacing.md,
    gap: 6,
    // marginBottom: Spacing.lg,
  },
  reqTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  reqName: { fontWeight: "600", color: Colors.secondary },
  reqLoc: {
    // marginLeft: Spacing.xs,
    color: Colors.secondary,
    fontSize: Font.sm,
  },
  reqLine: {
    color: Colors.secondary,
    fontSize: Font.sm,
    marginBottom: Spacing.xs,
  },
  rowBtn: { flexDirection: "column", gap: 6 },
  btn: {
    flex: 1,
    borderRadius: Spacing.xs,
    paddingVertical: Spacing.xs,
    alignItems: "center",
  },
  btnGreen: { backgroundColor: Colors.success },
  btnGray: { backgroundColor: Colors.blueVariations.aliceBlue },
  btnTxt: { fontSize: Font.sm, fontWeight: "600", color: Colors.secondary },
  price: { marginTop: Spacing.xs, fontWeight: "700", color: Colors.secondary },
  stationWrapper: { marginTop: Spacing.sm },
  stationHeader: {
    borderRadius: Spacing.sm,
    overflow: "hidden",
    backgroundColor: Colors.secondary,
  },
  stationInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.sm,
  },
  stationRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  title: { color: Colors.primary, fontSize: Font.sm, fontWeight: "700" },
  small: { color: Colors.blueVariations.aliceBlue, fontSize: Font.sm },
  online: { color: Colors.success, fontSize: Font.sm },

  detailBox: {
    borderWidth: 1,
    borderColor: Colors.blueVariations.aliceBlue,
    borderTopWidth: 0,
    borderBottomLeftRadius: Spacing.sm,
    borderBottomRightRadius: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.primary,
  },
  infoRow: { flexDirection: "row", marginBottom: Spacing.xs },
  infoLabel: { width: 110, fontWeight: "600", color: Colors.secondary },
  infoValue: { flex: 1, color: Colors.secondary },
  detailText: { color: Colors.secondary, fontSize: Font.sm },
});
