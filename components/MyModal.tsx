import React from 'react'
import { Modal, ModalProps, View } from "react-native";
import { FAB, useTheme } from '@rneui/themed'
import { Ionicons } from '@expo/vector-icons';


type IMyModal = {
    children: React.ReactNode;
    visible: boolean;
    presentationStyle: ModalProps["presentationStyle"];
    onDismiss: ModalProps["onDismiss"];
} & ModalProps
const MyModal = ({children, onDismiss, visible, presentationStyle, ...rest}: IMyModal) => {
    const {theme} = useTheme()
    return (
      <Modal
        visible={visible}
        presentationStyle={presentationStyle}
        onDismiss={onDismiss}
        style={{ marginTop: presentationStyle === "formSheet" ? 20 : 0 }}
        animationType="slide"
        {...rest}
      >
          <FAB
          style={{elevation: 20, zIndex: 20}}
            icon={
              <Ionicons name="close" color={theme.colors.white} size={20} />
            }
            onPress={onDismiss}
            placement="right"
          />
        <View
          style={{ paddingTop: presentationStyle === "formSheet" ? 20 : 0, elevation: 10 }}
        >
          {children}
        </View>
      </Modal>
    );
}

export default MyModal