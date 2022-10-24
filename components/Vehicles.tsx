import React from 'react'
import { FAB, lightColors, ListItem, Text } from '@rneui/themed'
import useVehicles from '../hooks/useVehicles'
import { StyleSheet, View } from 'react-native';
import { TransportStackScreenProps } from '../types';
import ThemeIcon from './ThemeIcon';

const Vehicles = ({ navigation }: TransportStackScreenProps<"Vehicles">) => {
  const { getAll: vehicles } = useVehicles();
  return (
    <View style={styles.root}>
      <Text h4>Vehicles</Text>
      {vehicles.data &&
        vehicles.data.length > 0 &&
        vehicles.data.map((d) => (
          <ListItem key={d.id} containerStyle={styles.listItemContainer}>
            <ListItem.Content>
              <ListItem.Subtitle>
                {d.year} {d.make}
              </ListItem.Subtitle>
              {d.model && <ListItem.Title>{d.model} </ListItem.Title>}
              {d.color && (
                <View
                  style={[
                    {
                      /* @ts-ignore */
                      backgroundColor: COLOR_LABELS[d?.color],
                    },
                    styles.vehicleColor,
                  ]}
                >
                  <Text>{d.color}</Text>
                </View>
              )}
              {d.miles && <Text>{d.miles} miles</Text>}
              <Text style={styles.licensePlate}>{d.license_plate}</Text>
            </ListItem.Content>
          </ListItem>
        ))}
        <FAB icon={<ThemeIcon name="add" color="white" />} onPress={() => navigation.navigate("AddVehicleForm")} placement="right" />
    </View>
  );
};

export default Vehicles;

const styles = StyleSheet.create({
  root: {
    padding: 10,
    flex: 1,
  },
  listItemContainer: {
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  listItemTitle: {
    marginBottom: 10,
  },
  vehicleColor: { width: 10, height: 10, borderRadius: 10 },
  licensePlate: {
    color: lightColors.grey2,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});