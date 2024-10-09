import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Custom function to format the date
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
};

export default function Post({
  post,
  author,
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
  const { post_id, body, img_url, created_at, user_id } = post;

  const router = useRouter();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          router.push(`/profile?user_id=${user_id}`);
        }}
      >
        <View style={styles.userContainer}>
          <Image
            source={author ? { uri: author.avatar_url } : {}}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.username}>
              {author ? author.username : "loading..."}
            </Text>
            {city ? (
              <View style={styles.cityContainer}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={screenWidth / 24}
                  style={styles.locationIcon}
                />
                <Text style={styles.city}>{city}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push(`/post/${post_id}`);
        }}
      >
        <Image source={{ uri: img_url }} style={styles.image} />
        <Text style={styles.body}> {body}</Text>
        <Text style={styles.postTime}>{formatDate(created_at)}</Text>
      </TouchableOpacity>
    </>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  userContainer: {
    position: "relative",
    margin: 10,
  },
  image: {
    width: screenWidth,
    height: screenWidth,
  },
  avatar: {
    width: screenWidth / 8,
    height: screenWidth / 8,
    borderRadius: screenWidth / 16,
    marginLeft: screenWidth / 32,
    position: "relative",
    left: 0,
    top: 0,
    backgroundColor: "grey",
  },
  textContainer: {
    position: "absolute",
    left: screenWidth / 8 + screenWidth / 16,
    top: 5,
    marginBottom: 7 - screenWidth / 8,
    flex: 1,
    flexDirection: "column",
  },
  username: {
    fontSize: screenWidth / 24,
    fontWeight: "bold",
  },
  city: {
    color: "#DD614A",
    fontSize: screenWidth / 32,
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
  cityContainer: { flex: 1, flexDirection: "row" },
  locationIcon: {
    marginRight: 3,
  },
});
