import dayjs, { Dayjs } from "dayjs";
import { getDocs, query, where } from "firebase/firestore";
import React from "react";
import { Text, View } from "react-native";
import { useQueryClient } from "react-query";
import useDrives, { driveCol } from "../hooks/useDrives";
import { useTripContext } from "../hooks/useTripContexts";
import useUserId from "../hooks/useUserId";
import useVehicles from "../hooks/useVehicles";
import useWalks, { walkCol } from "../hooks/useWalks";
import { IActivity } from "../types/Activities";
import { IDrive } from "../types/Drives";
import { ILodging } from "../types/Lodging";
import { IDirectionsRoute } from "../types/Maps";
import { IWalk } from "../types/Walks";
import GoogleMaps from "../utils/maps";
import ActivityCard from "./ActivityCard";
import DirectionsCard from "./DirectionsCard";
import PickPathCard from "./PickPathCard";


interface IActivityCards {
  acts: (IActivity & {id: string})[];
  morningLodging?: ILodging;
  nightLodging?: ILodging;
}
const ActivityCards = ({ acts, morningLodging, nightLodging }: IActivityCards) => {
  const { tripId } = useTripContext();
  const userId = useUserId();
  const { getAll: getVehicles } = useVehicles();
  const [withTravel, setWithTravel] = React.useState<
    (IActivity & {
      id: string;
      route_options: IDirectionsRoute[];
      walk?: IWalk;
      drive?: IDrive;
    })[]
  >();

  const { create: createWalk } = useWalks();
  const { create: createDrive } = useDrives();
  const client = useQueryClient();

  React.useEffect(() => {
    const getTravelBetweenPoints = async () => {
      if (!acts) return;
      const data = await Promise.all(
        acts.map(async (activity, index) => {
          const startPlaceId = activity.id;

          const existingDriveQuery = await getDocs(
            query(
              driveCol,
              where("trip_id", "==", tripId),
              where("departure_location_id", "==", startPlaceId)
            )
          );
          const existingWalkQuery = await getDocs(
            query(
              walkCol,
              where("trip_id", "==", tripId),
              where("departure_location_id", "==", startPlaceId)
            )
          );

          if (existingWalkQuery.empty && existingDriveQuery.empty) {
            const endPlaceId: string = acts[index + 1]?.place_id;
            if (!endPlaceId)
              return {
                ...activity,
                route_options: [],
              };

            const directionsData = await GoogleMaps.getDirections(
              startPlaceId,
              endPlaceId
            );

            const route_options = directionsData.routes;

            return {
              ...activity,
              drive: undefined,
              walk: undefined,
              route_options,
            };
          }

          if (!existingDriveQuery.empty) {
            const drive: IDrive & { id: string } = {
              ...existingDriveQuery.docs[0].data(),
              id: existingDriveQuery.docs[0].id,
            };
            return {
              ...activity,
              drive,
              route_options: [],
            };
          }

          if (!existingWalkQuery.empty) {
            const walk = {
              ...existingWalkQuery.docs[0].data(),
              id: existingWalkQuery.docs[0].id,
            };

            return {
              ...activity,
              walk,
              route_options: [],
            };
          }

          return {
            ...activity,
            route_options: [],
          };
        })
      );

      setWithTravel(data);
    };
    getTravelBetweenPoints();
  }, []);

  const pickPathHandler =
    (
      departureLocation: IActivity & { id: string },
      arrivalLocation: IActivity & { id: string }
    ) =>
    (type: "walk" | "drive", durationInSeconds: number) => {
      const payload: IWalk | IDrive = {
        departure_date: departureLocation.end_date,
        departure_location_id: departureLocation.id,
        departure_location_type: "activity",
        arrival_date: dayjs(departureLocation.end_date)
          .add(durationInSeconds, "seconds")
          .toISOString(),
        arrival_location_type: "activity",
        arrival_location_id: arrivalLocation.id,
        trip_id: tripId || "",
        user_id: userId,
      };
      switch (type) {
        case "walk":
          createWalk.mutate(payload, {
            onSuccess: () => {
              client.invalidateQueries(["trips", tripId, "activities"]);
              client.refetchQueries(["trips", tripId, "activities"]);
              client.invalidateQueries(["trips", tripId, "walks"]);
              client.refetchQueries(["trips", tripId, "walks"]);
            },
          });
        case "drive":
          createDrive.mutate(
            {
              ...payload,
              vehicle_id: getVehicles.data?.[0].id || "",
            },
            {
              onSuccess: () => {
                client.invalidateQueries(["trips", tripId, "activities"]);
                client.refetchQueries(["trips", tripId, "activities"]);
                client.invalidateQueries(["trips", tripId, "drives"]);
                client.refetchQueries(["trips", tripId, "drives"]);
              },
            }
          );
      }
    };
  return (
    <View style={{ flex: 1 }}>
      {withTravel &&
        withTravel.map((a, index) => {
          let directionType: "walk" | "drive" | undefined = undefined;
          if (a.walk) {
            directionType = "walk";
          }
          if (a.drive) {
            directionType = "drive";
          }

          switch (directionType) {
            case "drive":
              return (
                <View style={{ flex: 1 }} key={`${a.id}-drive`}>
                  <ActivityCard key={a.id} act={a} />
                  {!!a.drive && <DirectionsCard type="drive" data={a.drive} />}
                </View>
              );
            case "walk":
              return (
                <View style={{ flex: 1 }} key={`${a.id}-walk`}>
                  <ActivityCard key={a.id} act={a} />
                  {!!a.walk && <DirectionsCard type="walk" data={a.walk} />}
                </View>
              );
            default:
              return (
                <View style={{ flex: 1 }} key={`${a.id}-none`}>
                  <ActivityCard key={a.id} act={a} />
                  {!!withTravel[index + 1] && (
                    <PickPathCard
                      onPickPath={pickPathHandler(a, withTravel[index + 1])}
                      startPlaceId={a.place_id}
                      endPlaceId={withTravel[index + 1].place_id}
                    />
                  )}
                </View>
              );
          }
        })}
    </View>
  );
};

export default ActivityCards;
