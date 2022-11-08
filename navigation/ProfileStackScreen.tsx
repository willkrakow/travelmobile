import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import FriendsList from "../components/FriendsList";
import TripFormModal from "../components/TripFormModal";
import ProfileScreen from "../screens/ProfileScreen";
import TripsHomeScreen from "../screens/TripsHomeScreen";
import { ProfileStackParamList, ProfileStackScreenProps } from "../types";

export const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Home" component={ProfileScreen} />
    <ProfileStack.Screen name="Trips" component={TripsHomeScreen} />
    <ProfileStack.Screen
      options={{
        headerShown: true,
        headerTitle: "New Trip",
        headerBackButtonMenuEnabled: true,
      }}
      name="CreateTrip"
      component={TripFormModal}
    />
    <ProfileStack.Screen
      options={{
        headerShown: true,
        headerBackTitle: "Cancel",
        headerTitle: "",
      }}
      name="EditTrip"
      component={EditTrip}
    />
    <ProfileStack.Screen options={{headerShown: true, headerBackTitle: "Back", headerTitle: ""}} name="Friends" component={FriendsList} />
  </ProfileStack.Navigator>
);


const EditTrip = ({route}: ProfileStackScreenProps<"EditTrip">) => {
    const {params: {trip_id}} = route;

    return (
        <View>
          <Text>Edit trip {trip_id}</Text>
        </View>
    )
}