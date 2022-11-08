import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Activities: {
            screens: {
              ActivitiesRoot: 'activitiesroot',
              AddActivity: 'addactivity',
            }
          },
          Lodging: {
            screens: {
              LodgingRoot: 'lodging',
            },
          },
          Map: {
            screens: {
              MapRoot: 'map'
            }
          },
          Transport: {
            screens: {
              TransportRoot: 'transport',
              AddVehicle: 'addvehicle',
              AddFlight: "addflight"
            }
          },
          Trips: {
            screens: {
              HomeScreen: 'home',
              TripScreen: 'trip',
            },
          },
          Profile: {
            screens: {
              ProfileRoot: 'profile',
              Friends: 'friends'
            },
          },
        },
      },
      FirstTrip: 'firsttrip',
      Modal: 'modal',
      NotFound: '*',
      SignIn: 'signin',
    },
  },
};

export default linking;
