import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useWalletContext } from "../context/WalletContext";
import { FiArrowUpRight } from "react-icons/fi";
import { Player } from "@lottiefiles/react-lottie-player";
import { TransactionInfo } from "../types/transaction-info";

type LoadingModalProps = {
  isLoading: boolean;
  transactionInfo: TransactionInfo;
};

const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading, transactionInfo }) => {
  const [loadingMessage, setLoadingMessage] = useState("");

  const { network } = useWalletContext();

  useEffect(() => {
    setLoadingMessage("Your transaction is being processed...");
    setTimeout(() => {
      setLoadingMessage("It seems your transaction is taking longer than usual...");
    }, 20000);
  }, []);

  const style = {
    wrapper:
      "text-white flex flex-col gap-6 justify-center items-center h-full p-6 py-20 text-center",
  };

  const openEtherscan = (hash: string) => {
    let url;
    if (network === 1) url = `https://etherscan.io/tx/${hash}`;
    return window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className={style.wrapper}>
        <ClipLoader color={"#701a75"} size={150} />
        <p className='text-lg mt-8'>{loadingMessage}</p>
      </div>
    );
  }

  if (transactionInfo?.type === "send" && transactionInfo.txHash) {
    return (
      <div className={style.wrapper}>
        <Player
          autoplay
          keepLastFrame
          speed={0.7}
          src='https://assets3.lottiefiles.com/packages/lf20_lk80fpsm.json'
          style={{ height: "150px", width: "150px" }}></Player>
        <p className='text-lg mt-2'>Transaction Complete</p>
        <p>
          You just sent
          <span className='mx-2 text-[#f48706] font-bold'>
            {Number(transactionInfo?.amount).toLocaleString()} {transactionInfo?.token}
          </span>
          to
          <span className='mx-2 text-[#f48706]'>{transactionInfo.recipient.slice(0, 8)}...</span>
        </p>
        <div
          onClick={() => openEtherscan(transactionInfo.txHash)}
          className='flex text-blue-500 hover:underline gap-1 cursor-pointer'>
          View on Etherscan
          <FiArrowUpRight />
        </div>
      </div>
    );
  } else return null;
};

export default LoadingModal;
