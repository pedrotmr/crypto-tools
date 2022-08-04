import React from "react";
import MetamaskLogo from "../assets/metamask-icon";
import { useWalletContext } from "../context/WalletContext";

const WalletConnect: React.FC = () => {
  const { connectWallet } = useWalletContext();

  return (
    <div className='flex flex-col justify-center items-center mt-12'>
      <MetamaskLogo width={180} height={180} />
      <h2 className='text-5xl tracking-widest '>METAMASK</h2>
      <button
        onClick={() => connectWallet()}
        className='py-2 px-4 mt-14 bg-[#00aa58]  dark:hover:bg-green-700 hover:bg-green-600 rounded-lg text-white hover:scale-105 transition duration-3000 ease-in-out active:scale-100 '>
        Connect Wallet
      </button>
    </div>
  );
};

export default WalletConnect;
