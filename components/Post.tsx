import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { convertDateShort } from "../client/utils";
import { router, useFocusEffect, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchPosts, fetchSites } from "@/client/client.mjs";

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
  isSiteScrollActive = false,
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
  isSiteScrollActive?: boolean;
}) {
  const { post_id, body, img_url, created_at, user_id } = post;
  const [sitePostIds, setSitePostIds] = useState<Array<number>>([]);
  const [isSitePostsLoading, setIsSitePostsLoading] = useState(true);
  const [postIndex, setPostIndex] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (isSiteScrollActive) {
        setIsSitePostsLoading(true);
        fetchPosts({
          site_id: post.site_id,
          sort_by: "created_at",
          order: "asc",
        })
          .then(({ posts }) => {
            const IDs = posts.map(
              ({ post_id }: { post_id: number }) => post_id
            );
            setSitePostIds(IDs);
            setPostIndex(IDs.indexOf(post.post_id));
            setIsSitePostsLoading(false);
          })
          .catch((err) =>
            console.error("Failed to load other posts in site:", err)
          );
      }
    }, [post.post_id])
  );

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
        {" "}
        <View style={{ position: "relative" }}>
          <Image source={{ uri: img_url }} style={styles.image} />
          {isSiteScrollActive && Number.isInteger(postIndex) ? (
            <>
              {postIndex! > 0 ? (
                <TouchableOpacity
                  style={{
                    ...styles.seePostButton,
                    ...styles.previousPostButton,
                  }}
                  onPress={() => {
                    router.push(`/post/${sitePostIds[postIndex! - 1]}`);
                  }}
                >
                  <Ionicons
                    style={styles.seePostIcon}
                    name={"chevron-back"}
                    size={32}
                    color={"white"}
                  />
                </TouchableOpacity>
              ) : null}
              {postIndex! < sitePostIds.length - 1 && postIndex! >= 0 ? (
                <TouchableOpacity
                  style={{ ...styles.seePostButton, ...styles.nextPostButton }}
                  onPress={() => {
                    router.push(`/post/${sitePostIds[postIndex! + 1]}`);
                  }}
                >
                  <Ionicons
                    style={styles.seePostIcon}
                    name={"chevron-forward"}
                    size={32}
                    color={"white"}
                  />
                </TouchableOpacity>
              ) : null}
            </>
          ) : null}
        </View>
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
    backgroundColor: "#888888",
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
  cityContainer: {
    flex: 1,
    flexDirection: "row",
  },
  locationIcon: {
    marginRight: 3,
  },
  seePostButton: {
    width: 40,
    height: 50,
    backgroundColor: "#222222bb",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: screenWidth / 2 - 25,
  },
  seePostIcon: {
    // color: "#DD614A",
  },
  nextPostButton: {
    right: 0,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    paddingLeft: 10,
  },
  previousPostButton: {
    left: 0,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    paddingRight: 10,
  },
});
