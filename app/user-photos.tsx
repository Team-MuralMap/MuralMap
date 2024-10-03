import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import axios from "axios";
import { fetchPosts } from "@/client/client.mjs";

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
    // Fetch the photos for the user with ID 1

    fetchPosts({ user_id: 1 })
      .then(({ posts }) => {
        console.log(posts);
        setPhotos(posts);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch photos");
        setLoading(false);
      });

    // const fetchPhotos = async () => {
    //   try {
    //     // Replace this URL with the actual endpoint for the user's photos
    //     const response = await axios.get<Photo[]>(
    //       "https://muralmap-api.onrender.com/api/users/1/photos"
    //     );
    //     setPhotos(response.data);
    //     setLoading(false);
    //   } catch (err) {
    //     setError("Failed to fetch photos");
    //     setLoading(false);
    //   }
    // };

    // fetchPhotos();
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

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.url }} style={styles.photo} />
        )}
        numColumns={3} // Number of columns in the grid
        columnWrapperStyle={styles.row} // Style for each row
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "30%", // Width of each photo, adjust as necessary
    height: 100, // Height of each photo
    margin: 5, // Margin around each photo
    borderRadius: 8, // Optional: Rounded corners for the photos
  },
  row: {
    justifyContent: "space-between", // Space between items in a row
  },
});

export default UserPhotos;
