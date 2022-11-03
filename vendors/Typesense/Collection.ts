import { TypesenseBase } from "./Base";
import { TypesenseDocument } from "./Document";
import { arrayToObject } from "./helpers";

export class TypesenseCollection extends TypesenseBase {
  name: string;
  defaultSortingField: string;
  fields: ITypesenseField[];
  _documents: DocumentCache<TypesenseDocument>;

  constructor(
    apiKey: string,
    hostUrl: string,
    name: string,
    fields: ITypesenseField[],
    documents: TypesenseDocument[] = [],
    defaultSortingField?: string
  ) {
    super(apiKey, hostUrl);
    this.name = name;
    this.fields = fields;
    this._documents = arrayToObject(documents, "id");
    this.defaultSortingField = defaultSortingField || fields[0].name;
  }

  async query(q: string | QueryParamObject) {
    if (typeof q === "string") {
      const path = `/collections/${this.name}/documents/search?q=${q}`;
      return await this.fetcher(path);
    } else {
      const paramString = Object.entries(q)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      const path = `/collections/${this.name}/documents/search?${paramString}`;
      return await this.fetcher(path);
    }
  }

  async insert() {
    const path = `/collections`;
    const method = "POST";
    await this.fetcher(path, method, {
      name: this.name,
      fields: this.fields,
      default_sorting_key: this.defaultSortingField,
    });
    return this;
  }

  get documents() {
    return {
      create: async (data: ITypesenseDocument) => {
        try {
          this._documents[data.id] = await new TypesenseDocument(
            this.apiKey,
            this.hostUrl,
            data.id,
            data,
            this.name
          ).insert();
        } catch (err) {
          console.log(err);
        }
      },
    };
  }
  document(id: keyof typeof this._documents) {
    return this._documents[id];
  }
}