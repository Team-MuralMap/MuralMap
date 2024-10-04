import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function LocationSelector({
  regionCoordinates,
  setRegionCoordinates,
}: {
  regionCoordinates: any;
  setRegionCoordinates: any;
}) {
  function handleRegionChange(event: any) {
    setRegionCoordinates({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  }
  return (
    <>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        onRegionChange={handleRegionChange}
      >
        {regionCoordinates ? (
          <Marker coordinate={{ ...regionCoordinates }} />
        ) : null}
      </MapView>
    </>
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
});
