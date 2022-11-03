export class TypesenseBase {
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
