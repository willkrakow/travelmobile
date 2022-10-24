export enum EVehicleType {
  RENTAL = "Rental",
  LOANER = "Loaner",
  PERSONAL = "Personal",
}

export enum EVehicleColor {
    BLACK = "Black",
    WHITE = "White",
    GREY = "Grey",
    SILVER = "Silver",
    BLUE = "Blue",
    RED = "Red",
    GREEN = "Green",
    GOLD = "Gold",
    PURPLE = "Purple",
    BROWN = "Brown"
}


export type ColorLabel = {
    [Property in EVehicleColor]: string;
}

export interface IVehicle {
  type: EVehicleType;
  rental_agency?: string;
  owner?: string;
  booking_reference?: string;
  license_plate: string;
  make: string;
  model?: string;
  year?: string;
  vin?: string;
  miles?: number;
  color?: string;
  user_id: string;
}

export interface IMakesResponse {
  Count: number;
  Message: string;
  Results: {
    Make_ID: number;
    Make_Name: string;
  }[];
}
