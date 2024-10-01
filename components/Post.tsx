import { Dimensions, Image, StyleSheet, Text } from "react-native";

export default function Post({
  post: { author_id, body, img_url, created_at, post_id, site_id },
}) {
  return (
    <>
      <Image src={img_url} style={styles.image} />
      <Text>
        Written by author number {author_id}, caption is {body}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
  },
});
