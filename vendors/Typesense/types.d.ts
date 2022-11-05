type ITypesenseDocument = {
  [key: string]: string | number | boolean;
} & { id: string };


type ExtractStringKeys<T> = Extract<keyof T, string>
interface ITypesenseField<DocType extends ITypesenseDocument> {
  name: ExtractStringKeys<DocType>
  type: "string" | "int32";
}
interface ITypesenseCollection<DocType extends ITypesenseDocument> {
  name: string;
  fields: ITypesenseField<DocType>[];
  default_sorting_field: ExtractStringKeys<DocType>
}


type QueryParamObject<DocType extends ITypesenseDocument> = {
  q?: string;
  query_by: ExtractStringKeys<DocType>;
  filter_by?: ExtractStringKeys<DocType>;
  sort_by?: ExtractStringKeys<DocType>;
};

type DocumentCache<T> = {
  [id: string]: T;
};