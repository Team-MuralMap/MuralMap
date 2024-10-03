import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { convertDateShort } from "../client/utils";

export default function Post({
  post: { user_id, body, img_url, created_at, post_id, site_id },
  author = { username: "<loading...>" },
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
}) {
  return (
    <>
      <View style={styles.userContainer}>
        <Image src={author.avatar_url} style={styles.avatar} />
        <Text style={styles.username}>{author.username}</Text>
      </View>
      <Image src={img_url} style={styles.image} />
      <Text> {body}</Text>
      <Text>{convertDateShort(created_at)}</Text>
    </>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  image: {
    width: screenWidth,
    height: screenWidth,
  },
  avatar: {
    width: screenWidth / 8,
    height: screenWidth / 8,
    borderColor: "#000000",
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: screenWidth / 32,
    marginLeft: screenWidth / 32,
  },
  userContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    margin: 10,
  },
  username: {
    fontSize: 16,
  },
});
