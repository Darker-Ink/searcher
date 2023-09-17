import { Data, Searching, UrlFormatted } from "@/types";
import { EscapeString } from "./StringEscape";
import { ReverseObject } from "./ReverseObject";

/**
 * Filters data via search
 */
export const FilterViaSearch = (data: Data, searching: Searching, searchType: 'regex' | 'string'): any => {

    if (!data?.Routes || !data.Endpoints || !data.Strings) {
        console.warn('No data found');

        return [];
    }

    switch (searching.type) {
        case "endpoint":
        case "route": {
            const typeData = searching.type === 'endpoint' ? data.Endpoints : data.Routes;
            const keys = Object.keys(typeData);
            const values = Object.values(typeData);

            switch (searching.subType) {
                case "key": {
                    return keys
                        .filter(key => key.toLowerCase().includes(searching.value.toLowerCase()))
                        .map(key => {
                            const value = typeData[key];
                            if (!value) return {};
                            return {
                                url: value.route,
                                firstSeen: value.firstSeen,
                                key
                            };
                        }) as UrlFormatted[];
                }

                case "value": {
                    return values
                        .filter(value => value.route.toLowerCase().includes(searching.value.toLowerCase()))
                        .map(value => {
                            if (!value) return {};
                            return {
                                url: value.route,
                                firstSeen: value.firstSeen,
                                key: value.key
                            };
                        }) as UrlFormatted[];
                }
            }

        }

        case "string": {
            const keys = Object.keys(data.Strings);
            const regex = new RegExp(searchType === 'string' ? EscapeString(searching.value.toLowerCase()) : searching.value, 'i');

            switch (searching.subType) {
                case "key": {
                    return keys
                        .filter(key => regex.test(key))
                        .map(key => ({
                            key,
                            value: data.Strings?.[key] as string
                        }));
                }

                case "value": {
                    const Reversed = ReverseObject(data.Strings ?? {});
                    const newKeys = Object.keys(Reversed);

                    return newKeys
                        .filter(key => regex.test(key.toLowerCase()))
                        .map(key => ({
                            key: Reversed[key],
                            value: key
                        }));
                }
            }

        }
    }
};