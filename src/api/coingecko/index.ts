import { TokenData } from "../../types/coingecko/token-data";
import { TokenMarketData } from "../../types/coingecko/token-market-data";

const fetchWithRetry = async (url: string, retries: number = 3, backoff: number = 3000): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        await new Promise((res) => setTimeout(res, backoff));
        return fetchWithRetry(url, retries - 1, backoff * 2);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, backoff));
      return fetchWithRetry(url, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const fetchTrendingTokensByCoinGecko = async (page: number = 1): Promise<TokenData[]> => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=${page}`;
  const data = await fetchWithRetry(url);
  return data;
};

export const fetchTokenDetailsByCoinGecko = async (id: string): Promise<TokenMarketData> => {
  const url = `https://api.coingecko.com/api/v3/coins/${id}?sparkline=true`;
  const data = await fetchWithRetry(url);
  return data;
};

export const fetchChartDataByCoinGecko = async (id: string): Promise<number[][]> => {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=10`;
  const data = await fetchWithRetry(url);
  return data;
};
