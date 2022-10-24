import { Dialog, Text } from "@rneui/themed";
import useLodging from "../hooks/useLodging";
import { ILodging } from "../types/Lodging";

interface IDeleteLodgingDialog {
    isVisible: boolean;
    onClose: () => void;
    lodging: ILodging & {id: string}
}
const DeleteLodgingDialog = ({ onClose, isVisible, lodging }: IDeleteLodgingDialog) => {
    const {remove} = useLodging();

    const handleConfirmDelete = () => {
        remove.mutate(lodging.id, {
            onSuccess: () => onClose(),
        })
    }

    return (
      <Dialog
        isVisible={isVisible}
        onBackdropPress={onClose}
        animationType="slide"
      >
        <Dialog.Title title="Delete this booking?" />
        <Text>{lodging.title}</Text>
        {remove.isLoading && <Dialog.Loading />}
        <Dialog.Actions>
          <Dialog.Button
            style={{ borderRadius: 20 }}
            onPress={handleConfirmDelete}
            title="Delete"
            type="solid"
            color="warning"
            loading={remove.isLoading}
          />
          <Dialog.Button
            style={{ borderRadius: 20 }}
            onPress={onClose}
            title="Cancel"
            type="outline"
            color="primary"
            disabled={remove.isLoading}
          />
        </Dialog.Actions>
      </Dialog>
    );
}

export default DeleteLodgingDialog