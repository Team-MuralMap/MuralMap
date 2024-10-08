import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { convertDateShort } from "../client/utils";
import { useRouter } from "expo-router";
import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const defaultAuthorUri = "https://www.flickr.com/photos/loopzilla/2203595978";

export default function Post({
  post,
  author = { username: "<loading...>" },
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

  return (
    <>
      <View style={styles.userContainer}>
        <Image source={{ uri: author.avatar_url }} style={styles.avatar} />
        {author ? (
          <Text style={styles.username}>{author.username}</Text>
        ) : (
          <Text style={styles.username}>loading...</Text>
        )}
        {city ? (
          <Text>
            <MaterialCommunityIcons name="map-marker-outline" size={18} />
            {city}
          </Text>
        ) : null}
      </View>

      <Image source={{ uri: img_url }} style={styles.image} />
      <Text> {body}</Text>
      <Text>{convertDateShort(created_at)}</Text>
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
    borderColor: "grey",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 50,
    marginLeft: screenWidth / 32,
  },
  city: {},
  userContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    margin: 10,
  },
  username: {
    fontSize: 16,
  },
});
