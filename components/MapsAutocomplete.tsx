import { ListItem, SearchBar } from "@rneui/themed";
import React from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import useThrottle from "../hooks/useThrottle";
import { IPlacesPrediction } from "../types/Maps";
import GoogleMaps from "../utils/maps";

interface IMapsAutocomplete {
  onSelect: (item: IPlacesPrediction) => void;
}
const MapsAutocomplete = ({ onSelect }: IMapsAutocomplete) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<IPlacesPrediction[]>([]);
  const throttled = useThrottle(searchQuery, 2000);

  const handleChangeText = (t: string) => setSearchQuery(t);

  React.useEffect(() => {
    const getQueryAutocomplete = async () => {
      setLoading(true);
      try {
        const data = await GoogleMaps.getPlaceAutocomplete(searchQuery);
        setResults(data.predictions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (throttled.length > 3) {
      getQueryAutocomplete();
    }
  }, [throttled]);

  const getSelectHandler =
    (info: ListRenderItemInfo<IPlacesPrediction>) => () => {
      onSelect(info.item);
    }
  return (
    <View style={{ flex: 1 }}>
      <SearchBar showLoading={loading} value={searchQuery} onChangeText={handleChangeText} />
      <FlatList
        data={results}
        renderItem={(info) => (
          <ListItem onPress={getSelectHandler(info)}>
            <ListItem.Content>
              <ListItem.Title>
                {info.item.structured_formatting.main_text}
              </ListItem.Title>
              <ListItem.Subtitle>
                {info.item.structured_formatting.secondary_text}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
};


export default MapsAutocomplete;