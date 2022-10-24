import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DriveForm from "../components/DriveForm";
import FlightForm from "../components/FlightForm";
import VehicleForm from "../components/VehicleForm";
import Vehicles from "../components/Vehicles";
import TransportScreen from "../screens/TransportScreen";
import { TransportStackParamList } from "../types";

const TransportStack = createNativeStackNavigator<TransportStackParamList>();

const TransportStackScreen = () => {
  return (
    <TransportStack.Navigator screenOptions={{ headerShown: false }}>
      <TransportStack.Screen name="Home" component={TransportScreen} />
      <TransportStack.Screen name="Vehicles" component={Vehicles} />
      <TransportStack.Screen name="AddDriveForm" component={DriveForm} />
      <TransportStack.Screen name="AddVehicleForm" component={VehicleForm} options={{presentation: "modal"}} />
      <TransportStack.Screen name="AddFlightForm" component={FlightForm} options={{presentation: "modal"}} />
    </TransportStack.Navigator>
  );
};

export default TransportStackScreen;