import { useState } from "react";
import useSWR from "swr";
import { fetchTokenDetailsByCoinGecko } from "../api/coingecko/fetchTokenDetails";
import { TokenDetailsResponse } from "../types/TokenDetails";
import { formatNumber } from "../utils";

export const useGetTokenDetails = (id: string): TokenDetailsResponse => {
  const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useSWR(id, fetchTokenDetailsByCoinGecko);

  if (!data) {
    return {
      tokenDetails: null,
      isLoading: false,
      isError: true,
    };
  }

  const tokenDetails = {
    id: data.market_cap_rank,
    name: data.name,
    symbol: data.symbol.toUpperCase(),
    image: data.image.large,
    price: data.market_data.current_price.usd,
    priceChange24h: data.market_data.price_change_percentage_24h,
    priceChange7d: data.market_data.price_change_percentage_7d,
    volume24: data.market_data.total_volume.usd,
    mktCap: data.market_data.market_cap.usd,
    sparkline: data.market_data.sparkline_7d.price,
    displayPrice: formatNumber(data.market_data.current_price.usd),
    displayPriceChange24h: formatNumber(data.market_data.price_change_percentage_24h),
    displayPriceChange7d: formatNumber(data.market_data.price_change_percentage_7d),
    displayVolume24: formatNumber(data.market_data.total_volume.usd, { decimal: false }),
    displayMktCap: formatNumber(data.market_data.market_cap.usd, { decimal: false }),
  };
  setIsLoading(false);

  return {
    tokenDetails,
    isLoading,
    isError: !!error,
  };
};
