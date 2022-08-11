import React from "react";
import { useWalletContext } from "../../context/WalletContext";

type TransactionButtonProps = {
  type: "send" | "swap";
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const TransactionButton: React.FC<TransactionButtonProps> = ({ type, handleSubmit }) => {
  const { account, connectWallet, isConnectedToMainnet, switchToMainnet } = useWalletContext();

  const style = {
    mainButton:
      "w-full my-2 py-5 px-8 text-xl font-semibold flex items-center justify-center rounded-2xl outline-none focus:outline-none transition ease-out duration-300 border",
  };

  return (
    <>
      {!account && (
        <button
          onClick={connectWallet}
          className={`${style.mainButton} text-gray-100 bg-[#ea6262cd] hover:bg-[#ea6262eb] hover:border-[#ff497d] dark:text-[#ea4f4f] dark:bg-[#4c1a1a] dark:hover:bg-[#471515] dark:border-[#561630] dark:hover:border-[#692341]`}>
          <span>Connect Wallet</span>
        </button>
      )}
      {account && !isConnectedToMainnet() && (
        <button
          onClick={switchToMainnet}
          className={`${style.mainButton} text-gray-100 bg-[#ea6262cd] hover:bg-[#ea6262eb] hover:border-[#ff497d] dark:text-[#ea4f4f] dark:bg-[#4c1a1a] dark:hover:bg-[#471515] dark:border-[#561630] dark:hover:border-[#692341]`}>
          <span>Wrong Network</span>
        </button>
      )}
      {account && isConnectedToMainnet() && (
        <button
          onClick={handleSubmit}
          className={`${style.mainButton} text-gray-100 bg-[#627deacd] hover:bg-[#627deaeb] hover:border-[#49a1ff] dark:text-[#4F90EA] dark:bg-[#172A42] dark:hover:bg-[#152b47] dark:border-[#163256] dark:hover:border-[#234169]`}>
          <span>{type === "send" ? 'Send' : 'Swap'}</span>
        </button>
      )}
    </>
  );
};

export default TransactionButton;
