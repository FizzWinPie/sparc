import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import Font from "@/constants/Font"; // if not already imported
import Constants from "@/constants/Constants"; // if not already imported

type Request = {
  id: string;
  name: string;
  date: string;
  time: string;
  price: string;
  place: string;
};

type Props = {
  request: Request;
};

const RequestCard: React.FC<Props> = ({ request: r }) => {
  return (
    <View key={r.id} style={s.reqCard}>
      <View>
        <View style={s.reqTop}>
          <Ionicons
            name="person-circle-outline"
            size={22}
            color={Colors.basic.blue}
          />
          <Text style={s.reqName}>{r.name}</Text>
        </View>

        <View style={s.row}>
          <Ionicons name="calendar" size={15} color={Colors.basic.blue} />
          <Text style={s.reqLine}>{r.date}</Text>
        </View>

        <View style={s.row}>
          <Ionicons name="time-outline" size={15} color={Colors.basic.blue} />
          <Text style={s.reqLine}>{r.time}</Text>
        </View>

        <Text style={s.price}>$ {r.price}</Text>
      </View>

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={s.locRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={Colors.secondary}
            style={{ marginLeft: Spacing.xs }}
          />
          <Text style={s.reqLoc}>{r.place.split(",")[0]}</Text>
        </View>

        <View>
          <View style={s.rowBtn}>
            <TouchableOpacity style={[s.btn, s.btnGreen]}>
              <Text style={s.btnTxt}>Accept Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, s.btnGray]}>
              <Text style={s.btnTxt}>Decline Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  reqCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.blueVariations.aliceBlue,
    borderRadius: Constants.borderRadius,
    padding: Spacing.md,
    gap: 6,
  },
  reqTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  reqName: {
    fontWeight: "600",
    color: Colors.secondary,
  },
  reqLine: {
    color: Colors.secondary,
    fontSize: Font.sm,
    marginLeft: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  reqLoc: {
    color: Colors.secondary,
    fontSize: Font.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rowBtn: {
    flexDirection: "column",
    gap: 6,
  },
  btn: {
    flex: 1,
    borderRadius: Spacing.xs,
    paddingVertical: Spacing.xs,
    alignItems: "center",
  },
  btnGreen: {
    backgroundColor: Colors.success,
  },
  btnGray: {
    backgroundColor: Colors.blueVariations.aliceBlue,
  },
  btnTxt: {
    fontSize: Font.sm,
    fontWeight: "600",
    color: Colors.secondary,
  },
  price: {
    marginTop: Spacing.xs,
    fontWeight: "700",
    color: Colors.secondary,
  },
});

export default RequestCard;
