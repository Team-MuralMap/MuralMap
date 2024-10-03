import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "react-native-maps";

export default function publishPhoto() {
  const [cloudUrl, setCloudUrl] = useState<null | string>(null);
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [caption, onCaptionChange] = useState<string>("");
  // console.log(photoUri);

  async function uploadPhoto() {
    const formData = new FormData();
    const cloudName = "drfu0sqz0";

    const fileType = photoUri.split(".").at(-1);

    const file: any = {
      uri: photoUri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    };

    formData.append("file", file);
    formData.append("upload_preset", "upload_preset");
    formData.append("folder", "postImages");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.json();

      // this is the url of the image now in cloud storage
      setCloudUrl(data.secure_url);
      console.log(cloudUrl);
    } catch (error) {
      console.error("Error uploading image to the cloud:", error);
    }
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          {/* <MapView style={styles.map} /> */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={router.back}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={uploadPhoto}>
              <Text>Post</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
      <TextInput onChangeText={onCaptionChange}></TextInput>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  button: {
    backgroundColor: "#DD614A",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    width: screenWidth / 3,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    // alignItems: "center",
    height: 60,
    width: screenWidth,
    marginTop: 20,
  },
  photo: {
    width: "50%",
    height: screenWidth * 0.9,
    borderColor: "#DD614A",
    borderStyle: "solid",
    borderWidth: 5,
    borderRadius: 5,
  },
  map: {
    height: screenHeight * 0.2,
    width: "100%",
  },
});
