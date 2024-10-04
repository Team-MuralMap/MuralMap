import Post from "@/components/Post";
import { useLocalSearchParams } from "expo-router";
import CommentsSection from "../components/CommentsSection";
import { useState, useEffect } from "react";
import { fetchCommentsByPostId, fetchUserByUserId } from "@/client/client.mjs";

export default function ViewPost() {
  const [comments, SetComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentAuthors, setCommentAuthors] = useState([]);
  const { post, author } = useLocalSearchParams<{
    post: string;
    author: string;
  }>();

  useEffect(() => {
    const loadComments = async () => {
      setCommentsLoading(true);
      const { comments } = await fetchCommentsByPostId(JSON.parse(post).post_id);
      SetComments(comments);

      const commentAuthorIds = [...new Set(comments.map((comment: { user_id: any; }) => comment.user_id))];
      
      const usersPromises = commentAuthorIds.map(user_id => fetchUserByUserId(user_id));
      const authors: any = await Promise.all(usersPromises);

      setCommentAuthors(authors);
      setCommentsLoading(false);
    };

    loadComments();
  }, []);

  return (
    <>
      <Post post={JSON.parse(post)} author={JSON.parse(author)} />
      <CommentsSection comments={comments} commentAuthors={commentAuthors} />
    </>
  );
}
