import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import { ActivityStackParamList } from "../types";

const ActivityStack = createNativeStackNavigator<ActivityStackParamList>();

const ActivityStackScreen = () => {
  return (
    <ActivityStack.Navigator screenOptions={{ headerShown: true,  }}>
      <ActivityStack.Screen name="Home" component={ActivityList} />
      <ActivityStack.Screen
        name="AddActivity"
        component={ActivityForm}
        options={{headerShown: true, headerTitle: ""}}
      />
    </ActivityStack.Navigator>
  );
};

export default ActivityStackScreen;
