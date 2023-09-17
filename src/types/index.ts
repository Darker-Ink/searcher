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
    key: string
    value: string
}