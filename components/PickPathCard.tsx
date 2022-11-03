import React from 'react'
import { Button, lightColors, ListItem } from '@rneui/themed';
import ThemeIcon from './ThemeIcon';
import GoogleMaps from '../utils/maps';
import { IDirectionsLeg } from '../types/Maps';

interface IPickPathCard {
    startPlaceId: string;
    endPlaceId: string;
    onPickPath: (type: "walk" | "drive", durationInSeconds: number) => void;
}

interface IRouteOptionData {
    driving?: IDirectionsLeg;
    walking?: IDirectionsLeg;
}
const PickPathCard = ({startPlaceId, endPlaceId, onPickPath}: IPickPathCard) => {
    const [routeOptionData, setRouteOptionData] = React.useState<IRouteOptionData>({});
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const getRouteOptions = async () => {
            setLoading(true);
            const drivingOption = await GoogleMaps.getDirections(startPlaceId, endPlaceId, "driving");
            const walkingOption = await GoogleMaps.getDirections(
              startPlaceId,
              endPlaceId,
              "walking"
            );
            setRouteOptionData({driving: drivingOption.routes[0].legs[0], walking: walkingOption.routes[0].legs[0]});
            setLoading(false);
        }

        getRouteOptions()
    }, [startPlaceId, endPlaceId]);

    const handlePickPath = (type: "walk" | "drive", durationInSeconds: number) => () => onPickPath(type, durationInSeconds);

    return (
      <ListItem
        containerStyle={{
          marginTop: -30,
          marginBottom: -30,
          paddingTop: 50,
          paddingBottom: 50,
          flex: 1,
        }}
      >
        <ListItem.Content>
          <ListItem.ButtonGroup
            containerStyle={{
              borderColor: "transparent",
              borderWidth: 0,
            }}
            innerBorderStyle={{ color: "transparent" }}
            buttons={[
              <Button
                loading={loading}
                containerStyle={{ paddingTop: 5 }}
                style={{ borderRadius: 0 }}
                buttonStyle={{ borderRadius: 10 }}
                titleStyle={{ fontSize: 12, color: "white" }}
                title={routeOptionData.driving?.duration.text}
                icon={<ThemeIcon name="car" color="white" />}
                onPress={handlePickPath("drive", routeOptionData.driving?.duration.value || 0)}
              />,
              <Button
                loading={loading}
                containerStyle={{ paddingTop: 5 }}
                style={{ borderRadius: 0 }}
                buttonStyle={{ borderRadius: 10 }}
                titleStyle={{ fontSize: 12, color: "white" }}
                title={routeOptionData.walking?.duration.text}
                icon={<ThemeIcon name="walk" color="white" />}
                onPress={handlePickPath("walk", routeOptionData.walking?.duration.value || 0)}
              />,
            ]}
          />
        </ListItem.Content>
      </ListItem>
    );
}

export default PickPathCard;