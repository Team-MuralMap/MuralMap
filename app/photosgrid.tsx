
import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, FlatList, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

// Define the type for the photo data based on the API response
interface Photo {
  id: string;
  url: string; // Assuming the API includes a URL for the photo
}

const UserPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get<Photo[]>('https://muralmap-api.onrender.com/api/users/3/photos');
        setPhotos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch photos');
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DD614A" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.url }} style={[styles.photo, { width: screenWidth / 3 - 10 }]} />
        )}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default UserPhotos;