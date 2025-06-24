import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dummyData from '../../constants/dummyData/dummy';
import Colors from '../../constants/Colors';
import Font from '../../constants/Font';
import Spacing from '../../constants/Spacing';

const hostId = 'user003';

export default function Host() {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const host = dummyData.users.find(u => u.id === hostId);
  if (!host) return null;

  const wallet = dummyData.payment_invoice
    .filter(i => i.recipient.id === hostId)
    .reduce((s, i) => s + i.amount, 0);

  const transactions = dummyData.payment_invoice
    .filter(i => i.recipient.id === hostId)
    .map(i => ({ id: i.id, amount: i.amount }));

  const requests = dummyData.bookings
    .filter(b => b.host_id === hostId)
    .map(b => ({
      id: b.id,
      name: dummyData.users.find(u => u.id === b.ev_owner_id)?.name ?? '-',
      place:
        dummyData.charger_listings.find(c => c.id === b.charger_listings_id)
          ?.address ?? '-',
      date: b.start_time.split('T')[0],
      time: `${new Date(b.start_time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })} – ${new Date(b.end_time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      price: b.total_cost,
    }));

  const stations = dummyData.charger_listings.filter(
    c => c.host_id === hostId,
  );

  const toggle = (id: string) => {
    LayoutAnimation.easeInEaseOut();
    setOpenIds(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]));
  };

  return (
    <View style={s.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.row}>
          <Ionicons name="person-circle" size={32} color={Colors.secondary} />
          <Text style={s.h1}>Welcome, {host.name}</Text>
        </View>

        {/* Wallet */}
        <View style={[s.row, { marginTop: Spacing.lg }]}>
          <View style={[s.card, { marginRight: Spacing.sm }]}>
            <Text style={s.label}>Account Balance</Text>
            <Text style={s.big}>€ {wallet.toFixed(2)}</Text>
          </View>

          <View style={[s.card, { marginLeft: Spacing.sm }]}>
            <Text style={s.label}>Completed Txns</Text>
            {transactions.slice(0, 2).map(t => (
              <Text key={t.id} style={s.txn}>
                ID {t.id}   € {t.amount}
              </Text>
            ))}
          </View>
        </View>

        {/* Requests */}
        <Text style={[s.sub, { marginTop: Spacing.xl }]}>Charge requests</Text>

        {requests.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyTxt}>No active requests</Text>
          </View>
        ) : (
          requests.map(r => (
            <View key={r.id} style={s.reqCard}>
              <View style={s.reqTop}>
                <Ionicons
                  name="person-circle-outline"
                  size={22}
                  color={Colors.basic.blue}
                />
                <Text style={s.reqName}>{r.name}</Text>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={Colors.secondary}
                  style={{ marginLeft: Spacing.xs }}
                />
                <Text style={s.reqLoc}>{r.place}</Text>
              </View>
              <Text style={s.reqLine}>{r.date}</Text>
              <Text style={s.reqLine}>{r.time}</Text>
              <View style={s.rowBtn}>
                <TouchableOpacity style={[s.btn, s.btnGreen]}>
                  <Text style={s.btnTxt}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btn, s.btnGray]}>
                  <Text style={s.btnTxt}>Decline</Text>
                </TouchableOpacity>
              </View>
              <Text style={s.price}>€ {r.price}</Text>
            </View>
          ))
        )}

        {/* Stations */}
        <Text style={[s.sub, { marginTop: Spacing.xl }]}>My Charging Stations</Text>

        {stations.map(st => {
          const open = openIds.includes(st.id);
          return (
            <View key={st.id} style={s.stationWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggle(st.id)}
                style={s.stationHeader}>
                <View style={s.stationInfo}>
                  <View>
                    <Text style={s.title}>{st.address.split(',')[0]}</Text>
                    <Text style={s.small}>{st.charger_type}</Text>
                  </View>
                  <View style={s.stationRight}>
                    <Text style={s.online}>ONLINE</Text>
                    <Ionicons
                      name={open ? 'chevron-down' : 'chevron-forward'}
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
    </View>
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
  row: { flexDirection: 'row', alignItems: 'center' },
  h1: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Font.md,
    fontWeight: '600',
    color: Colors.secondary,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: Spacing.sm,
    padding: Spacing.sm,
  },
  label: { color: Colors.primary, fontSize: Font.sm, marginBottom: Spacing.xs },
  big: { color: Colors.primary, fontSize: Font.lg, fontWeight: '700' },
  txn: { color: Colors.primary, fontSize: Font.sm },
  sub: {
    fontSize: Font.md,
    fontWeight: '700',
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  emptyBox: {
    height: 90,
    borderWidth: 1,
    borderColor: Colors.blueVariations.aliceBlue,
    borderRadius: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTxt: { marginTop: Spacing.xs, color: Colors.basic.blue, fontSize: Font.sm },
  reqCard: {
    borderWidth: 1,
    borderColor: Colors.blueVariations.aliceBlue,
    borderRadius: Spacing.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  reqTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  reqName: { fontWeight: '600', color: Colors.secondary },
  reqLoc: { marginLeft: Spacing.xs, color: Colors.secondary, fontSize: Font.sm },
  reqLine: { color: Colors.secondary, fontSize: Font.sm, marginBottom: Spacing.xs },
  rowBtn: { flexDirection: 'row', marginTop: Spacing.xs, gap: Spacing.sm },
  btn: {
    flex: 1,
    borderRadius: Spacing.xs,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  btnGreen: { backgroundColor: Colors.success },
  btnGray: { backgroundColor: Colors.blueVariations.aliceBlue },
  btnTxt: { fontSize: Font.sm, fontWeight: '600', color: Colors.secondary },
  price: { marginTop: Spacing.xs, fontWeight: '700', color: Colors.secondary },
  stationWrapper: { marginTop: Spacing.sm },
  stationHeader: {
    borderRadius: Spacing.sm,
    overflow: 'hidden',
    backgroundColor: Colors.secondary,
  },
  stationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  stationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: { color: Colors.primary, fontSize: Font.sm, fontWeight: '700' },
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
  infoRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  infoLabel: { width: 110, fontWeight: '600', color: Colors.secondary },
  infoValue: { flex: 1, color: Colors.secondary },
  detailText: { color: Colors.secondary, fontSize: Font.sm },
});