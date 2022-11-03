import React from "react";
import { LinearProgress, ListItem, Text } from "@rneui/themed";
import { activityCol } from "../hooks/useTripActivities";
import { lodgingCol } from "../hooks/useLodging";
import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import { ILodging } from "../types/Lodging";
import { IActivity } from "../types/Activities";
import ThemeIcon from "./ThemeIcon";
import GoogleMaps from "../utils/maps";
import { IDirectionsLeg } from "../types/Maps";
import { IWalk } from "../hooks/useWalks";

interface IWalkCard {
  data: IWalk;
}

type IActivityId = IActivity & { id: string };
type ILodgingId = ILodging & { id: string };

interface IEndpointData {
  departure?: IActivityId | ILodgingId | null;
  arrival?: IActivityId | ILodgingId | null;
}
const WalkCard = ({ data }: IWalkCard) => {
  const [endpointData, setEndpointData] = React.useState<IEndpointData>({
    departure: null,
    arrival: null,
  });

  const [metadata, setMetadata] = React.useState<IDirectionsLeg | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const {
        departure_location_id,
        arrival_location_id,
        departure_location_type,
        arrival_location_type,
      } = data;
      if (!departure_location_id || !arrival_location_id) return;
      let departureData:
        | DocumentSnapshot<IActivity>
        | DocumentSnapshot<ILodging>;
      let arrivalData: DocumentSnapshot<IActivity | ILodging>;

      if (departure_location_type === "activity") {
        const departureRef = doc(activityCol, departure_location_id);
        departureData = await getDoc(departureRef);
      } else {
        const departureRef = doc(lodgingCol, departure_location_id);
        departureData = await getDoc(departureRef);
      }

      if (arrival_location_type === "activity") {
        const arrivalRef = doc(activityCol, arrival_location_id);
        arrivalData = await getDoc(arrivalRef);
      } else {
        const arrivalRef = doc(lodgingCol, arrival_location_id);
        arrivalData = await getDoc(arrivalRef);
      }
      const arrivalJson = arrivalData.data();
      if (!arrivalJson) return;
      const departureJson = departureData.data();
      if (!departureJson) return;
      const departure: IActivityId | ILodgingId = {
        ...departureJson,
        id: departureData.id,
      };
      const arrival: IActivityId | ILodgingId = {
        ...arrivalJson,
        id: arrivalData.id,
      };
      try {
        const googleMapsData = await GoogleMaps.getDirections(
          departure.place_id,
          arrival.place_id
        );
        const leg = googleMapsData.routes[0].legs[0];
        setMetadata(leg);
      } catch (err) {
        console.log(err);
      }
      setEndpointData({
        departure,
        arrival,
      });
      setLoading(false);
    };
    fetchData();
  }, [data]);

  return (
    <ListItem
      style={{
        flex: 1,
        borderRadius: 20,
        shadowColor: "black",
        shadowOffset: { height: 5, width: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginBottom: 20,
      }}
      containerStyle={{ borderRadius: 20 }}
    >
      {loading ? (
        <LinearProgress />
      ) : (
        <ListItem.Content>
          <ListItem.Title style={{ marginBottom: 5 }}>
            <Text h4>
              {endpointData.departure?.title} <ThemeIcon name="arrow-forward" />{" "}
              {endpointData.arrival?.title}
            </Text>
          </ListItem.Title>
          <ListItem.Subtitle style={{ marginBottom: 5, alignItems: "center" }}>
            <ThemeIcon name="map" /> {metadata?.distance.text}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={{ marginBottom: 5, alignItems: "center" }}>
            <ThemeIcon name="timer" /> {metadata?.duration.text}
          </ListItem.Subtitle>
        </ListItem.Content>
      )}
    </ListItem>
  );
};

export default WalkCard;
