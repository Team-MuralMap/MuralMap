import { fetchSites } from "@/client/client.mjs";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import MapView, { Callout, Marker } from "react-native-maps";
import WebView from "react-native-webview";
const defaultSitePreview =
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f7bfb63-2a9d-4b1e-bdf6-08be9a3482fd/width=450/view-129-gigapixel-art-scale-2_00x.jpeg";

export default function LocationSelector({
  regionCoordinates,
  setRegionCoordinates,
}: {
  regionCoordinates: any;
  setRegionCoordinates: any;
}) {
  // alternates between choosing a site and making a new site
  const [isChoiceBySite, setIsChoiceBySite] = useState(false);

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

  useEffect(() => {
    setIsSitesLoading(true);
    fetchSites().then(({ sites }) => {
      setSites(sites);
      setIsSitesLoading(false);
    });
  });

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
      console.log(location);
    })();
  }, []);

  function handleRegionChange(event: any) {
    setRegionCoordinates({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  }

  const [selectedSite, setSelectedSite] = useState<null | number>(null);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsChoiceBySite((bool) => {
            if (bool) {
              setSelectedSite(null);
            }
            return !bool;
          });
        }}
      >
        <Text>{isChoiceBySite ? "New site" : "Existing Site"}</Text>
      </TouchableOpacity>
      {isChoiceBySite ? (
        <MapView
          // site map
          initialRegion={
            location
              ? {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 1,
                  longitudeDelta: 2,
                }
              : undefined
          }
          followsUserLocation={true}
          showsUserLocation={true}
          style={styles.map}
        >
          {sites.map(({ latitude, longitude, site_id, site_preview_url }) =>
            site_preview_url ? (
              <Marker
                key={
                  String(site_id) + (site_id === selectedSite ? "-clicked" : "")
                }
                ref={(ref) => {
                  this[`markerRef${site_id}`] = ref;
                }}
                coordinate={{ latitude, longitude }}
                onPress={() => {
                  setSelectedSite(site_id);
                  setTimeout(() => {
                    this[`markerRef${site_id}`].showCallout();
                  }, 100);
                }}
                pinColor={site_id === selectedSite ? "yellow" : "red"}
              >
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
              </Marker>
            ) : (
              <Marker
                pinColor={"blue"}
                coordinate={{ latitude, longitude }}
                key={site_id}
              ></Marker>
            )
          )}
        </MapView>
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
                  latitudeDelta: 1,
                  longitudeDelta: 2,
                }
              : undefined
          }
        >
          {regionCoordinates ? (
            <Marker coordinate={{ ...regionCoordinates }} />
          ) : null}
        </MapView>
      )}
    </>
  );
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  map: {
    height: screenHeight * 0.3,
    width: "100%",
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
    position: "absolute",
    zIndex: 1,
    left: 0,
  },
  sitePreviewImg: {
    width: screenWidth / 6,
    height: screenWidth / 6,
  },
});
