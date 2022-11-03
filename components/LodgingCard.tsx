import React from 'react'
import { lightColors, LinearProgress, ListItem } from '@rneui/themed'
import { ILodging } from '../types/Lodging'
import usePlaceDetails from '../hooks/usePlaceDetails'
import { Dimensions, Image, Text, View } from 'react-native'
import { placePhoto } from '../utils/images'
import { Ionicons } from '@expo/vector-icons'

interface ILodgingCard {
    lodging: ILodging
}
const LodgingCard = ({lodging}: ILodgingCard) => {
    const {data, isLoading} = usePlaceDetails(lodging.place_id);
    console.log(data?.result);
    return (
      <ListItem style={{ borderRadius: 20, overflow: "hidden", marginBottom: 20 }}>
        <ListItem.Content>
          {isLoading ? (
            <LinearProgress />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", alignContent: "center" }}>
              <View style={{ flex: 0.15 }}>
                <Ionicons name="sunny" color={lightColors.warning} size={30} />
              </View>
              <View style={{ flex: 1 }}>
                <ListItem.Subtitle style={{ color: lightColors.grey4 }}>
                  Wake up at
                </ListItem.Subtitle>
                <ListItem.Title>{lodging.title?.split(",")[0]}</ListItem.Title>
              </View>
            </View>
          )}
        </ListItem.Content>
      </ListItem>
    );
}

export default LodgingCard