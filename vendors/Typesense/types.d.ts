type ITypesenseDocument = {
  [key: string]: string | number | boolean;
} & { id: string };

interface ITypesenseField {
  name: string;
  type: "string" | "int32";
}
interface ITypesenseCollection {
  name: string;
  fields: ITypesenseField[];
  default_sorting_field: string;
}


type QueryParamObject = {
  q?: string;
  query_by: string;
  filter_by: string;
  sort_by: string;
};

type DocumentCache<T> = {
  [id: string]: T;
};