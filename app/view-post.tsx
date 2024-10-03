import Post from "@/components/Post";
import { useLocalSearchParams } from "expo-router";
import CommentsSection from "../components/CommentsSection";
import { useState, useEffect } from "react";
import { fetchCommentsByPostId } from "@/client/client.mjs";

export default function ViewPhoto() {
    const [comments, SetComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);

  const { post, author } = useLocalSearchParams<{
    post: string;
    author: string;
  }>();

  useEffect(() => {
    setCommentsLoading(true);
    fetchCommentsByPostId(JSON.parse(post).post_id).then(({ comments }) => {
      SetComments(comments);
      setCommentsLoading(false);
    });
  }, []);


  return (
    <>
        <Post post={JSON.parse(post)} author={JSON.parse(author)} />
        <CommentsSection comments={comments}/>
    </>
  );
}
