import { FontAwesome } from "@expo/vector-icons";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { TripContext } from "../hooks/useTripContexts";
import useFirebaseTrips from "../hooks/useFirebaseTrips";
import { Button} from "@rneui/themed";
import ThemeIcon from "../components/ThemeIcon";
import MapScreen from "../screens/MapScreen";
import SignInScreen from "../screens/SignInScreen";
import useAccount from "../hooks/useAccount";
import { ProfileStackScreen } from "./ProfileStackScreen";
import TransportStackScreen from "./TransportStackScreen";
import LodgingStackScreen from "./LodgingStackScreen";
import ActivityStackScreen from "./ActivityStackScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [currentTripId, setCurrentTripId] = React.useState<
    string | undefined
  >();
  const [currentTripTitle, setCurrentTripTitle] = React.useState<
    string | undefined
  >();

  const {
    query: { data = [] },
  } = useFirebaseTrips();
  const { navigate,  } = useNavigation();
  React.useEffect(() => {
    if (!currentTripId || currentTripId.length === 0) {
      setCurrentTripId(data?.[0]?.id || "");
    }
  }, [data, currentTripId]);

  React.useEffect(() => {
    const matching = data.find((d) => d.id === currentTripId);
    if (matching) {
      setCurrentTripTitle(matching.title);
    }
  }, [currentTripId, data]);

  const {auth: {currentUser}} = useAccount();

  React.useEffect(() => {
    if(currentUser === null) {
      navigate("SignIn");
    }
  }, [currentUser])


  const changeTripId = React.useCallback((id: string) => setCurrentTripId(id), [])
  return (
    <TripContext.Provider
      value={{
        tripId: currentTripId,
        changeTripId,
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{
            headerShown: true,
            headerTitle: currentTripTitle,
            headerBackVisible: false,
            headerTitleStyle: {
              fontFamily: "LobsterTwo-Bold"
            },
            headerRight: () => (
              <Button icon={<ThemeIcon name="list" />} onPress={() => navigate("Modal")} type="clear" color="primary" />
            )
          }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={{
            headerShown: true,
            headerTitle: 'Select a trip',
          }}
        />
      </Stack.Navigator>
    </TripContext.Provider>
  );
}


/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const bottomTabScreenOptions: BottomTabNavigationOptions = {
  tabBarLabelStyle: {
    fontFamily: "Inter-Bold"
  },
  headerTitleStyle: {
    fontFamily: "Inter-Light"
  }
}
function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
      }}
      detachInactiveScreens
    >
      <BottomTab.Screen
        name="Activities"
        component={ActivityStackScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="play" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Lodging"
        component={LodgingStackScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="hotel" color={color} />,
          ...bottomTabScreenOptions
        }}
      />
      <BottomTab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="location-arrow" color={color} />
          ),
          ...bottomTabScreenOptions
        }}
      />
      <BottomTab.Screen
        name="Transport"
        component={TransportStackScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="plane" color={color} />,
          ...bottomTabScreenOptions
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerShown: false,
          ...bottomTabScreenOptions
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: 0 }} {...props} />;
}
