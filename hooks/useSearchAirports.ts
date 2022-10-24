import React from "react";
import { useQuery } from "react-query";
import { queryAirports } from "../utils/maps";


const useSearchAirports = () => {
    const [searchTerm, setSearchTerm] = React.useState<string>('');


    const changeSearchTerm = (text: string) => {
        setSearchTerm(text)
    }

    const reset = () => setSearchTerm('');


    const query = useQuery('airports', async () => queryAirports(searchTerm), {
        enabled: searchTerm.length > 2,
    });


    return {
        searchTerm,
        changeSearchTerm,
        reset,
        query,
    }
}

export default useSearchAirports;