import React from "react";
import WalletBalance from "../components/Wallet/WalletBalance";
import WalletConnect from "../components/Wallet/WalletConnect";
import { useWalletContext } from "../context/WalletContext";

const Wallet: React.FC = () => {
  const { account } = useWalletContext();

  if (!account) {
    return <WalletConnect />;
  }

  return <WalletBalance />;
};

export default Wallet;
