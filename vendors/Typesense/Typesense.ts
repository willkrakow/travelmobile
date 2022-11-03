import { TypesenseBase } from "./Base";
import { TypesenseCollection } from "./Collection";
import { arrayToObject } from "./helpers";

export class Typesense extends TypesenseBase {
  _collections: DocumentCache<TypesenseCollection>;

  constructor(
    apiKey: string,
    hostUrl: string,
    collections: TypesenseCollection[] = []
  ) {
    super(apiKey, hostUrl);
    this._collections = arrayToObject(collections, "name");
  }

  get collections() {
    return {
      create: async (collection: ITypesenseCollection) => {
        try {
          this._collections[collection.name] = await new TypesenseCollection(
            this.apiKey,
            this.hostUrl,
            collection.name,
            collection.fields,
            [],
            collection.default_sorting_field
          ).insert();
        } catch (err) {
          console.log(err);
        }
      },
      list: () => {
        return Object.values(this._collections);
      },
    };
  }

  collection(collectionName: keyof typeof this._collections) {
    return this._collections[collectionName];
  }
}
