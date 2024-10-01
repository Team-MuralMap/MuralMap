import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fetchPosts } from "../../client/client.mjs";
import Post from "@/components/Post";

export default function Photos() {
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  useEffect(() => {
    fetchPosts().then(({ posts }) => {
      console.log(posts[0]);
      setPosts(posts);
      setIsPostsLoading(false);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ marginTop: 100 }}>Here are the posts:</Text>
      {isPostsLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          data={posts}
          renderItem={({ item }) => {
            return <Post post={item} />;
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
});
