import { ScrollView, StyleSheet, View } from 'react-native';
import { ProfileStackScreenProps } from '../types';
import {Card, Button, Text} from '@rneui/themed';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import useFirebaseTrips from '../hooks/useFirebaseTrips';

export default function TripsHomeScreen({ navigation }: ProfileStackScreenProps<'Trips'>) {
  const {query} = useFirebaseTrips();
  const [isAdding, setIsAdding] = React.useState<boolean>(false);

  const handleAdding = () => {
    setIsAdding(prev => !prev)
  }

  const handleSelect = (id: string) => {
    navigation.navigate<"EditTrip">("EditTrip", {trip_id: id})
  }
  
  return (
    <SafeAreaView>
      {/* {/* {query.isLoading && <LinearProgress />} */}
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            padding: 10,
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <View style={{ flex: 0.5 }}>
            <Text h1>Trips</Text>
          </View>
          <View style={{ flex: 0.5 }}>
            <Button color="primary" type="solid" onPress={handleAdding}>
              <Ionicons name="add" /> Add trip
            </Button>
          </View>
        </View>
        {query.data &&
          query.data.length > 0 &&
          query.data.map((item) => (
            <Card key={item.id} containerStyle={{ padding: 0 }}>
              {item.cover_image_url && (
                <Card.Image
                  source={{
                    uri: item?.cover_image_url,
                  }}
                />
              )}
              <Card.Title>{item.title}</Card.Title>
              <View style={styles.cardDatesContainer}>
                <Text>
                  {dayjs(item.departure_date?.replaceAll("-", "/")).format("MM/DD")} -{" "}
                  {dayjs(item.return_date?.replaceAll('-', "/")).format("MM/DD")}
                </Text>
              </View>
              <View
                style={{
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  color="primary"
                  type="solid"
                  onPress={() => handleSelect(item.id)}
                >
                  <Ionicons name="information" color="white" /> View
                </Button>
                <Button
                  color="primary"
                  type="outline"
                  onPress={() => handleSelect(item.id)}
                >
                  <Ionicons name="pencil" color="gray" /> Edit
                </Button>
              </View>
            </Card>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardDatesContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});
