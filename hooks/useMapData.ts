import useLodging from "./useLodging";
import { useQuery } from "react-query";
import useFirebaseTrip from "./useFirebaseTrip";
import { getPlaceDetails } from "../utils/maps";
import useTripActivities from "./useTripActivities";

const useMapData = () => {
    const {query: {data: tripData, isLoading: isLoadingTrip}} = useFirebaseTrip();
    const {getAll: {data: lodgingData, isLoading: isLoadingLodging}} = useLodging();
    const {getAll: {data: activityData, isLoading: isLoadingActivities}} = useTripActivities()

    const markers = useQuery(['trips', tripData?.id, 'mapData'], async () => {
        if(!lodgingData) return {lodgingMarkers: [], activityMarkers: []};
        if(!activityData) return {lodgingMarkers: [], activityMarkers: []};
        const lodgingMarkers = await Promise.all(lodgingData?.map(async (l) => {
            const res = await getPlaceDetails(l.place_id);
            return res.result
        }))

        const activityMarkers = await Promise.all(activityData.map(async (a) => {
            const res = await getPlaceDetails(a.place_id);
            return res.result
        }))

        return {
            lodgingMarkers,
            activityMarkers,
        }
    }, {
        enabled: !isLoadingActivities && !isLoadingLodging && !isLoadingTrip
    })

    return {
      markers,
      isLoading: isLoadingActivities || isLoadingActivities || isLoadingTrip,
    };

}

export default useMapData