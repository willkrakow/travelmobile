import React from 'react'
import { useQuery } from 'react-query'
import { getPlaceDetails } from '../utils/maps';


const usePlaceDetails = (placeId: string) => {
    const query = useQuery(placeId, async () => await getPlaceDetails(placeId), {
        enabled: !!placeId && placeId.length > 0
    })

    return query
}

export default usePlaceDetails