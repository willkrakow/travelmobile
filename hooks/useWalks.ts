import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { IWalk } from "../types/Walks";
import { createCollection } from "../vendors/Firebase";
import { useTripContext } from "./useTripContexts";

export const walkCol = createCollection<IWalk>("walks");
const useWalks = () => {
  const client = useQueryClient();
  const { tripId = "" } = useTripContext();

  const queryKey = ["trips", tripId, "walks"];
  const getAll = useQuery(
    queryKey,
    async () => {
      const q = query(walkCol, where("trip_id", "==", tripId));
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
    async (data: IWalk) => {
      const res = await addDoc(walkCol, data);
      return res;
    },
    { onSuccess }
  );

  const remove = useMutation(
    async (id: string) => {
      const docRef = doc(walkCol, id);
      await deleteDoc(docRef);
    },
    { onSuccess }
  );

  return { getAll, create, remove };
};

export default useWalks;
