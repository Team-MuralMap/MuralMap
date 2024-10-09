import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { UserContext } from "@/contexts/UserContext";

export default function PublishPhoto() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [isPhotoPosting, setIsPhotoPosting] = useState<boolean>(false);
  const [locationSelected, setLocationSelected] = useState<boolean>(false);
  const [commentAdded, setCommentAdded] = useState<boolean>(false);
  const { loggedInUser } = useContext(UserContext);

  const [errorMsg, setErrorMsg] = useState<string>("");

  const enablePost = locationSelected && commentAdded;

  async function postPhoto() {
    setIsPhotoPosting(true);
    // Your photo upload and post logic goes here
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {photoUri ? (
          <>
            <Image source={{ uri: photoUri }} style={styles.squarePhoto} />
            <View style={styles.checklistContainer}>
              {/* Location Selector */}
              <TouchableOpacity
                style={[
                  styles.checklistItem,
                  locationSelected ? styles.checklistCompleted : null,
                ]}
                onPress={() => {
                  router.push("/location-selector");
                }}
              >
                <Text style={styles.checklistText}>
                  {locationSelected ? "Location selected" : "Select Location"}
                </Text>
              </TouchableOpacity>

              {/* Caption Selector */}
              <TouchableOpacity
                style={[
                  styles.checklistItem,
                  commentAdded ? styles.checklistCompleted : null,
                ]}
                onPress={() => {
                  router.push("/add-caption");
                }}
              >
                <Text style={styles.checklistText}>
                  {commentAdded ? "Caption added" : "Add a Caption"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Button Container */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={router.back}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              {isPhotoPosting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <TouchableOpacity
                  style={[styles.button, enablePost ? styles.activeButton : styles.disabledButton]}
                  onPress={enablePost ? postPhoto : () => setErrorMsg("Please complete all fields")}
                  disabled={!enablePost}
                >
                  <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
              )}
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  squarePhoto: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: 10,
    marginBottom: 20,
  },
  checklistContainer: {
    width: "100%",
    marginVertical: 20,
  },
  checklistItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#e1e1e1",
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#DD614A",
    borderWidth: 1,
  },
  checklistCompleted: {
    backgroundColor: "#28A745",
  },
  checklistText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#DD614A",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: "#DD614A",
  },
  disabledButton: {
    backgroundColor: "#bbb",
  },
  errorText: {
    color: "#D8000C",
    marginTop: 10,
    textAlign: "center",
  },
});