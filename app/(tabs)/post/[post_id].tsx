import Post from "@/components/Post";
import {
  useFocusEffect,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import CommentsSection from "../../../components/CommentsSection";
import { useState, useEffect, useContext, useCallback } from "react";
import {
  deletePostByPostId,
  fetchCityForSite,
  fetchCommentsByPostId,
  fetchPostById,
  fetchUserByUserId,
} from "@/client/client.mjs";
import { UserContext } from "@/contexts/UserContext";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";

export default function ViewPost() {
  const { loggedInUser } = useContext(UserContext);
  // const [postLoading, setPostLoading] = useState(true);
  const [post, setPost] = useState<{
    user_id: number;
    body: string;
    img_url: string;
    created_at: string;
    post_id: number;
    site_id: number;
  } | null>(null);
  const [author, setAuthor] = useState<any>(null);
  const [city, setCity] = useState("");
  const [comments, SetComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentAuthors, setCommentAuthors] = useState([]);
  const post_id = Number(
    useGlobalSearchParams<{
      post_id: string;
    }>().post_id
  );
  const router = useRouter();

  const loadPost = async () => {
    setPost(null);
    setAuthor(null);
    SetComments([]);
    fetchPostById(post_id)
      .then(({ post }) => {
        setPost(post);
        return Promise.all([
          fetchUserByUserId(post.user_id).then(({ user }) => setAuthor(user)),
          fetchCityForSite(post.site_id).then((city) => setCity(city)),
        ]);
      })
      .catch((err) => console.error(`Loading error: ${err}`));
  };

  useFocusEffect(
    useCallback(() => {
      loadPost();
    }, [post_id])
  );

  useEffect(() => {
    const loadComments = async () => {
      setCommentsLoading(true);
      try {
        const { comments } = await fetchCommentsByPostId(post_id);
        SetComments(comments);

        if (comments && comments.length > 0) {
          const commentAuthorIds = [
            ...new Set(
              comments.map((comment: { user_id: any }) => comment.user_id)
            ),
          ];

          const usersPromises = commentAuthorIds.map((user_id) =>
            fetchUserByUserId(user_id)
          );
          const authors: any = await Promise.all(usersPromises);
          setCommentAuthors(authors);
        } else {
          setCommentAuthors([]);
        }
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setCommentsLoading(false);
      }
    };

    loadComments();
  }, [post]);

  function deletePost() {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deletePostByPostId(post_id);
              router.push("/(tabs)/photos");
            } catch (error) {
              console.error("Error deleting post:", error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <>
      {post ? (
        <Post post={post} author={author} city={city} />
      ) : (
        <ActivityIndicator size={52} color={"#DD614A"} />
      )}
      {post && loggedInUser.user_id === post.user_id && (
        <TouchableOpacity style={styles.button} onPress={deletePost}>
          <Fontisto name="trash" size={24} color="white" />
        </TouchableOpacity>
      )}
      <CommentsSection comments={comments} commentAuthors={commentAuthors} />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: 10,
  },
});
