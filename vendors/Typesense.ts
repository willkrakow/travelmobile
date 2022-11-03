type ITypesenseDocument<Collection extends ITypesenseCollection> = {
    [Property in keyof Collection['fields'][any]['name']]: any
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

class Typesense {
    private apiKey: string;
    private hostUrl: string;
    collections: string[];

    constructor(apiKey: string, hostUrl: string){
        this.apiKey = apiKey;
        this.hostUrl = hostUrl;
        this.collections = [];
    }

    private async fetcher<DataType, ReturnType>(path: string, method: "POST" | "GET" | "PATCH" | "DELETE" = "GET", data?: DataType): Promise<ReturnType>{
        const headers = {
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': this.apiKey
        }

        const url = `${this.hostUrl}${path}`;

        const result = await fetch(url, {
            headers,
            method,
            body: data ? JSON.stringify(data) : null
        })

        return await result.json() as Promise<ReturnType>
    }

    async addCollection(collection: ITypesenseCollection){
        try {
            const result = await this.fetcher('/collections', 'POST', collection);
            this.collections.push(collection.name);
        } catch(err){
            console.log(err);
        }
    }

    async indexDocument<T extends ITypesenseCollection>(collection: T, document: ITypesenseDocument<T>){
        const path = `/collections/${collection.name}/documents`;
        const method = "POST";

        return await this.fetcher<ITypesenseDocument<T>, ITypesenseDocument<T>>(path, method, document)
    }

    async searchCollection(collectionName: typeof this.collections[any], query: string){
        const path = `/collections/${collectionName}/documents/search?q=${query}`
        return await this.fetcher(path)
    }

}

class TypesenseCollection<T extends ITypesenseField[]> {
  name: string;
  defaultSortingField: keyof T[any]["name"];
  fields: T;
  
  constructor(
    name: string,
    fields: T,
    defaultSortingField?: keyof T[any]["name"]
  ){
    this.name = name;
    this.fields = fields;
    this.defaultSortingField = defaultSortingField || fields[0].name as keyof T[any]['name']
  }
}