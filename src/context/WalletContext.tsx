import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import erc20Tokens from "../api/db/transactionTokens.json";
import { fetchTokenInfoByEthplorer } from "../api/ethplorer";
import { TransactionTokens } from "../types/transaction-tokens";
import { setBalanceWithDecimals } from "../utils";

type WalletContextType = {
  account: string | null;
  network: number | null;
  transactionTokens: TransactionTokens[] | null;
  connectWallet: () => Promise<void>;
  switchToMainnet: () => Promise<void>;
  isConnectedToMainnet: () => boolean;
};

declare let window: any;

export const WalletContext = React.createContext<WalletContextType>({} as WalletContextType);

export const useWalletContext = () => useContext(WalletContext);

export const WalletProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<number | null>(null);
  const [transactionTokens, setTransactionTokens] = useState<TransactionTokens[]>([]);

  useEffect(() => {
    checkIfWalletIsConneceted();
    getNetwork();
  }, []);

  useEffect(() => {
    account && ethBalance && getTransactionTokensWithBalance();
  }, [account, ethBalance]);

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
    if (!window.ethereum) {
      toast.error(
        <p className='hover:underline pr-4'>
          <a href='https://metamask.io/' target='_blank'>
            Please click here and Install Metamask
          </a>
        </p>
      );
    } else {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        setEthBalance(await getEthBalance(accounts[0]));
        switchToMainnet();
        toast.success(<span className='pr-4'>Wallet connected successfully</span>);
      } catch (error) {
        toast.error(
          <span className='pr-4'>
            You rejected the request to connect to the Metamask. Please try again.
          </span>
        );
      }
    }
  };

  const checkIfWalletIsConneceted = async (): Promise<void> => {
    if (!window.ethereum) return;
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts.length) return setAccount(null);
    setAccount(accounts[0]);
    setEthBalance(await getEthBalance(accounts[0]));
  };

  const switchToMainnet = async (): Promise<void> => {
    const mainnetChain = "0x1";
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: mainnetChain }],
    });
  };

  const getNetwork = async (): Promise<void> => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    setNetwork(network.chainId);
  };

  const isConnectedToMainnet = (): boolean => {
    return network === 1;
  };

  const getEthBalance = async (userAddress: string | null = account): Promise<string | null> => {
    if (account) return null;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(userAddress as string);
    const convertedBalance = ethers.utils.formatEther(balance);
    return Number(convertedBalance).toFixed(5);
  };

  const getTokenBalance = async (
    tokenAdress: string,
    tokenNumOfDecimals: number,
    userAddress: string | null = account
  ): Promise<string | null> => {
    if (!userAddress) return null;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const contractAbiFragment = ["function balanceOf(address owner) view returns (uint)"];
      const contract = new ethers.Contract(tokenAdress, contractAbiFragment, signer);
      const balance = await contract.balanceOf(userAddress);
      const convertedBalance = setBalanceWithDecimals(balance, tokenNumOfDecimals);
      return Number(convertedBalance) === 0 ? "0" : convertedBalance;
    } catch (error) {
      return null;
    }
  };

  const getTransactionTokensWithBalance = async (): Promise<void> => {
    const formattedData = erc20Tokens.map(async (token) => {
      let balance = await getTokenBalance(token.contractAddress, token.decimals);
      const data = await fetchTokenInfoByEthplorer(token.contractAddress);

      if (token.symbol === "ETH" && ethBalance) {
        balance = ethBalance;
      }

      return {
        ...token,
        balance: balance,
        price: data.price.rate,
      };
    });
    const transactionTokens = await Promise.all(formattedData);
    setTransactionTokens(transactionTokens);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        network,
        transactionTokens,
        connectWallet,
        isConnectedToMainnet,
        switchToMainnet,
      }}>
      {children}
    </WalletContext.Provider>
  );
};
