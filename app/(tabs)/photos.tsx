import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fetchPosts, fetchUsers } from "../../client/client.mjs";
import Post from "@/components/Post";

export default function Photos() {
  const [posts, setPosts] = useState<any>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  const [users, setUsers] = useState<any>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  useEffect(() => {
    setIsPostsLoading(true);
    fetchPosts().then(({ posts }) => {
      setPosts(posts);
      setIsPostsLoading(false);
    });

    setIsUsersLoading(true);
    fetchUsers().then(({ users }) => {
      setUsers(users);
      setIsUsersLoading(false);
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
      {isPostsLoading || isUsersLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          data={posts}
          renderItem={({ item }) => {
            const author = users.find(
              (user: any) => user.user_id === item.user_id
            );
            return <Post post={item} author={author} />;
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
