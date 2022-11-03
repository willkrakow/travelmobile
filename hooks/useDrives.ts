import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { IDrive } from "../types/Drives";
import { createCollection } from "../vendors/Firebase";
import { useTripContext } from "./useTripContexts";

export const driveCol = createCollection<IDrive>("drives");
const useDrives = () => {
  const client = useQueryClient();
  const { tripId = "" } = useTripContext();

  const queryKey = ["trips", tripId, "drives"];
  const getAll = useQuery(
    queryKey,
    async () => {
      const q = query(driveCol, where("trip_id", "==", tripId));
      const { docs } = await getDocs(q);

      return docs.map((l) => ({
        id: l.id,
        ...l.data(),
      }));
    },
    {
      enabled: tripId.length > 0,
      refetchOnMount: true,
      refetchInterval: 1000 * 60,
    }
  );

  const onSuccess = () => {
    client.invalidateQueries(queryKey);
    client.refetchQueries(queryKey);
  };
  const create = useMutation(
    async (data: IDrive) => {
      const res = await addDoc(driveCol, data);
      return res;
    },
    { onSuccess }
  );

  const remove = useMutation(
    async (id: string) => {
      const docRef = doc(driveCol, id);
      await deleteDoc(docRef);
    },
    { onSuccess }
  );

  return { getAll, create, remove };
};

export default useDrives;
