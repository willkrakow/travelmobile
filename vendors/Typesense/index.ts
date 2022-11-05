import { Typesense } from "./Typesense";
import dotenv from 'dotenv';
dotenv.config();
const { TYPESENSE_API_KEY, TYPESENSE_HOST } = process.env;
if(!TYPESENSE_API_KEY) {
    throw new Error("Missing typesense api key")
}

if(!TYPESENSE_HOST) {
    throw new Error("Missing typesense host")
}
const typesense = new Typesense(TYPESENSE_API_KEY, TYPESENSE_HOST);

export const trial = () =>
  typesense.collections.create({
    name: "asdf",
    default_sorting_field: "asdf",
    fields: [{ name: "first", type: "string" }],
  });


export default typesense