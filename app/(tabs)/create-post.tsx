import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

export default function createPost() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [isTakenPhotoLoading, setIsTakenPhotoLoading] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function goToPublishPhoto(photoUri: string) {
    if (photoUri) {
      router.push({ pathname: "/publish-post", params: { photoUri } });
    }
  }
  // next 2 asyncs set photo URI
  async function takePhoto() {
    setIsTakenPhotoLoading(true);
    if (cameraRef.current) {
      try {
        // Capture the photo and get its URI
        const photo = await cameraRef.current.takePictureAsync();

        // Determine the size for cropping
        const { width, height } = photo;
        const size = Math.min(width, height);

        // Crop photo
        const croppedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                originX: (width - size) / 2,
                originY: (height - size) / 2,
                width: size,
                height: size,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        // Update state with the cropped photo URI
        setIsTakenPhotoLoading(false);
        goToPublishPhoto(croppedPhoto.uri);
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    }
    setIsTakenPhotoLoading(false);
  }

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      console.log(result);
      if (!result.canceled) {
        const croppedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 1080, height: 1080 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        setIsTakenPhotoLoading(false);
        goToPublishPhoto(croppedImage.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Fontisto name="spinner-refresh" size={24} color="white" />
        </TouchableOpacity>

        {isTakenPhotoLoading ? (
          <View style={styles.bigbutton}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
          <TouchableOpacity style={styles.bigbutton} onPress={takePhoto}>
            <MaterialIcons name="camera" size={54} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <AntDesign name="upload" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  cameraContainer: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    marginTop: "20%",
    marginBottom: 20,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  bigbutton: {
    backgroundColor: "#DD614A",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 80,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#DD614A",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  photo: {
    width: 90,
    height: 90,
    marginRight: 10,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
