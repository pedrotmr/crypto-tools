import { CoinMarketDetails } from "../../types/coingecko/CoinMarketDetails";

export const fetchTokenDetailsByCoinGecko = async (id: string): Promise<CoinMarketDetails> => {
  const url = `https://api.coingecko.com/api/v3/coins/${id}?sparkline=true`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};
