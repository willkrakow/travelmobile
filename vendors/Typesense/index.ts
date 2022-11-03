import { Typesense } from "./Typesense";

const typesense = new Typesense("xyz", "http://localhost:8108");

export const trial = () =>
  typesense.collections.create({
    name: "asdf",
    default_sorting_field: "asdf",
    fields: [{ name: "first", type: "string" }],
  });


export default typesense