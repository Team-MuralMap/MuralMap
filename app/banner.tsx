import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Banner: React.FC = () => {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>MuralMap</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#DD614A',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Banner;