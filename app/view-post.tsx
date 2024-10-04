import Post from "@/components/Post";
import { useLocalSearchParams } from "expo-router";
import CommentsSection from "../components/CommentsSection";
import { useState, useEffect } from "react";
import { fetchCommentsByPostId, fetchUserByUserId } from "@/client/client.mjs";

export default function ViewPost() {
  const [comments, SetComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentAuthors, setCommentAuthors] = useState([]);
  const { post, author, city } = useLocalSearchParams<{
    post: string;
    author: string;
    city: string;
  }>();

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

  return (
    <>
      <Post post={JSON.parse(post)} author={JSON.parse(author)} city={city} />
      <CommentsSection comments={comments} commentAuthors={commentAuthors} />
    </>
  );
}
