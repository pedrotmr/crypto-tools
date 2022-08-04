import React, { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { formatNumber, setBalanceWithDecimals } from "../utils";
import { WalletBalance } from "../types/wallet-balance";

type WalletContextType = {
  account: string | null;
  network: number | null;
  ENGBalance: Balance | null;
  tokenBalances: WalletBalance[] | null;
  connectWallet: () => Promise<void>;
  switchToEnergiNetwork: () => Promise<void>;
  isOnTheEnergiNetwork: () => boolean;
};

type Balance = {
  balance: string;
  value: string;
};

declare let window: any;

export const WalletContext = React.createContext<WalletContextType>({} as WalletContextType);

export const useWalletContext = () => useContext(WalletContext);

export const WalletProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<number | null>(null);
  const [ENGBalance, setENGBalance] = useState<Balance | null>(null);
  const [tokenBalances, setTokenBalances] = useState<WalletBalance[] | null>(null);

  const energiChainId = 39797;

  useEffect(() => {
    checkIfWalletIsConneceted();
    getNetwork();
  }, []);

  // useEffect(() => {
  //   account && getEnergiTokenBalance(account);
  //   account && fetchAddressInfoByEthplorer(account).then((res) => setTokenBalances(res));
  // }, [account]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", getNetwork);
      window.ethereum.on("accountsChanged", checkIfWalletIsConneceted);
      return () => {
        window.ethereum.removeListener("chainChanged", getNetwork);
        window.ethereum.removeListener("accountsChanged", checkIfWalletIsConneceted);
      };
    }
  }, []);

  const connectWallet = async (): Promise<void> => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      if (network === energiChainId) return;
      switchToEnergiNetwork();
    } catch (error) {
      alert("Please install the Metamask extension");
    }
  };

  const checkIfWalletIsConneceted = async (): Promise<void> => {
    if (!window.ethereum) return;
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts.length) return setAccount(null);
    setAccount(accounts[0]);
  };

  const switchToEnergiNetwork = async () => {
    const hexEnergiChainId = `0x${energiChainId.toString(16)}`;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexEnergiChainId }],
      });
    } catch (error) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexEnergiChainId,
              rpcUrl: "https://nodeapi.energi.network",
            },
          ],
        });
      } catch (error) {
        console.log("Please install the error");
      }
    }
  };

  const getNetwork = async (): Promise<void> => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    setNetwork(network.chainId);
  };

  const isOnTheEnergiNetwork = (): boolean => {
    return network === energiChainId;
  };

  // const getEnergiTokenBalance = async (account: string): Promise<void> => {
  //   if (!account) return;
  //   const ENGTokenAddress = "0x62EE90d75f1BEc074A32160C7Ce3F30b999764Db";
  //   const numOfDecimals = 18;
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   try {
  //     const contractAbiFragment = ["function balanceOf(address owner) view returns (uint)"];
  //     const contract = new ethers.Contract(ENGTokenAddress, contractAbiFragment, signer);
  //     const balance = await contract.balanceOf(account);
  //     const clearBalance = setBalanceWithDecimals(balance, numOfDecimals);

  //     const details = await fetchTokenDetailsByCoinGecko("energi");
  //     const price = details.market_data.current_price;
  //     await Promise.all([balance, details]);
  //     setENGBalance({
  //       balance: clearBalance,
  //       value: formatNumber(price.usd * Number(clearBalance)),
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     setENGBalance({
  //       balance: "0",
  //       value: "$0.00",
  //     });
  //   }
  // };

  return (
    <WalletContext.Provider
      value={{
        account,
        network,
        ENGBalance,
        tokenBalances,
        connectWallet,
        isOnTheEnergiNetwork,
        switchToEnergiNetwork,
      }}>
      {children}
    </WalletContext.Provider>
  );
};
