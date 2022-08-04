import { TokenData } from "../types/coingecko/token-data";
import { TrendingTokens } from "../types/trending-tokens";
import { formatNumber } from "../utils";
import { fetchTokenDetailsByCoinGecko, fetchTrendingTokensByCoinGecko } from "./coingecko";

export const getTrendingTokensTableData = async (page: number): Promise<TrendingTokens[]> => {
  const data = await fetchTrendingTokensByCoinGecko(page);

  if (data && data.length) {
    const formattedData = data.map(async (token: TokenData) => {
      const { market_cap_rank, name, symbol, image, market_data } =
        await fetchTokenDetailsByCoinGecko(token.id);

      return {
        id: market_cap_rank,
        route: `/coins/${token.id}`,
        name: name,
        symbol: symbol.toUpperCase(),
        image: image.large,
        price: market_data.current_price.usd,
        priceChange24h: market_data.price_change_percentage_24h,
        priceChange7d: market_data.price_change_percentage_7d,
        volume24h: market_data.total_volume.usd,
        mktCap: market_data.market_cap.usd,
        sparkline: market_data.sparkline_7d.price,
        displayPrice: formatNumber(market_data.current_price.usd),
        displayPriceChange24h: `${market_data.price_change_percentage_24h.toFixed(1)}%`,
        displayPriceChange7d: `${market_data.price_change_percentage_7d.toFixed(1)}%`,
        displayVolume24h: formatNumber(market_data.total_volume.usd, { decimal: false }),
        displayMktCap: formatNumber(market_data.market_cap.usd, { decimal: false }),
      };
    });

    const trendingArray = await Promise.all(formattedData);
    return trendingArray;
  } else {
    return [];
  }
};
