import { TypesenseBase } from "./Base";

export class TypesenseDocument<T = any> extends TypesenseBase {
  id: string;
  _data: T;
  collectionName: string;
  constructor(
    apiKey: string,
    hostUrl: string,
    id: string,
    data: T,
    collectionName: string
  ) {
    super(apiKey, hostUrl);
    this.id = id;
    this._data = data;
    this.collectionName = collectionName;
  }

  async insert() {
    const path = `collections/${this.collectionName}/documents`;
    const method = "POST";
    await this.fetcher(path, method, this._data);
    return this;
  }

  async update(data: Partial<T>) {
    const path = `collections/${this.collectionName}/documents/${this.id}`;
    const method = `PATCH`;
    await this.fetcher(path, method, data);
    Object.assign({}, this._data, data);
  }
}
