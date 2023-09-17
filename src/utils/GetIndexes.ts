import { FilteredData, Page } from "@/types";

/**
 * Gets the start and end indexes for the current page
 */
export const getIndexes = (page: Page, filteredData: FilteredData | undefined) => {
    const startIndex = (page.current - 1) * page.perPage;
    const endIndex = Math.min(startIndex + page.perPage, filteredData?.value.length ?? 0);

    return {
      startIndex,
      endIndex
    };
  };