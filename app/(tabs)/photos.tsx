import { useState, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchPosts,
  fetchUsers,
  fetchCityForSite,
} from "../../client/client.mjs";
import Post from "@/components/Post";
import { PhotoFilters } from "@/components/PhotoFiltering";

export default function Photos() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [cities, setCities] = useState<{ [postId: string]: string }>({});
  const [sortQuery, setSortQuery] = useState({
    sort_by: "created_at",
    order: "desc",
  });

  const fetchData = async (sortQuery: { sort_by: string; order: string }) => {
    setIsPostsLoading(true);
    setIsUsersLoading(true);

    try {
      const [{ posts }, { users }] = await Promise.all([
        fetchPosts({ ...sortQuery }),
        fetchUsers(),
      ]);

      setPosts(posts);
      setUsers(users);
      setIsPostsLoading(false);
      setIsUsersLoading(false);

      const citiesMap: { [postId: string]: string } = {};

      const cityPromises = posts.map(
        async (post: { site_id: string; post_id: string | number }) => {
          const city = await fetchCityForSite(post.site_id);
          citiesMap[post.post_id] = city;
        }
      );

      await Promise.all(cityPromises);

      setCities(citiesMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Ensures it refreshes when we return to it (e.g. after post creation/deletion)
  useFocusEffect(
    useCallback(() => {
      fetchData(sortQuery);
    }, [sortQuery])
  );

  return (
    <ScrollView>
      <PhotoFilters setSortQuery={setSortQuery} sortQuery={sortQuery} />

      {isPostsLoading || isUsersLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DD614A" />
        </View>
      ) : (
        <View>
          {posts.map((item) => {
            const author = users.find(
              (user: any) => user.user_id === item.user_id
            );
            const city = cities[item.post_id];
            return (
              <View style={styles.postContainer} key={item.post_id}>
                <Post
                  key={item.post_id}
                  post={item}
                  author={author}
                  city={city}
                />
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    margin: 0,
    padding: 0,
  },
  postContainer: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    paddingTop: 20,
  },
  loadingContainer: {
    marginTop: screenHeight / 2.3,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
