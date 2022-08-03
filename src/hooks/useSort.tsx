import React, { useMemo, useState } from "react";
import { TrendingTokens } from "../types/trendingTokens";

type SortConfig = {
  column: keyof TrendingTokens;
  direction: "ascending" | "descending";
};

export const useSort = (trendingTokens: TrendingTokens[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: "mktCap",
    direction: "descending",
  });

  const sortedItems: TrendingTokens[] = useMemo(() => {
    return [...trendingTokens].sort((a, b) => {
      if (a[sortConfig.column] < b[sortConfig.column]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.column] > b[sortConfig.column]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [trendingTokens, sortConfig]);

  const sortIt = (column: keyof TrendingTokens): void => {
    if (sortConfig.direction === "ascending") {
      setSortConfig({ column, direction: "descending" });
    } else {
      setSortConfig({ column, direction: "ascending" });
    }
  };

  const getClassForSortedColumn = (column: keyof TrendingTokens): string => {
    if (sortConfig.column === column) {
      return sortConfig.direction === "ascending" ? "after:content-['_▲']" : "after:content-['_▼']";
    } else {
      return "";
    }
  };

  return { sortedItems, sortIt, getClassForSortedColumn };
};
