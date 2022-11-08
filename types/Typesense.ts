
export interface IDocType {
    id: string;
    [key: string]: any;
}
export interface ITypesenseQueryResponse<T extends IDocType> {
    facet_counts: number;
    hits: ITypesenseQueryHit<T>[];
    out_of: number;
    page: number;
    request_params: {
        collection_name: string;
        per_page: number;
        q: string;
    }
}

export interface ITypesenseQueryHit<T extends IDocType> {
    document: T;
    highlights: any[];
    text_match: number;
}

export interface IUserRecord extends IDocType {
    first_name: string;
    last_name: string;
    user_id: string;
    id: string;
}