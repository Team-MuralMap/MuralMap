import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { useFocusEffect } from "expo-router";

interface User {
  user_id: number;
  username: string;
  email: string;
  name: string;
  avatar_url: string;
}

interface UserCardProps {
  user_id: string;
}

const UserCard: React.FC<UserCardProps> = ({ user_id }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get<{ user: User }>(
        `https://muralmap-api.onrender.com/api/users/${user_id}`
      );
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch user`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [user_id])
  );

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#DD614A",
    borderRadius: 8,
    padding: 20,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // For Android shadow support
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#DD614A",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  username: {
    fontSize: 16,
    color: "#ffffff",
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 4,
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
});

export default UserCard;
