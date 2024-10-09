import { fetchSites } from "@/client/client.mjs";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Callout, Marker } from "react-native-maps";
import WebView from "react-native-webview";
const defaultSitePreview =
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f7bfb63-2a9d-4b1e-bdf6-08be9a3482fd/width=450/view-129-gigapixel-art-scale-2_00x.jpeg";

export default function LocationSelector({
  regionCoordinates,
  setRegionCoordinates,
  isChoiceBySite,
  setIsChoiceBySite,
  selectedSite,
  setSelectedSite,
}: {
  regionCoordinates: any;
  setRegionCoordinates: any;
  isChoiceBySite: any;
  setIsChoiceBySite: any;
  selectedSite: any;
  setSelectedSite: any;
}) {
  // alternates between choosing a site and making a new site

  const [sites, setSites] = useState<
    Array<{
      latitude: number;
      longitude: number;
      site_id: number;
      site_preview_url: null | string;
      post_id: number;
    }>
  >([]);
  const [isSitesLoading, setIsSitesLoading] = useState(true);

  const defaultInitalRegion = {
    latitude: 53.452362850876106,
    latitudeDelta: 0.27733357257162083,
    longitude: -2.255229167640209,
    longitudeDelta: 0.2548038214445114,
  };

  useEffect(() => {
    setIsSitesLoading(true);
    fetchSites()
      .then(({ sites }) => {
        setSites(sites);
        setIsSitesLoading(false);
        console.log;
      })
      .catch(() => {
        console.error("failed to get sites");
      });
  }, []);

  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  function handleRegionChange(event: any) {
    setRegionCoordinates({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsChoiceBySite((bool: boolean) => {
            if (bool) {
              setSelectedSite(null);
            }
            return !bool;
          });
        }}
      >
        <Text style={styles.buttonText}>
          {isChoiceBySite ? "New site" : "Existing Site"}
        </Text>
      </TouchableOpacity>
      {isChoiceBySite ? (
        <>
          {isSitesLoading ? (
            <ActivityIndicator
              size="large"
              color="#DD614A"
              style={styles.loadingMap}
            />
          ) : null}
          <MapView
            // site map
            initialRegion={
              location
                ? {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }
                : defaultInitalRegion
            }
            followsUserLocation={true}
            showsUserLocation={true}
            style={styles.map}
          >
            {sites.map(
              ({ latitude, longitude, site_id, site_preview_url }) => (
                // site_preview_url ? (
                <Marker
                  key={
                    String(site_id) +
                    (site_id === selectedSite ? "-clicked" : "")
                  }
                  ref={function (this: any, ref) {
                    this[`markerRef${site_id}`] = ref;
                  }}
                  coordinate={{ latitude, longitude }}
                  onPress={() => {
                    setSelectedSite(site_id);
                    setTimeout(function (this: any) {
                      this[`markerRef${site_id}`].showCallout();
                    }, 300);
                  }}
                  pinColor={
                    site_id === selectedSite
                      ? "orange" //selected
                      : site_preview_url
                      ? "red" // has images
                      : "blue" // no images
                  }
                  zIndex={
                    site_id === selectedSite ? 2 : site_preview_url ? 1 : 0
                  }
                >
                  {site_preview_url ? (
                    <Callout
                      onPress={() => {
                        console.log(`You just pressed callout ${site_id}!`);
                      }}
                    >
                      <WebView
                        source={{ uri: site_preview_url || defaultSitePreview }}
                        style={styles.sitePreviewImg}
                      />
                    </Callout>
                  ) : (
                    <Callout>
                      <Text>No images here...</Text>
                    </Callout>
                  )}
                </Marker>
              )
              // ) : (
              //   <Marker
              //     pinColor={"blue"}
              //     coordinate={{ latitude, longitude }}
              //     key={site_id}
              //   ></Marker>
              // )
            )}
          </MapView>
        </>
      ) : (
        //dragable pin
        <MapView
          style={styles.map}
          showsUserLocation={true}
          onRegionChange={handleRegionChange}
          initialRegion={
            location
              ? {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }
              : defaultInitalRegion
          }
        >
          {regionCoordinates ? (
            <Marker coordinate={{ ...regionCoordinates }} />
          ) : null}
        </MapView>
      )}
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  map: {
    height: screenHeight * 0.4,
    width: screenWidth,
  },
  button: {
    backgroundColor: "#DD614A",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    bottom: 10,
    right: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  sitePreviewImg: {
    width: screenWidth / 6,
    height: screenWidth / 6,
  },
  loadingMap: {
    position: "absolute",
    zIndex: 1,
    scaleX: 2,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    transform: [{ scale: 3 }],
  },
});
