import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState }from 'react';
import dummyData from '@/constants/dummyData/dummy';
import Colors from '@/constants/Colors';
import Font from '@/constants/Font';
import Spacing from '@/constants/Spacing';
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';

type ChargerListing = {
  id: string;
  host_id: string;
  charger_type: string;
  power_output_kw: number;
  connector_type: string;
  address: string;
  availability_schedule: string;
  price_per_hour: number;
  min_price: number;
  images: string;
  is_active: boolean;
  instructions: string;
  created_at: string;
  updated_at: string;
};

const allListings = () => {
  //const listings = dummyData.charger_listings;
  const [listings, setListings] = useState<ChargerListing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`{}:8000/api/listings`); //need to add IP
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };
    fetchListings();
  }, [])


  const extractAddress = (address: string) => {
    const addr =  address.split(',')[0];
    const noNumber = addr.replace(/^\d+\s*/, '');
    return noNumber;
  };

  const renderItem = ({ item }: { item: ChargerListing }) => (
    <View style={styles.box}>
      <Image source={{ uri: item.images || 'https://via.placeholder.com/100' }} style={styles.image} />
      <View style={styles.middleContent}>
        <Text style={{ fontFamily: "bold", fontSize: Font.md, padding: Spacing.sm}}>{extractAddress(item.address)}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.bottomLeft}>
            <Ionicons name="location-sharp" size={14} color={Colors.blueVariations.steelBlue} padding={2} />
            <Text style={{ fontSize: Font.sm, }}>location</Text>
          </View>
          <View style={styles.bottomRight}>
            <FontAwesome5 name="plug" size={14} color={Colors.blueVariations.steelBlue} />
            <Text style={{ fontSize: Font.sm}}>availability</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontFamily: "bold", fontSize: Font.md, padding: Spacing.md,  position: 'absolute', top: Spacing.sm, right: Spacing.sm, }}>${item.price_per_hour}/hr</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.basic.white }}>
      <Text style={{fontFamily: "bold",fontSize: Font.lg, textAlign: 'center',}}>All Listing</Text>
      <View style={{ flex: 1, backgroundColor: Colors.basic.white }}>

        <View style={styles.searchcontainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={Font.lg} color="gray" style={styles.iconLeft} />
            <TextInput
              placeholder="Search Placeholder"
              style={styles.searchInput}
              placeholderTextColor="gray"
            />
            <TouchableOpacity>
              <Ionicons name="filter" size={Font.lg} color="gray" style={styles.iconRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.navcontainer}>
          <View style={styles.navItem}>
            <Entypo name="map" size={Font.lg} color={Colors.basic.white} />
            <Text style={{ fontSize: Font.sm, color: Colors.basic.white, padding: Spacing.xs}}>Map</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="list" size={Font.lg} color={Colors.basic.white} />
            <Text style={{ fontSize: Font.sm, color: Colors.basic.white, padding: Spacing.xs }}>List</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="heart" size={Font.lg} color={Colors.basic.white} />
            <Text style={{ fontSize: Font.sm, color: Colors.basic.white, padding: Spacing.xs }}>Favorites</Text>
          </View>
        </View>

        <View style={styles.listcontainer}>
          <FlatList
            data={listings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchcontainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },

  navcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  listcontainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  box: {
    flexDirection: 'row',
    backgroundColor: Colors.basic.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 7,
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

export default allListings;