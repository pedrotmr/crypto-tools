export type EthplorerAddressResponse = {
  address: string;
  ETH: Eth;
  countTxs: number;
  tokens: Token[];
};

type Eth = {
  price: PriceClass;
  balance: number;
  rawBalance: string;
};

type Token = {
  tokenInfo: TokenInfo;
  balance: number;
  totalIn: number;
  totalOut: number;
  rawBalance: string;
};

type TokenInfo = {
  address: string;
  name: string;
  owner: string;
  symbol: string;
  totalSupply: string;
  lastUpdated: number;
  issuancesCount: number;
  holdersCount: number;
  ethTransfersCount: number;
  decimals: string;
  price: PriceClass;
  image?: string;
  website?: string;
  publicTags?: string[];
  description?: string;
};

type PriceClass = {
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
  bid?: number;
  currency?: string;
};
