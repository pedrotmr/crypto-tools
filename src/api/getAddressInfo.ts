import { WalletBalance } from "../types/wallet-balance";
import { formatNumber, setBalanceWithDecimals } from "../utils";
import { fetchTokenDetailsByCoinGecko } from "./coingecko";
import { fetchAddressInfoByEthplorer } from "./ethplorer";

export const getAddressInfo = async (address: string): Promise<WalletBalance[]> => {
  const data = await fetchAddressInfoByEthplorer(address);

  let formattedData: WalletBalance[] = [];

  const ETHDetails = await fetchTokenDetailsByCoinGecko("ethereum");
  const ETHBalance = [
    {
      name: "Ether",
      symbol: "ETH",
      image: "https://i.ibb.co/41jz9cZ/eth.png",
      balance: data["ETH"].balance.toFixed(6),
      value: data["ETH"].balance * ETHDetails.market_data.current_price.usd,
      displayValue: formatNumber(data["ETH"].balance * ETHDetails.market_data.current_price.usd),
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
          value:
            Number(setBalanceWithDecimals(token.balance, Number(token.tokenInfo.decimals))) *
            token.tokenInfo.price.rate,
          displayValue: formatNumber(
            Number(setBalanceWithDecimals(token.balance, Number(token.tokenInfo.decimals))) *
              token.tokenInfo.price.rate
          ),
        };
      });

    const balanceResponse = await Promise.all(tokenBalances);
    formattedData = [...ETHBalance, ...balanceResponse];
    return formattedData;
  } else {
    return ETHBalance;
  }
};
