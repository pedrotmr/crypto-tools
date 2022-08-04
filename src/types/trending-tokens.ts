export type TrendingTokens = {
  id: number;
  route: string
  symbol: string;
  name: string;
  image: string;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  volume24h: number;
  mktCap: number;
  sparkline: number[];
  displayPrice: string;
  displayPriceChange24h: string;
  displayPriceChange7d: string;
  displayVolume24h: string;
  displayMktCap: string;
};
