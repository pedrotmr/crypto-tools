import { CoinMarketDetails } from "../types/coingecko/CoinMarketDetails";
import { CoinMetadata } from "../types/coingecko/CoinMetadata";
import { TrendingTokens } from "../types/trendingTokens";
import { formatDate, formatNumber, setBalanceWithDecimals, _fetch } from "../utils";
import { ChartData } from "../types/chartData";
import { EthplorerAddressResponse } from "../types/ethplorerReponse";
import { WalletBalance } from "../types/walletBalance";

export type fetchPropType = {
  page: number;
  perPage: number;
};

const fetchTrendingTokenByCoinGecko = async ({
  page = 1,
  perPage = 10,
}: fetchPropType): Promise<CoinMetadata[]> => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=${perPage}&page=${page}`;
  const data = await _fetch(url);
  return data;
};

export const fetchTokenDetailsByCoinGecko = async (id: string): Promise<CoinMarketDetails> => {
  const url = `https://api.coingecko.com/api/v3/coins/${id}?sparkline=true`;
  const data = await _fetch(url);
  return data;
};

const fetchChartDataByCoinGecko = async (
  id: string,
  days: string | number
): Promise<number[][]> => {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${days}`;
  const data = await _fetch(url);
  return data;
};

export const fetchAddressInfoByEthplorer = async (address: string): Promise<WalletBalance[]> => {
  const url = `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=EK-pnZpY-Z88j91b-NoYmS`;
  const data: EthplorerAddressResponse = await _fetch(url);
  let formattedData: WalletBalance[] = [];

  const ETHDetails = await fetchTokenDetailsByCoinGecko("ethereum");
  const ETHBalance = [
    {
      name: "Ethereum",
      symbol: "ETH",
      image: "https://i.ibb.co/41jz9cZ/eth.png",
      balance: data["ETH"].balance.toFixed(2),
      value: formatNumber(data["ETH"].balance * ETHDetails.market_data.current_price.usd),
    },
  ];
  if (data.tokens?.length) {
    const tokenBalances = data.tokens
      .filter((token) => token.tokenInfo.image)
      .map(async (token) => {
        const tokenDetails = await fetchTokenDetailsByCoinGecko(token.tokenInfo.name.toLowerCase());
        return {
          name: token.tokenInfo.name,
          symbol: token.tokenInfo.symbol,
          image: tokenDetails.image.large,
          balance: setBalanceWithDecimals(token.balance, Number(token.tokenInfo.decimals)),
          value: formatNumber(
            Number(setBalanceWithDecimals(token.balance, Number(token.tokenInfo.decimals))) *
              token.tokenInfo.price.rate
          ),
        };
      });
    const balanceResponse = await Promise.all(tokenBalances);
    formattedData = [...ETHBalance, ...balanceResponse];
    return formattedData;
  } else {
    return Number(ETHBalance[0].balance) > 0 ? ETHBalance : [];
  }
};

export const getFormattedTableData = async ({
  page = 1,
  perPage = 10,
}: fetchPropType): Promise<TrendingTokens[]> => {
  const data = await fetchTrendingTokenByCoinGecko({ page, perPage });
  let trendingArray: TrendingTokens[] = [];
  if (data && data.length) {
    const formattedData = data.map(async (token: CoinMetadata, index: number) => {
      const sparkline = await fetchTokenDetailsByCoinGecko(token.id);
      return {
        id: page * perPage - (perPage - 1) + index,
        symbol: token.symbol.toUpperCase(),
        name: token.name,
        logo: token.image,
        price: token.current_price,
        volume24h: token.total_volume,
        mktCap: token.market_cap,
        idx: token.id,
        displayPrice: formatNumber(token.current_price),
        displayVolume24h: formatNumber(token.total_volume, { decimal: false }),
        displayMktCap: formatNumber(token.market_cap, { decimal: false }),
        sparkline: sparkline.market_data.sparkline_7d.price,
      };
    });
    trendingArray = await Promise.all(formattedData);
    return trendingArray;
  } else {
    return [];
  }
};

export const getChartFormattedData = async (
  id: string,
  days: string | number = "max"
): Promise<ChartData[]> => {
  const data = await fetchChartDataByCoinGecko(id, days);
  if (data && data.length) {
    const formattedData = data.map((token: number[]) => {
      return {
        time: formatDate(token[0]),
        open: token[1],
        high: token[2],
        low: token[3],
        close: token[4],
      };
    });
    return formattedData;
  } else {
    return [];
  }
};
