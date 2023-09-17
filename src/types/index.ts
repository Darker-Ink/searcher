export interface Endpoints {
    [key: string]: API;
}

export interface Routes {
    [key: string]: API;
}

export interface Strings {
    [key: string]: string;
}

export interface API {
    route: string;
    args: any[];
    firstSeen: number;
    oldRoutes: any[];
    key: string;
}

export interface UrlFormatted {
    url: string;
    firstSeen: number;
    key: string;
}

export interface Stringy {
    key: string;
    value: string;
}

export interface Stringys {
    type: 'stringy',
    value: Stringy[];
}

export interface UrlFormatteds {
    type: 'urlFormatted',
    value: UrlFormatted[];
}

export type FilteredData = Stringys | UrlFormatteds;

export interface Page {
    current: number,
    max: number,
    perPage: number;
}

export interface Searching {
    value: string,
    type: 'route' | 'endpoint' | 'string',
    subType: 'key' | 'value';
}

export interface Data {
    Routes: Routes | null;
    Endpoints: Endpoints | null;
    Strings: Strings | null;
}