"use client";

import { Data, FilteredData, Page, Searching } from '@/types';
import { FetchEndpoints, FetchRoutes, FetchStrings } from '@/utils/FetchStuff';
import { FilterViaSearch } from '@/utils/FilterSearch';
import { getIndexes } from '@/utils/GetIndexes';
import Smallify from '@/utils/Smallify';
import { useState, useEffect } from 'react';


const Home = () => {
  const [data, setData] = useState<Data>({
    Routes: null,
    Endpoints: null,
    Strings: null,
  });

  const [searching, setSearching] = useState<Searching>({
    value: '',
    type: 'route',
    subType: 'key'
  });

  const [page, setPage] = useState<Page>({
    current: 1,
    max: 1,
    perPage: 10
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<FilteredData>();
  const [loadingString, setLoadingString] = useState<string>('Loading...');
  const [searchType, setSearchType] = useState<'regex' | 'string'>('string');

  useEffect(() => {
    const fetchData = async () => {
      const Endpoints = await FetchEndpoints();
      const Routes = await FetchRoutes();
      const Strings = await FetchStrings();

      setData({
        Routes,
        Endpoints,
        // Strings: Smallify(Strings),
        Strings
      });

      setLoading(false);

      setSearching({
        subType: 'key',
        type: 'route',
        value: ''
      });

      setPage({
        current: 1,
        max: Math.round(Object.keys(Endpoints).length / 100),
        perPage: 100
      });

      console.log(`Wowie, I've loaded ${Object.keys(Endpoints).length} endpoints, ${Object.keys(Routes).length} routes and ${Object.keys(Strings).length} strings!`);
    };

    fetchData();
  }, []);


  useEffect(() => {
    const Filtered = FilterViaSearch(data, searching, searchType);

    setPage((page) => ({
      ...page,
      max: Math.round(Filtered.length / page.perPage),
      current: 1
    }));

    setFilteredData({
      type: searching.type === 'string' ? 'stringy' : 'urlFormatted',
      value: Filtered
    });

  }, [searching, data, searchType]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingString((loadingString) => {
        return loadingString === 'Loading...' ? 'Loading.' : 'Loading...';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {loading ?
          (<>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold mb-4">Discord Thingy Search</h1>
              <h1 className="text-2xl font-bold mb-4">{loadingString}</h1>
            </div>
          </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Discord Thingy Search</h1>
                <div className="flex items-center justify-center">
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

                  <button
                    onClick={() => setSearchType(searchType === 'regex' ? 'string' : 'regex')}
                    className="bg-[#202225] rounded-md p-2 mb-4 ml-2"
                  >
                    {searchType === 'regex' ? 'Regex' : 'String'}
                  </button>

                </div>
                <div className="flex flex-row">
                  <button
                    className={`border-2 border-[#5865F2] rounded-md p-2 mr-2 ${searching.type === 'route' ? 'bg-[#5865F2]' : ''}`}
                    onClick={() => {
                      setSearching({
                        ...searching,
                        type: 'route'
                      });

                      setPage({
                        current: 1,
                        max: Math.round(Object.keys(data.Endpoints ?? {}).length / 100),
                        perPage: 100
                      });
                    }}
                  >
                    Route
                  </button>
                  <button
                    className={`border-2 border-[#5865F2]  rounded-md p-2 mr-2 ${searching.type === 'endpoint' ? 'bg-[#5865F2]' : ''}`}
                    onClick={() => {
                      setSearching({
                        ...searching,
                        type: 'endpoint'
                      });

                      setPage({
                        current: 1,
                        max: Math.round(Object.keys(data.Endpoints ?? {}).length / 100),
                        perPage: 100
                      });
                    }}
                  >
                    Endpoint
                  </button>
                  <button
                    className={`border-2 border-[#5865F2] rounded-md p-2 mr-2 ${searching.type === 'string' ? 'bg-[#5865F2]' : ''}`}
                    onClick={() => {
                      setSearching({
                        ...searching,
                        type: 'string'
                      });

                      setPage({
                        current: 1,
                        max: Math.round(Object.keys(data.Strings ?? {}).length / 50),
                        perPage: 50
                      });
                    }}
                  >
                    String
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
                <div className="">
                  {filteredData?.type == 'stringy' ? (
                    <>
                      <div className="flex flex-col items-center justify-center mt-4 bg-[#202225] rounded-md">
                        <h1 className="text-4xl font-bold mb-4">Results</h1>
                        <table className="table-auto">
                          <thead>
                            <tr>
                              <th>Key</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData?.value.slice(getIndexes(page, filteredData).startIndex, getIndexes(page, filteredData).endIndex).map((value) => (
                              <tr key={value.key}>
                                <td>{value.key}</td>
                                <td>{value.value}</td>
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
                              <th>Key</th>
                              <th>URL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData?.value.slice(getIndexes(page, filteredData).startIndex, getIndexes(page, filteredData).endIndex).map((value) => (
                              <tr key={value.key}>
                                <td>{value.key}</td>
                                <td>{value.url}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        <div className="">
          {!loading && (
            <>
              <div className="flex flex-row items-center justify-center mt-4">
                <button
                  className="border-2 border-[#5865F2] rounded-md p-2 mr-2"
                  onClick={() => setPage({
                    ...page,
                    current: page.current - 1 < 1 ? page.max : page.current - 1
                  })}
                >
                  Previous
                </button>
                <button
                  className="border-2 border-[#5865F2] rounded-md p-2 mr-2"
                  onClick={() => setPage({
                    ...page,
                    current: page.current + 1 > page.max ? 1 : page.current + 1
                  })}
                >
                  Next
                </button>
              </div>
              <div className="flex flex-row items-center justify-center mt-4">
                <p className="text-2xl font-bold">Page {page.current} out of {page.max}</p>
              </div>
            </>
          )}
          <div className="flex flex-row items-center justify-center mt-4">
            <p className="text-sm font-bold">Made by DarkerInk, this is not affiliated with Discord</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;