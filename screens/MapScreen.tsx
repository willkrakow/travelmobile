import { lightColors } from '@rneui/base';
import { Button, Text } from '@rneui/themed'
import React from 'react'
import { Dimensions, Linking, View } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import useMapData from '../hooks/useMapData';
import { isNil } from '../utils/common';
import { placeDirectionsUrl } from '../utils/maps';
import { largestByKey, smallestByKey } from '../utils/math';

type MyMapMarker = {
    latitude: number;
    longitude: number;
    id: string;
    name: string;
    type: "lodging" | "activity";
    directions_url: string;
}

const getMarkerColor = (mark: MyMapMarker) => {
    if(mark.type === "lodging") return lightColors.primary;

    return lightColors.secondary
}

const MapScreen = () => {
    const {markers, isLoading} = useMapData()


    const handlePressMarker = async (m: MyMapMarker) => {
        const canOpen = await Linking.canOpenURL(m.directions_url);

        if(canOpen){
            await Linking.openURL(m.directions_url)
        } else {
            alert("Error opening URL")
        }
    }
    const mapMarkers = React.useMemo(() => {
        if(isLoading || isNil(markers) || !markers.data) return [] as MyMapMarker[];

        const {activityMarkers, lodgingMarkers} = markers?.data;

        const aM: MyMapMarker[] = activityMarkers.map(a => ({
            latitude: a?.geometry?.location?.lat,
            longitude: a?.geometry?.location?.lng,
            id: a?.place_id,
            name: a?.name,
            type: "activity",
            directions_url: placeDirectionsUrl(a?.place_id),
        }));

        const lM: MyMapMarker[] = lodgingMarkers.map(l => ({
            latitude: l?.geometry?.location?.lat,
            longitude: l?.geometry?.location?.lng,
            id: l?.place_id,
            name: l?.name,
            type: "lodging",
            directions_url: placeDirectionsUrl(l?.place_id)
        }))

        return [...aM, ...lM]
    }, [markers, isLoading])

    const mapRegion = React.useMemo(() => {
      if (isLoading || isNil(markers?.data))
        return {
          latitude: 32.78825,
          longitude: -78.4324,
          latitudeDelta: 0.922,
          longitudeDelta: 0.421,
        };

      if(markers?.data?.activityMarkers?.length === 0 || markers?.data?.lodgingMarkers?.length === 0) {
        return {
          latitude: 32.78825,
          longitude: -78.4324,
          latitudeDelta: 0.922,
          longitudeDelta: 0.421,
        };
      }

      const all = [
        ...(markers?.data?.activityMarkers || []),
        ...(markers?.data?.lodgingMarkers || []),
      ];
      const formatted =
        all.map((a) => ({
          latitude: a?.geometry?.location?.lat || 1,
          longitude: a?.geometry?.location?.lng || 1,
        })).filter(a => !isNil(a.latitude) && !isNil(a.longitude)) || [];
        console.log(markers?.data?.activityMarkers?.[1]?.geometry?.location)
        console.log(markers?.data?.lodgingMarkers?.[1]?.geometry?.location);
      const minLat = smallestByKey(formatted, "latitude") || 1;
      const minLng = smallestByKey(formatted, "longitude") || 1;
      const maxLat = largestByKey(formatted, "latitude") || 1;
      const maxLng = largestByKey(formatted, "longitude") || 1;
      
      const defaultScale = 1.1;
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const centerLat = (minLat + maxLat) / 2;
      const centerLng =(minLng + maxLng) / 2
      return {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: latDiff * defaultScale,
        longitudeDelta: lngDiff * defaultScale
      };
    }, [markers.data?.activityMarkers, markers.data?.lodgingMarkers, isLoading])
    return (
      <View style={{ flex: 1 }}>
        <MapView
          region={mapRegion}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height * 0.9,
            margin: "auto",
          }}
          zoomControlEnabled
          zoomTapEnabled
        >
          {mapMarkers.map((marker) => (
            <Marker
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              key={marker.id}
              pinColor={getMarkerColor(marker)}
              
            >
              <Callout>
                <View>
                  <Text>{marker.name}</Text>
                  <Button
                    titleStyle={{ fontSize: 12 }}
                    containerStyle={{
                      marginBottom: 0,
                      paddingBottom: 0,
                      borderColor: "blue",
                    }}
                    buttonStyle={{ padding: 5, marginBottom: 0 }}
                    color="primary"
                    type="solid"
                    onPress={async () => await handlePressMarker(marker)}
                    title="Directions"
                  />
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    );
}

export default MapScreen