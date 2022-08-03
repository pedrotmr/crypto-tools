import React, { useState, useContext } from "react";
import { getChartFormattedData, getFormattedTableData } from "../api/apiService";
import { ChartData } from "../types/chartData";
import { TrendingTokens } from "../types/trendingTokens";

type fetchPropType = {
  page: number;
  perPage: number;
};

type TokenContextType = {
  trendingTokens: TrendingTokens[];
  pagination: fetchPropType;
  chartData: ChartData[];
  chartDataIsLoading: boolean;
  getChartData: (id: string, days?: string | number) => Promise<void>;
  getTokenPage: (perPage: number) => void;
  getNextPage: () => void;
  getPreviousPage: () => void;
};

export const TokenContext = React.createContext<TokenContextType>({} as TokenContextType);

export const useTokenContext = () => useContext(TokenContext);

export const TokenProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [trendingTokens, setTrendingTokens] = useState<TrendingTokens[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartDataIsLoading, setChartDataIsLoading] = useState(false);
  const [pagination, setPagionation] = useState<fetchPropType>({ page: 1, perPage: 10 });

  const getTokenPage = async (perPage: number = 10): Promise<void> => {
    const options = { page: 1, perPage };
    const response = await getFormattedTableData(options);
    setTrendingTokens(response);
    setPagionation(options);
  };

  const getNextPage = async (): Promise<void> => {
    const options = { ...pagination, page: pagination.page + 1 };
    const response = await getFormattedTableData(options);
    setTrendingTokens(response);
    setPagionation(options);
  };

  const getPreviousPage = async (): Promise<void> => {
    if (pagination.page === 1) return;
    const options = { ...pagination, page: pagination.page - 1 };
    const response = await getFormattedTableData(options);
    setTrendingTokens(response);
    setPagionation(options);
  };

  const getChartData = async (id: string, days: string | number = "max"): Promise<void> => {
    setChartDataIsLoading(true);
    const response = await getChartFormattedData(id, days);
    setChartData(response);
    setChartDataIsLoading(false);
  };

  return (
    <TokenContext.Provider
      value={{
        trendingTokens,
        pagination,
        chartData,
        chartDataIsLoading,
        getChartData,
        getTokenPage,
        getNextPage,
        getPreviousPage,
      }}>
      {children}
    </TokenContext.Provider>
  );
};
