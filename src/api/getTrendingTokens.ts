import { formatNumber } from "../utils";
import { fetchTrendingTokensByCoinGecko } from "./coingecko";

export const getTrendingTokensTableData = async (page: number): Promise<any[]> => {
  const data = await fetchTrendingTokensByCoinGecko(page);
  console.log("data", data);

  if (data && data.length) {
    const formattedData = data.map((token) => ({
      id: token.market_cap_rank,
      route: `/coins/${token.id}`,
      name: token.name,
      symbol: token.symbol.toUpperCase(),
      image: token.image,
      price: token.current_price,
      priceChange24h: token.price_change_24h,
      priceChangePercentage24h: `${token.price_change_percentage_24h.toFixed(1)}%`,
      volume24h: token.total_volume,
      mktCap: token.market_cap,
      high24h: token.high_24h,
      low24h: token.low_24h,
      ath: token.ath,
      athChangePercentage: `${token.ath_change_percentage.toFixed(1)}%`,
      atl: token.atl,
      atlChangePercentage: `${token.atl_change_percentage.toFixed(1)}%`,
      lastUpdated: token.last_updated,
      displayPrice: formatNumber(token.current_price),
      displayPriceChange24h: `${token.price_change_percentage_24h.toFixed(1)}%`,
      displayVolume24h: formatNumber(token.total_volume, { decimal: false }),
      displayMktCap: formatNumber(token.market_cap, { decimal: false }),
    }));

    // const formattedData = await Promise.all(
    //   data.map(async (token: any) => {
    //     const { market_cap_rank, name, symbol, image, market_data } =
    //       await fetchTokenDetailsByCoinGecko(token.id);

    //     return {
    //       id: market_cap_rank,
    //       route: `/coins/${token.id}`,
    //       name: name,
    //       symbol: symbol.toUpperCase(),
    //       image: image.large,
    //       price: market_data.current_price.usd,
    //       priceChange24h: market_data.price_change_percentage_24h,
    //       priceChange7d: market_data.price_change_percentage_7d,
    //       volume24h: market_data.total_volume.usd,
    //       mktCap: market_data.market_cap.usd,
    //       sparkline: market_data.sparkline_7d.price,
    //       displayPrice: formatNumber(market_data.current_price.usd),
    //       displayPriceChange24h: `${market_data.price_change_percentage_24h.toFixed(1)}%`,
    //       displayPriceChange7d: `${market_data.price_change_percentage_7d.toFixed(1)}%`,
    //       displayVolume24h: formatNumber(market_data.total_volume.usd, { decimal: false }),
    //       displayMktCap: formatNumber(market_data.market_cap.usd, { decimal: false }),
    //     };
    //   })
    // );

    console.log("formattedData", formattedData);

    return formattedData;
  } else {
    return [];
  }
};
