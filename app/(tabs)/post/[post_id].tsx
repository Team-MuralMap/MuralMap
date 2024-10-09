import { useFocusEffect, useGlobalSearchParams, useRouter } from "expo-router";
import CommentsSection from "../../../components/CommentsSection";
import { useState, useEffect, useContext, useCallback } from "react";
import {
  addComment,
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
  ActivityIndicator,
  TextInput,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Post from "@/components/Post";

export default function ViewPost() {
  const { loggedInUser } = useContext(UserContext);
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
  const [newComment, setNewComment] = useState(""); // New comment state
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

  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const { comments } = await fetchCommentsByPostId(post_id);

      if (comments && comments.length > 0) {
        SetComments(comments.reverse());
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

  useFocusEffect(
    useCallback(() => {
      loadPost();
    }, [post_id])
  );

  useEffect(() => {
    loadComments();
  }, [post]);

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

  async function handleCommentSubmit() {
    if (newComment.trim() === "") return; // stops empty comments

    await addComment(post_id, loggedInUser.user_id, newComment);

    setNewComment("");

    loadComments();
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {post ? (
            <Post
              post={post}
              author={author}
              city={city}
              isSiteScrollActive={true}
            />
          ) : (
            <ActivityIndicator size={52} color={"#DD614A"} />
          )}
          {post && loggedInUser.user_id === post.user_id && (
            <TouchableOpacity style={styles.button} onPress={deletePost}>
              <Fontisto name="trash" size={24} color="white" />
            </TouchableOpacity>
          )}
          <CommentsSection
            comments={comments}
            commentAuthors={commentAuthors}
          />
        </ScrollView>

        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            style={styles.commentButton}
            onPress={handleCommentSubmit}
          >
            <Text style={styles.commentButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
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
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  commentButton: {
    backgroundColor: "#DD614A",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  commentButtonText: {
    color: "white",
    fontWeight: "bold",
  },
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
