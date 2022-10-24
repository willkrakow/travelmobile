import { useQuery } from "react-query";
import { NHTSAApi } from "../vendors/NHTSA";



const useVehicleOptions = (make?: string, year?: string) => {
    const makes = useQuery(['vehiclemakes'], async () => {
        const raw = await NHTSAApi.getMakes()
        return raw.Results.map(r => ({
            id: r.Make_ID.toString(),
            value: r.Make_Name,
        }))
    }, {
        refetchInterval: 10 * 1000
    });

    const models = useQuery(['vehiclemakes', make, year], async () => await NHTSAApi.getModelsForMake(make, year), {
        enabled: !!make && make.length > 2
    });


    return {makes, models}
}

export default useVehicleOptions;