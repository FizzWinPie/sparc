import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import opencage from 'opencage-api-client';

const ForwardGeocode = () => {
  const [addressInput, setAddressInput] = useState('New York City');
  const [coords, setCoords] = useState('');
  const [loading, setLoading] = useState(false);

  const forwardGeocode = async () => {
    const key = '4b5893716dcc492385909cc322e6f159';
    setLoading(true);
    try {
      const response = await opencage.geocode({ key, q: addressInput });
      const result = response.results[0];
      if (result) {
        const { lat, lng } = result.geometry;
        setCoords(`${lat}, ${lng}`);
      } else {
        setCoords('No coordinates found');
      }
    } catch (error) {
      console.error(error);
      setCoords('Error during geocoding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forward Geocoding</Text>
      <Text style={styles.label}>Enter Address</Text>
      <TextInput
        style={styles.input}
        value={addressInput}
        onChangeText={setAddressInput}
        placeholder="e.g. New York City"
      />
      <Pressable style={styles.button} onPress={forwardGeocode}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get Coordinates</Text>}
      </Pressable>
      <Text style={styles.result}>{coords}</Text>
    </View>
  );
};

export default ForwardGeocode;

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});
