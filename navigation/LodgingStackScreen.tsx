import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LodgingForm from "../components/LodgingForm";
import LodgingList from "../components/LodgingList";
import { LodgingStackParamList } from "../types";

const LodgingStack = createNativeStackNavigator<LodgingStackParamList>();

const LodgingStackScreen = () => {
  return (
    <LodgingStack.Navigator screenOptions={{ headerShown: false }}>
      <LodgingStack.Screen name="Home" component={LodgingList} />
      <LodgingStack.Screen name="AddLodging" component={LodgingForm} options={{ headerShown: true, headerTitle: "" }} />
    </LodgingStack.Navigator>
  );
};

export default LodgingStackScreen;