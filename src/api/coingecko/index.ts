import { TokenMarketData } from "../../types/coingecko/token-market-data";
import { TokenData } from "../../types/coingecko/token-data";

export const fetchTrendingTokensByCoinGecko = async (page: number = 1): Promise<TokenData[]> => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=${page}`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};

export const fetchTokenDetailsByCoinGecko = async (id: string): Promise<TokenMarketData> => {
  const url = `https://api.coingecko.com/api/v3/coins/${id}?sparkline=true`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};

export const fetchChartDataByCoinGecko = async (id: string): Promise<number[][]> => {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=max`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};
