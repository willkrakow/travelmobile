import React from "react";
import MyModal from "./MyModal";
import { View, FlatList } from "react-native";
import { ListItem, SearchBar, useTheme } from "@rneui/themed";

type ISearchModalAsync = {
  visible: boolean;
  label: string;
  inputText: string;
  onChangeText: (t: string) => void;
  onClose: () => void;
  onSelect: (id: string, value: string) => void;
  results: {id: string, value: string, subtitle: string}[];
};
const SearchModalAsync = ({
  inputText,
  onChangeText,
  results,
  visible,
  onClose,
  onSelect,
  label,
}: ISearchModalAsync) => {
  const onPress = (id: string, value: string) => {
    onSelect(id, value);
    onClose();
  };
  const {theme} = useTheme();

  return (
    <MyModal
      visible={visible}
      onDismiss={onClose}
      presentationStyle="pageSheet"
    >
      <View>
        <SearchBar inputContainerStyle={{borderRadius: 20, overflow: "hidden", marginTop: 5}} value={inputText} onChangeText={onChangeText} label={label} onClear={() => onChangeText('')} />
        <FlatList
          style={{ flex: 1, minHeight: 400 }}
          keyExtractor={(item: any) => item.id}
          data={results}
          extraData={results}
          renderItem={(info) => (
            <ListItem
              key={info.index}
              onPress={() => onPress(info.item.id, info.item.value)}
              containerStyle={{ minHeight: 20 }}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title style={{ fontSize: 15 }}>
                  {info.item.value}
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{ fontSize: 13, color: theme.colors.grey2 }}
                >
                  {info.item.subtitle}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
        />
      </View>
    </MyModal>
  );
};

export default SearchModalAsync;
