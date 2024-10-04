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

const UserPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the photos for the user with ID 1

    fetchPosts({ user_id: 3 })
      .then(({ posts }) => {
        console.log(posts);
        setPhotos(posts);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch photos");
        setLoading(false);
      });

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
          <Image src={item.img_url} style={styles.photo} />
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
    width: '97%',
    padding: 10,
    backgroundColor: "#f2f2f2",
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
    width: "30%",
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  row: {
    justifyContent: "space-between",
  },
});

export default UserPhotos;
