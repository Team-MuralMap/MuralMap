import Post from "@/components/Post";
import { useLocalSearchParams, useRouter } from "expo-router";
import CommentsSection from "../components/CommentsSection";
import { useState, useEffect, useContext } from "react";
import {
  fetchCommentsByPostId,
  fetchUserByUserId,
  deletePostByPostId,
} from "@/client/client.mjs";
import { UserContext } from "@/contexts/UserContext";
import { StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";

export default function ViewPost() {
  const { loggedInUser } = useContext(UserContext);
  const [comments, SetComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentAuthors, setCommentAuthors] = useState([]);
  const { post, author, city } = useLocalSearchParams<{
    post: string;
    author: string;
    city: string;
  }>();

  const router = useRouter();

  useEffect(() => {
    const loadComments = async () => {
      setCommentsLoading(true);
      try {
        const { comments } = await fetchCommentsByPostId(
          JSON.parse(post).post_id
        );
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
              await deletePostByPostId(JSON.parse(post).post_id);
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
      <Post post={JSON.parse(post)} author={JSON.parse(author)} city={city} />
      {
        /*loggedInUser.user_id === JSON.parse(post).user_id*/ true && (
          <TouchableOpacity style={styles.button} onPress={deletePost}>
            <Fontisto name="trash" size={24} color="white" />
          </TouchableOpacity>
        )
      }
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
