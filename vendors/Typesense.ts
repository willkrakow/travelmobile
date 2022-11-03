type ITypesenseDocument = {
    [key: string]: string | number | boolean
} & {id: string};

interface ITypesenseField {
    name: string;
    type: 'string' | 'int32';
}
interface ITypesenseCollection {
    name: string;
    fields: ITypesenseField[];
    default_sorting_field: string;
}


class TypesenseBase {
  apiKey: string;
  hostUrl: string;

  constructor(apiKey: string, hostUrl: string) {
    this.apiKey = apiKey;
    this.hostUrl = hostUrl;
  }

  async fetcher<DataType, ReturnType>(
    path: string,
    method: "POST" | "GET" | "PATCH" | "DELETE" = "GET",
    data?: DataType
  ): Promise<ReturnType> {
    const headers = {
      "Content-Type": "application/json",
      "X-TYPESENSE-API-KEY": this.apiKey,
    };

    const url = `${this.hostUrl}${path}`;

    const result = await fetch(url, {
      headers,
      method,
      body: data ? JSON.stringify(data) : null,
    });

    return (await result.json()) as Promise<ReturnType>;
  }
}


type QueryParamObject = {
    q?: string;
    query_by: string;
    filter_by: string;
    sort_by: string;
}

type DocumentCache<T> = {
    [id: string]: T
}

function arrayToObject<T extends Record<string, any>>(arr: T[], key: keyof T){
    const obj: DocumentCache<T> = {};
    arr.forEach(el => obj[el[key]] = el);

    return obj;
}


class TypesenseCollection extends TypesenseBase {
  name: string;
  defaultSortingField: string;
  fields: ITypesenseField[];
  _documents: DocumentCache<TypesenseDocument>

  constructor(
    apiKey: string,
    hostUrl: string,
    name: string,
    fields: ITypesenseField[],
    documents: TypesenseDocument[] = [],
    defaultSortingField?: string,
  ) {
    super(apiKey, hostUrl);
    this.name = name;
    this.fields = fields;
    this._documents = arrayToObject(documents, 'id');
    this.defaultSortingField =
      defaultSortingField || (fields[0].name);
  }

  async query(q: string | QueryParamObject) {
    if(typeof q === 'string'){
        const path = `/collections/${this.name}/documents/search?q=${q}`
        return await this.fetcher(path)
    } else {
        const paramString = Object.entries(q).map(([key, value]) => `${key}=${value}`).join('&');
        const path = `/collections/${this.name}/documents/search?${paramString}`;
        return await this.fetcher(path);
    }
  }

  async insert(){
    const path = `/collections`
    const method = "POST";
    await this.fetcher(path, method, {name: this.name, fields: this.fields, default_sorting_key: this.defaultSortingField})
    return this;
  }

  get documents() {
    return {
        create: async (data: ITypesenseDocument) => {
            try {
                this._documents[data.id] = await new TypesenseDocument(this.apiKey, this.hostUrl, data.id, data, this.name).insert();
            } catch(err){
                console.log(err)
            }
        }
    }

}
    document(id: keyof typeof this._documents){
        return this._documents[id]
    }
}

class Typesense extends TypesenseBase {
    _collections: DocumentCache<TypesenseCollection>;

    constructor(apiKey: string, hostUrl: string, collections: TypesenseCollection[] = []){
        super(apiKey, hostUrl);
        this._collections = arrayToObject(collections, 'name');
    }

    get collections(){
        return {
            create: async (collection: ITypesenseCollection) => {
                try {
                    this._collections[collection.name] = await new TypesenseCollection(this.apiKey, this.hostUrl, collection.name, collection.fields, [], collection.default_sorting_field).insert();
                } catch(err){
                    console.log(err);
                }
            },
            list: () => {
                return Object.values(this._collections);
            }
        }
    }

    collection(collectionName: keyof typeof this._collections){
        return this._collections[collectionName]
    }
}

class TypesenseDocument<T = any> extends TypesenseBase {
    id: string;
    _data: T;
    collectionName: string;
    constructor(apiKey: string, hostUrl: string, id: string, data: T, collectionName: string){
        super(apiKey, hostUrl);
        this.id = id;
        this._data = data;
        this.collectionName = collectionName;
    }

    async insert(){
        const path = `collections/${this.collectionName}/documents`
        const method = "POST"
        await this.fetcher(path, method, this._data)
        return this
    }

    async update(data: Partial<T>){
        const path = `collections/${this.collectionName}/documents/${this.id}`
        const method = `PATCH`;
        await this.fetcher(path, method, data);
        Object.assign({}, this._data, data);
    }
}


const typesense = new Typesense('xyz', 'http://localhost:8108');

export const trial = async () => typesense.collections.create({name: "asdf", default_sorting_field: "asdf", fields: [{name: "first", type: "string"}]});