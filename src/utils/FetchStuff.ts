import { Endpoints, Routes, Strings } from "@/types";

export const EndpointsUrl = 'https://raw.githubusercontent.com/Darker-Ink/routes/master/src/saves/Json/Endpoints/Endpoints.json';
export const RoutesUrl = 'https://raw.githubusercontent.com/Darker-Ink/routes/master/src/saves/Json/Routes/Routes.json';
export const StringsUrl = 'https://raw.githubusercontent.com/Darker-Ink/discord-strings/master/src/saves/Strings.json';

/**
 * Endpoints are the API endpoints (/user/@me etc)
 */
const FetchEndpoints = async (): Promise<Endpoints> => {
    const res = await fetch(EndpointsUrl);

    if (!res.ok) {
        throw new Error(`Fetch failed with status ${res.status}`);
    }

    return await res.json();
}

/**
 * Unlike Endpoints, Routes are the things the client users, /library/inventory, /register etc etc
 */
const FetchRoutes = async (): Promise<Routes> => {
    const res = await fetch(RoutesUrl);

    if (!res.ok) {
        throw new Error(`Fetch failed with status ${res.status}`);
    }

    return await res.json();
}

/**
 * Strings are the things that are displayed to the user, "Join over 100 million people who use Discord to talk and hang out with communities and friends"
 */
const FetchStrings = async (): Promise<Strings> => {
    const res = await fetch(StringsUrl);

    if (!res.ok) {
        throw new Error(`Fetch failed with status ${res.status}`);
    }

    return await res.json();
}

export { FetchEndpoints, FetchRoutes, FetchStrings };