import { EthplorerAddressResponse } from "../../types/ethplorer/adress-info";
import { EthplorerTokenResponse } from "../../types/ethplorer/token-info";

export const fetchAddressInfoByEthplorer = async (
  address: string
): Promise<EthplorerAddressResponse> => {
  const url = `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=EK-pnZpY-Z88j91b-NoYmS`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};

export const fetchTokenInfoByEthplorer = async (
  address: string
): Promise<EthplorerTokenResponse> => {
  const url = `https://api.ethplorer.io/getTokenInfo/${address}?apiKey=EK-pnZpY-Z88j91b-NoYmS`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};
