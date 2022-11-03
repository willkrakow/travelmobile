import React from "react";
import MyModal from "./MyModal";
import { View, FlatList } from "react-native";
import { Avatar, ListItem, SearchBar } from "@rneui/themed";

type ISearchModal = {
  visible: boolean;
  label: string;
  onClose: () => void;
  onSelect: (id: string, value: string, data?: IOption) => void;
  options: IOption[];
};

export interface IOption {
  id: string;
  value: string;
  title: string;
  image?: string;
  index?: string;
  secondaryIndex?: string;
  [key: string]: any;
}
const SearchModal = ({
  visible,
  onClose,
  onSelect,
  options,
  label,
}: ISearchModal) => {
  const [inputText, setInputText] = React.useState<string>("");
  const [results, setResults] = React.useState<IOption[]>([]);

  React.useEffect(() => {
    if (inputText.length === 0) {
      setResults(options);
    } else {
      const cleaned = inputText.toLowerCase();
      const res = options.filter((opt) => {
        if (opt.value.toLowerCase().includes(cleaned)) return true;
        if (opt.index && opt.index.toLowerCase().includes(cleaned)) return true;
        if (
          opt.secondaryIndex &&
          opt.secondaryIndex.toLowerCase().includes(cleaned)
        )
          return true;
        return false;
      });

      setResults(res);
    }
  }, [inputText]);

  const onPress = (id: string, value: string, data: IOption) => {
    onSelect(id, value, data);
    onClose();
  };

  return (
    <MyModal
      visible={visible}
      onDismiss={onClose}
      presentationStyle="pageSheet"
    >
      <View>
        <SearchBar
          onClear={() => setInputText("")}
          value={inputText}
          onChangeText={(t) => setInputText(t)}
          label={label}
        />
        <FlatList
          style={{ flex: 1, minHeight: 400 }}
          keyExtractor={(item: any) => item.id}
          data={results}
          extraData={results}
          renderItem={(info) => (
            <ListItem
              key={info.index}
              onPress={() => onPress(info.item.id, info.item.value, info.item)}
              containerStyle={{ minHeight: 20 }}
            >
              {info.item.image && (
                <Avatar
                  imageProps={{
                    source: { uri: info.item.image },
                  }}
                />
              )}
              <ListItem.Content>
                <ListItem.Title>{info.item.title}</ListItem.Title>
                <ListItem.Subtitle>{info.item.value}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
        />
      </View>
    </MyModal>
  );
};

export default SearchModal;
