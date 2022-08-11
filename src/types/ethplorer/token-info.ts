export type EthplorerTokenResponse = {
  address: string;
  name: string;
  decimals: string;
  symbol: string;
  totalSupply: string;
  owner: string;
  txsCount: number;
  transfersCount: number;
  lastUpdated: number;
  issuancesCount: number;
  holdersCount: number;
  website: string;
  image: string;
  ethTransfersCount: number;
  price: Price;
  publicTags: string[];
  countOps: number;
};

type Price = {
  rate: number;
  diff: number;
  diff7d: number;
  ts: number;
  marketCapUsd: number;
  availableSupply: number;
  volume24h: number;
  volDiff1: number;
  volDiff7: number;
  volDiff30: number;
  diff30d: number;
  bid: number;
  currency: string;
};
