import { createPostAndSite, createPostOnSite } from "@/client/client.mjs";
import { UserContext } from "@/contexts/UserContext";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LocationSelector from "../../components/LocationSelector";
import { Collapsible } from "@/components/Collapsible";

export default function publishPhoto() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [caption, onCaptionChange] = useState<string>("");
  const [isPhotoPosting, setIsPhotoPosting] = useState<boolean>(false);
  const [regionCoordinates, setRegionCoordinates] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);
  const { loggedInUser } = useContext(UserContext);
  const [errorMsg, setErrorMsg] = useState("");

  // form:
  const [isChoiceBySite, setIsChoiceBySite] = useState(true);
  const [selectedSite, setSelectedSite] = useState<null | number>(null);

  useEffect(() => {
    // Get users location on load (load of app?) and push it to regionCoordinates for initalRegion
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
      await postPhoto({ img_url: cloudUrl });
      setIsPhotoPosting(false);
    } catch (error) {
      console.error("Error uploading image to the cloud:", error);
      setIsPhotoPosting(false);
    }
  }

  async function postPhoto({ img_url }: { img_url: string }) {
    let post: any = {};
    try {
      if (isChoiceBySite) {
        const photoPayload = {
          user_id: loggedInUser.user_id,
          img_url,
          body: caption,
          site_id: selectedSite,
        };

        const newPostResponse = await createPostOnSite(photoPayload);
        post = newPostResponse.post;
      } else {
        const photoPayload = {
          user_id: loggedInUser.user_id,
          img_url,
          body: caption,
        };
        const sitePayload = {
          ...regionCoordinates,
          user_id: loggedInUser.user_id,
        };
        const newPostResponse = await createPostAndSite(
          photoPayload,
          sitePayload
        );
        post = newPostResponse.post;
      }

      router.push(`/post/${post.post_id}`);
    } catch (err) {
      console.error("Error posting photo to database", err);
      setIsPhotoPosting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          {/* <Collapsible title="Select location"> */}
          <LocationSelector
            regionCoordinates={regionCoordinates}
            setRegionCoordinates={setRegionCoordinates}
            isChoiceBySite={isChoiceBySite}
            setIsChoiceBySite={setIsChoiceBySite}
            selectedSite={selectedSite}
            setSelectedSite={setSelectedSite}
          />
          {/* </Collapsible> */}
          <View style={captionStyles.captionInputContainer}>
            <TextInput
              style={captionStyles.captionInput}
              placeholder="Add a caption..."
              value={caption}
              onChangeText={onCaptionChange}
            />
            {isPhotoPosting ? (
              <View style={captionStyles.captionButton}>
                <ActivityIndicator size="small" color="#ffffff" />
              </View>
            ) : (
              <TouchableOpacity
                style={captionStyles.captionButton}
                onPress={() => {
                  if (
                    caption &&
                    (regionCoordinates || (isChoiceBySite && selectedSite))
                  ) {
                    uploadPhoto();
                  } else {
                    // setErrorMsg("Please choose a location and caption");
                  }
                }}
              >
                <Text style={captionStyles.captionButtonText}>Post</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={router.back}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View> */}
        </>
      ) : null}
      {errorMsg ? <Text>{errorMsg}</Text> : null}
    </KeyboardAvoidingView>
  );
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
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
  buttonText: {
    color: "white",
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
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    marginBottom: 20,
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

const captionStyles = StyleSheet.create({
  captionInputContainer: {
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
  captionInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  captionButton: {
    backgroundColor: "#DD614A",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  captionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
