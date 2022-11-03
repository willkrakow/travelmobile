import React from 'react'
import dayjs from 'dayjs';
import { isNil } from '../utils/common';
import { IActivity } from "../types/Activities";
import useTripActivities from './useTripActivities';
import useFirebaseTrip from './useFirebaseTrip';
import useLodging from './useLodging';

export interface IUseMergeDayActivities {
    activityData: (IActivity & {id: string})[];
}

export interface IMergedActivitiesContext {
    shouldRerender: boolean;
    rerender: () => void;
}
export const MergedActivitiesContext = React.createContext<IMergedActivitiesContext>({
    shouldRerender: true,
    rerender: () => {}
});

export const useMergedActivitiesContext = () => React.useContext(MergedActivitiesContext);

const useMergeDayActivities = () => {
 const { getAll: activitiesQuery } = useTripActivities();
 const { getAll: lodgingQuery } = useLodging();
 const { query: tripQuery } = useFirebaseTrip();
 const {
   data: activityData = [],
   isLoading: isLoadingActivities,
   isRefetching: isRefetchingActivities,
 } = activitiesQuery;

 const {
  data: lodgingData = [],
  isLoading: isLoadingLodging,
  isRefetching: isRefetchingLodging,
 } = lodgingQuery;

 const { data: tripData, isLoading: isLoadingTrip } = tripQuery;

 const isLoading = isLoadingActivities || isLoadingTrip || isRefetchingActivities || isLoadingLodging || isRefetchingLodging;
 
  const ordered = React.useMemo(() => {
    if (typeof activityData === "undefined" || activityData?.length === 0)
      return [];
    return activityData.sort((a, z) => {
      if (dayjs(a.start_date).isBefore(dayjs(z.start_date))) return -1;
      return 1;
    });
  }, [activityData]);

  const tripDays = React.useMemo(() => {
    if (isNil(tripData?.departure_date) || isNil(tripData?.return_date))
      return [];
    const startDate = dayjs(tripData?.departure_date).startOf('day');
    const endDate = dayjs(tripData?.return_date).endOf('day');

    const days = [];
    let currentDay = startDate;
    while (currentDay.isBefore(endDate, "day")) {
      days.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }

    const dayData = days.map((day) => {
      const activities = ordered.filter((act) =>
        dayjs(act.start_date).isSame(day, "day")
      );

      const lodgingInMorning = lodgingData.filter(hotelStay => {
        if(dayjs(hotelStay.start_date).isSame(day, 'day')){
          return true;
        }
      });

      const lodgingAtNight = lodgingData.filter(hotelStay => {
        if(dayjs(hotelStay.end_date).isSame(day, 'day')){
          return true
        }
      })
      return {
        id: `${day.toISOString()}-${activities.map((a) => a.id).join("-")}-${lodgingAtNight[0] ? lodgingAtNight[0].id : "none"} - ${lodgingInMorning[0] ? lodgingInMorning[0].id : "none"}`,
        day,
        activities,
        lodgingAtNight,
        lodgingInMorning,
      };
    });
    return dayData || [];
  }, [tripData, lodgingData, ordered]);

  return {tripDays, isLoading}
}

export default useMergeDayActivities;