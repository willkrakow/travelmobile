/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Dayjs } from 'dayjs';
import { ILodging } from './types/Lodging';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  FirstTrip: undefined;
  NotFound: undefined;
  SignIn: undefined;
};

export type TripsStackParamList = {
  Home: undefined;
  TripDetails: {id: string};
}

export type TransportStackParamList = {
  Home: undefined;
  Vehicles: undefined;
  AddVehicleForm: undefined;
  AddDriveForm: undefined;
  AddFlightForm: undefined;
  AddTrainForm: undefined;
  AddRideshareForm: undefined;
}

export type ActivityStackParamList = {
  Home: undefined;
  AddActivity: {default_date?: string};
}

export type ActivityStackScreenProps<
  Screen extends keyof ActivityStackParamList
> = NativeStackScreenProps<ActivityStackParamList, Screen>;

export type LodgingStackParamList = {
  Home: undefined;
  AddLodging: {default_day?: Dayjs, default_data?: ILodging & {id: string}};
}
export type LodgingStackScreenProps<
  Screen extends keyof LodgingStackParamList
> = NativeStackScreenProps<LodgingStackParamList, Screen>;

export type ProfileStackParamList = {
  Home: undefined;
  Trips: undefined;
  EditTrip: {trip_id: string};
  CreateTrip: undefined;
};
export type ProfileStackScreenProps<Screen extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, Screen>;

export type TripsStackScreenProps<Screen extends keyof TripsStackParamList> = NativeStackScreenProps<
  TripsStackParamList,
  Screen
>;

export type TransportStackScreenProps<Screen extends keyof TransportStackParamList> =
  NativeStackScreenProps<TransportStackParamList, Screen>;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Transport: NavigatorScreenParams<TransportStackParamList>;
  Lodging: NavigatorScreenParams<LodgingStackParamList>;
  Activities: NavigatorScreenParams<ActivityStackParamList>;
  Map: undefined;
  Trips: TripsStackParamList;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  Modal: undefined;
  FirstTrip: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;