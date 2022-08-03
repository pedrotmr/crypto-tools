import { CoinMetadata } from "../../types/coingecko/CoinMetadata";

export const fetchTrendingTokensByCoinGecko = async (page: number): Promise<CoinMetadata[]> => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=${page}`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};
