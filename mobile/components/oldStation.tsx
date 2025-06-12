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
