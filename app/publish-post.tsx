import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function publishPhoto() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [caption, onCaptionChange] = useState<string>("");
  const [isPhotoPosting, setIsPhotoPosting] = useState<boolean>(false);
  const [regionCoordinates, setRegionCoordinates] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);
  const [isMapBySite, setIsMapBySite] = useState(false);
  // this will alternate between choosing a site and making a new site

  useEffect(() => {
    console.log("get the user's location and set it to regionCoordinates");
  }, []);

  async function uploadPhoto() {
    setIsPhotoPosting(true);
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
      const cloudUrl = data.secure_url;
      console.log(cloudUrl);
      setIsPhotoPosting(false);
    } catch (error) {
      console.error("Error uploading image to the cloud:", error);
    }
    setIsPhotoPosting(false);
  }

  function handleRegionChange(event: any) {
    setRegionCoordinates({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <MapView
            style={styles.map}
            showsUserLocation={true}
            followsUserLocation={true}
            onRegionChangeComplete={handleRegionChange}
          >
            {regionCoordinates ? (
              <Marker coordinate={{ ...regionCoordinates }} />
            ) : null}
          </MapView>
          <TextInput
            style={styles.captionInput}
            value={caption}
            onChangeText={onCaptionChange}
            placeholder="Caption..."
            placeholderTextColor={"#797979"}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={router.back}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={
                // uploadPhoto
                () => {
                  console.log({ caption, regionCoordinates, photoUri });
                }
              }
            >
              <Text>Post</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
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
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderColor: "#DD614A",
    borderStyle: "solid",
    borderWidth: 5,
    borderRadius: 5,
    marginBottom: 20,
  },
  map: {
    height: screenHeight * 0.3,
    width: "100%",
  },
  captionInput: {
    width: "70%",
    padding: 10,
    backgroundColor: "#e1e1e1",
    borderColor: "#DD614A",
    borderStyle: "solid",
    borderWidth: 5,
    borderRadius: 20,
    marginTop: 20,
  },
});
