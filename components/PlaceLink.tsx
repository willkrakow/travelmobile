import React from "react";
import { Alert, Linking, TextProps } from "react-native";
import { placeDirectionsUrl } from "../utils/maps";
import { Text } from '@rneui/themed';

type IPlaceLink = {
  displayName: string;
  placeId: string;
} & TextProps;



const PlaceLink = ({ placeId, displayName, ...props }: IPlaceLink) => {
  const url = React.useMemo(() => {
    return placeDirectionsUrl(placeId)
  }, [placeId]);

  const handlePressLink = React.useCallback(async () => {
    const canOpenUrl = await Linking.canOpenURL(url);

    if (canOpenUrl) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error opening link");
    }
  }, [url]);
  return (
    <Text {...props} onPress={handlePressLink}>
      {displayName}
    </Text>
  );
};

export default PlaceLink;
