import React from 'react'
interface ITripContext {
  tripId?: string;
  changeTripId?: (id: string) => void;
}
export const TripContext = React.createContext<ITripContext>({});

export const useTripContext = () => {
  const ctx = React.useContext(TripContext);

  return ctx;
};
