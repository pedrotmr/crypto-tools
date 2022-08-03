export type TokenDetailsResponse = {
  tokenDetails: TokenDetails | null;
  isLoading: boolean;
  isError: boolean;
};

type TokenDetails = {
  id: number;
  name: string;
  symbol: string;
  image: string;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  volume24: number;
  mktCap: number;
  sparkline: number[];
  displayPrice: string;
  displayPriceChange24h: string;
  displayPriceChange7d: string;
  displayVolume24: string;
  displayMktCap: string;
};
