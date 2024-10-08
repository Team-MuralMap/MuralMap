import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString(undefined, options);
};

export default function Post({
  post,
  author = { username: "<loading...>", user_id: null, avatar_url: "" },
  city,
}: {
  post: {
    user_id: number;
    body: string;
    img_url: string;
    created_at: string;
    post_id: number;
    site_id: number;
  };
  author: any;
  city: string;
}) {
  const { body, img_url, created_at } = post;
  const router = useRouter();

  const handleProfileNavigation = () => {
    if (author.user_id) {
      router.push(`/users/${user_id}`);
    }
  };

  return (
    <>
      {author ? (
        <View style={styles.userContainer}>
          <TouchableOpacity onPress={handleProfileNavigation}>
            <Image source={{ uri: author.avatar_url }} style={styles.avatar} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfileNavigation}>
            <Text style={styles.username}>{author.username}</Text>
          </TouchableOpacity>
          <Text style={styles.city}>{city}</Text>
        </View>
      ) : (
        <View>
          <Image source={{ uri: defaultAuthorUri }} style={styles.avatar} />
          <Text style={styles.username}>loading...</Text>
          <Text>{city}</Text>
        </View>
      )}
      <Image source={{ uri: img_url }} style={styles.image} />
      <Text style={styles.body}>{body}</Text>
      <Text style={styles.postTime}>{formatDate(created_at)}</Text>
    </>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  image: {
    width: screenWidth,
    height: screenWidth,
  },
  avatar: {
    width: screenWidth / 8,
    height: screenWidth / 8,
    borderRadius: screenWidth / 16,
    marginLeft: screenWidth / 32,
  },
  userContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    margin: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  city: {
    color: "#DD614A",
  },
  body: {
    padding: 20, 
    fontSize: 16,
  },
  postTime: {
    fontSize: 11,
    color: "#888888",
    paddingLeft: 20,
  },
});