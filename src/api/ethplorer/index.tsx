import { EthplorerAddressResponse } from "../../types/ethplorer/adress-info";

export const fetchAddressInfoByEthplorer = async (address: string): Promise<EthplorerAddressResponse> => {
  const url = `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=EK-pnZpY-Z88j91b-NoYmS`;
  const response = await fetch(url);
  const data = response.json();
  return data;
};
