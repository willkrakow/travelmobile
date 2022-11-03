import React from 'react'
import { lightColors, LinearProgress, ListItem, Text } from '@rneui/themed'
import { activityCol } from '../hooks/useTripActivities'
import { lodgingCol } from '../hooks/useLodging'
import { IDrive } from '../hooks/useDrives'
import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore'
import { ILodging } from '../types/Lodging'
import { IActivity } from '../types/Activities'
import ThemeIcon from './ThemeIcon'
import GoogleMaps, { GoogleMapsClass } from '../utils/maps'
import { IDirectionsLeg } from '../types/Maps'
import { IWalk } from '../hooks/useWalks'
import { Alert, Linking, StyleSheet, View } from 'react-native'

interface IDirectionsCard {
    data: IDrive | IWalk;
    type: "drive" | "walk";
}

type IActivityId = IActivity & {id: string};
type ILodgingId = ILodging & {id: string};

interface IEndpointData {
  departure?: IActivityId | ILodgingId | null;
  arrival?: IActivityId | ILodgingId | null;
}

type IMetadata = {
  directions_url: string;
} & IDirectionsLeg

const DIRECTIONS_TYPE_MAPPING = {
  drive: "driving",
  walk: "walking",
} as const;

const DirectionsCard = ({data, type}: IDirectionsCard) => {
    const [endpointData, setEndpointData] = React.useState<IEndpointData>({
        departure: null,
        arrival: null,
    });

    const [metadata, setMetadata] = React.useState<IMetadata | null>(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const {departure_location_id, arrival_location_id, departure_location_type, arrival_location_type} = data;
            if(!departure_location_id || !arrival_location_id) return;
            let departureData: DocumentSnapshot<IActivity> | DocumentSnapshot<ILodging>;
            let arrivalData: DocumentSnapshot<IActivity | ILodging>;

            if(departure_location_type === "activity"){
                const departureRef = doc(activityCol, departure_location_id);
                departureData = await getDoc(departureRef);
            } else {
                const departureRef = doc(lodgingCol, departure_location_id);
                departureData = await getDoc(departureRef);
            }

            if (arrival_location_type === "activity") {
              const arrivalRef = doc(
                activityCol,
                arrival_location_id
              );
              arrivalData = await getDoc(arrivalRef);
            } else {
              const arrivalRef = doc(
                lodgingCol,
                arrival_location_id
              );
              arrivalData = await getDoc(arrivalRef);
            }
            const arrivalJson = arrivalData.data();
            if(!arrivalJson) return;
            const departureJson = departureData.data();
            if(!departureJson) return;
            const departure: IActivityId | ILodgingId = {...departureJson, id: departureData.id};
            const arrival: IActivityId | ILodgingId = {...arrivalJson, id: arrivalData.id};
            try {
                const googleMapsData = await GoogleMaps.getDirections(departure.place_id, arrival.place_id);
                const leg = googleMapsData.routes[0].legs[0];
                
                const directionsUrl = GoogleMaps.getDirectionsUrl(departure.place_id, arrival.place_id, DIRECTIONS_TYPE_MAPPING[type]);
                setMetadata({
                  distance: leg.distance,
                  duration: leg.duration,
                  directions_url: directionsUrl,
                });
            } catch(err){
                console.log(err);
            }
            setEndpointData({
                departure,
                arrival,
            })
            setLoading(false);
        }
        fetchData();
    }, [data])


    const handleGoogleMapsDirections = async () => {
      if(metadata !== null){
        const canOpenUrl = await Linking.canOpenURL(metadata.directions_url);
        if(canOpenUrl){
          await Linking.openURL(metadata.directions_url);
        } else {
          alert("Could not open url");
        }

      }
    }

    return (
      <ListItem
        style={styles.root}
        containerStyle={styles.rootContainer}
      >
        {loading ? (
          <LinearProgress />
        ) : (
          <ListItem.Content>
            <View style={styles.contentWrapper}>
              <View style={styles.iconWrapper}>
                <ThemeIcon
                  color="white"
                  size={40}
                  name={type === "drive" ? "car" : "walk"}
                />
              </View>
              <View style={styles.detailsWrapper}>
                <ListItem.Subtitle
                  style={styles.detailsText}
                >
                  <ThemeIcon name="map" color="white" />{" "}
                  {metadata?.distance.text}
                </ListItem.Subtitle>
                <ListItem.Subtitle
                  style={styles.detailsText}
                >
                  <ThemeIcon color="white" name="timer" />{" "}
                  {metadata?.duration.text}
                </ListItem.Subtitle>
                <ListItem.Chevron onPress={handleGoogleMapsDirections} />
              </View>
            </View>
          </ListItem.Content>
        )}
      </ListItem>
    );
}


const styles = StyleSheet.create({
  rootContainer: {
    marginTop: -30,
    paddingTop: 50,
    marginBottom: -30,
    paddingBottom: 50,
    backgroundColor: lightColors.primary,
    zIndex: 10,
    elevation: 1,
  },
  root: {
    flex: 1,
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20,
    shadowColor: "black",
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    backgroundColor: lightColors.primary,
  },
  contentWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrapper: { flex: 0.3 },
  detailsWrapper: { flex: 0.7 },
  detailsText: {
    marginBottom: 5,
    alignItems: "center",
    color: "white",
  },
});

export default DirectionsCard;