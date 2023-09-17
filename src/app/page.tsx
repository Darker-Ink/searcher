"use client";
import { Endpoints, Routes, Strings, Stringy, UrlFormatted } from '@/types';
import { FetchEndpoints, FetchRoutes, FetchStrings } from '@/utils/FetchStuff';
import { useState, useEffect } from 'react';

interface Stringys {
  type: 'stringy',
  value: Stringy[];
}

interface UrlFormatteds {
  type: 'urlFormatted',
  value: UrlFormatted[];
}

type FilteredData = Stringys | UrlFormatteds;

const Home = () => {
  const [data, setData] = useState<{
    Routes: Routes | null,
    Endpoints: Endpoints | null,
    Strings: Strings | null,
  }>({
    Routes: null,
    Endpoints: null,
    Strings: null,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [searching, setSearching] = useState<{
    value: string,
    type: 'route' | 'endpoint' | 'string',
    subType: 'key' | 'value';
  }>({
    value: '',
    type: 'route',
    subType: 'key'
  });

  const [filteredData, setFilteredData] = useState<FilteredData>();

  const [loadingString, setLoadingString] = useState<string>('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      const Endpoints = await FetchEndpoints();
      const Routes = await FetchRoutes();
      const Strings = await FetchStrings();

      setData({
        Routes,
        Endpoints,
        Strings,
      });

      setLoading(false);

      setSearching({
        subType: 'key',
        type: 'route',
        value: ''
      });

      console.log(`Wowie, I've loaded ${Object.keys(Endpoints).length} endpoints, ${Object.keys(Routes).length} routes and ${Object.keys(Strings).length} strings!`)
    };

    fetchData();
  }, []);


  useEffect(() => {
    const FilterViaSearch = (forceKey?: boolean): any => {

      if (!data.Routes || !data.Endpoints || !data.Strings) {
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
                .filter(key => key.includes(searching.value))
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
                .filter(value => value.route.includes(searching.value))
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
          const values = Object.values(data.Strings);
          const regex = new RegExp(searching.value.toLowerCase(), 'i');

          if (forceKey) {
            return keys
                .filter(key => regex.test(key))
                .map(key => ({
                  key,
                  value: data.Strings?.[key] as string
                }));
          }

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
              if (searching.value === '') return FilterViaSearch(true);

              const Filtered = values.filter(value => regex.test(value)).slice(0, 50);

              return Filtered.map(value => {
                const key = Object.keys(data.Strings ?? {}).find(key => data.Strings?.[key].toLowerCase() === value.toLowerCase());
                if (!key) return {};
                return {
                  key,
                  value
                };
              }) as Stringy[];
            }
          }

        }
      }

      return [];
    };

    setFilteredData({
      type: searching.type === 'string' ? 'stringy' : 'urlFormatted',
      // 50 for strings, 200 for routes and endpoints (this is due to the omg amount of strigns compared to routes and endpoints)
      value: searching.type === 'string' ? FilterViaSearch().slice(0, 50) : FilterViaSearch().slice(0, 200)
    });
  }, [searching, data]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingString((loadingString) => {
        switch (loadingString) {
          case 'Loading...': {
            return 'Loading.';
          }
          case 'Loading.': {
            return 'Loading..';
          }
          case 'Loading..': {
            return 'Loading...';
          }
          case 'Loading': {
            return 'Loading.';
          }
          default: {
            return 'Loading.';
          }
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loading ? (<>{loadingString}</>) : (
        <>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">Discord Thingy Search</h1>
            <input
              type="text"
              className="rounded-md p-2 mb-4 w-96 bg-[#202225]"
              placeholder="Search for something"
              value={searching.value}
              onChange={(e) => setSearching({
                ...searching,
                value: e.target.value
              })}
            />
            <div className="flex flex-row">
              <button
                className={`border-2 border-[#5865F2] rounded-md p-2 mr-2 ${searching.type === 'route' ? 'bg-[#5865F2]' : ''}`}
                onClick={() => setSearching({
                  ...searching,
                  type: 'route'
                })}
              >
                Route
              </button>
              <button
                className={`border-2 border-[#5865F2]  rounded-md p-2 mr-2 ${searching.type === 'endpoint' ? 'bg-[#5865F2]' : ''}`}
                onClick={() => setSearching({
                  ...searching,
                  type: 'endpoint'
                })}
              >
                Endpoint
              </button>
              <button
                className={`border-2 border-[#5865F2] rounded-md p-2 mr-2 ${searching.type === 'string' ? 'bg-[#5865F2]' : ''}`}
                onClick={() => setSearching({
                  ...searching,
                  type: 'string'
                })}
              >
                String (Laggy)
              </button>
            </div>
            <div className="flex flex-row mt-4">
              <button
                className={`border-2 border-[#5865F2] rounded-md p-2 mr-2 ${searching.subType === 'key' ? 'bg-[#5865F2]' : ''}`}
                onClick={() => setSearching({
                  ...searching,
                  subType: 'key'
                })}
              >
                Key
              </button>
              <button
                className={`border-2 border-[#5865F2] rounded-md p-2 mr-2 ${searching.subType === 'value' ? 'bg-[#5865F2]' : ''}`}
                onClick={() => setSearching({
                  ...searching,
                  subType: 'value'
                })}
              >
                Value
              </button>
            </div>
            {filteredData?.type == 'stringy' ? (
              <>
                <div className="flex flex-col items-center justify-center mt-4 bg-[#202225] rounded-md">
                  <h1 className="text-4xl font-bold mb-4">Results</h1>
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th className="">Key</th>
                        <th className="">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData?.value.map((value) => (
                        <tr key={value.key + value.value}>
                          <td className="">{value.key}</td>
                          <td className="">{value.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center mt-4 bg-[#202225] rounded-md">
                  <h1 className="text-4xl font-bold mb-4">Results</h1>
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th className="">Key</th>
                        <th className="">URL</th>
                        <th className="">First Seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData?.value.map((value) => (
                        <tr key={value.key}>
                          <td className="">{value.key}</td>
                          <td className="">{value.url}</td>
                          <td className="">{new Date(value.firstSeen).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );

};

export default Home;