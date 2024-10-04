import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

// Define the type for the user data based on the API response
interface User {
  user_id: number;
  username: string;
  email: string;
  name: string;
  avatar_url: string; // Assuming the API includes an avatar URL
}

const UserCard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the user data for user ID 3
    const fetchUser = async () => {
      try {
        const response = await axios.get<{ user: User }>('https://muralmap-api.onrender.com/api/users/3');
        setUser(response.data.user); // Access the nested user object
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
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

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>No user found</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#DD614A',
    borderRadius: 8,
    padding: 20,
    margin: 10,
    flexDirection: 'row', // Row for landscape layout
    alignItems: 'center', // Center items vertically
    width: '90%', // Width of the card
    height: 130, // Adjusted height to accommodate username
    shadowColor: '#000', // Optional: Add shadow for a more elevated look
    shadowOffset: { width: 0, height: 1 }, // Shadow properties
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // For Android shadow support
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15, // Space between avatar and text
    borderWidth: 2, // Optional: Add border for better visibility
    borderColor: '#fff', // Optional: White border color
  },
  infoContainer: {
    flex: 1, // Allow the info container to take the remaining space
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // White text color for visibility
  },
  username: {
    fontSize: 16,
    color: '#ffffff', // White text color
    marginTop: 4, // Space between name and username
  },
  email: {
    fontSize: 14,
    color: '#ffffff', // White text color for visibility
    marginTop: 4, // Space between username and email
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
});

export default UserCard;