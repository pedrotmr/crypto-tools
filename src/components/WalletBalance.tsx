import React, { useState } from "react";
import useSWR from "swr";
import { getAddressInfo } from "../api/getAddressInfo";
import EthereumLogo from "../assets/svg/ethereum";
import MetamaskLogo from "../assets/svg/metamask";
import { useWalletContext } from "../context/WalletContext";
import { formatNumber } from "../utils";

const sharedStyles = {
  headItem: "py-3 px-6",
  bodyItem: "py-4 px-6",
};

const WalletBalance: React.FC = () => {
  const { account, isConnectedToMainnet, switchToMainnet, ENGBalance, tokenBalances } =
    useWalletContext();

  const [tooltipText, setTooltipText] = useState("Copy to clipboard");

  if (!account) return null;

  const { data } = useSWR(account, getAddressInfo);

  const totalBalance = data && data.reduce((acc, curr) => acc + curr.value, 0);

  const handleCopy = (account: string) => {
    navigator.clipboard.writeText(account);
    setTooltipText("Copied!");
    setTimeout(() => {
      setTooltipText("Copy to clipboard");
    }, 1000);
  };

  return (
    <div className='p-4 mt-10 rounded-lg w-full md:w-3/4 mx-auto flex flex-col bg-slate-200 dark:bg-gray-800'>
      <div className='flex p-2 dark:border-gray-700 border-b justify-between'>
        <div className='flex items-center gap-3'>
          <EthereumLogo className='grayscale' width={18} height={18} />
          <span>Ethereum Network</span>
        </div>
        <div className='flex text-sm'>
          {isConnectedToMainnet() ? (
            <p className='text-green-600'>● Connected</p>
          ) : (
            <button
              className='text-white bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg px-3 py-1'
              onClick={() => switchToMainnet()}>
              ⊗ Wrong network
            </button>
          )}
        </div>
      </div>
      <div className='flex p-2 mt-4 justify-between '>
        <span className='flex gap-2 text-sm items-center text-gray-500 dark:text-gray-400'>
          <MetamaskLogo width={25} height={25} />
          {`${account.slice(0, 6)}...${account.slice(-8)}`}
        </span>
        <button onClick={() => handleCopy(account)} className='relative inline-block group'>
          <span className='bg-gray-300 dark:bg-gray-700 flex justify-center items-center rounded-full w-6 h-6'>
            ❏
          </span>
          <span className='hidden group-hover:flex text-black absolute w-max bg-gray-300 py-1 px-3 text-sm z-10 top-full right-1 -ml-12 rounded-lg'>
            {tooltipText}
          </span>
        </button>
      </div>

      <div className='flex flex-col justify-center items-center mt-8 mb-8'>
        <div className='flex text-lg'>Total Balance</div>
        <strong className='mt-2'>{totalBalance && formatNumber(totalBalance)}</strong>
      </div>

      {!data && <div>Loading...</div>}

      {data && data.length > 0 && (
        <div className='rounded-xl w-full md:w-3/4 mx-auto overflow-x-auto mt-4 mb-8'>
          <table className='w-full px-4 text-sm text-left text-gray-500 dark:text-gray-200'>
            <thead className='text-xs text-gray-700 dark:text-gray-50 bg-slate-300 dark:bg-gray-700'>
              <tr>
                <th className='py-3 px-6'>Coin</th>
                <th className='py-3 px-6'>Balance</th>
                <th className='py-3 px-6'>Value</th>
              </tr>
            </thead>

            <tbody className='bg-slate-100 dark:text-gray-400 dark:bg-gray-900 dark:border-gray-700'>
              {data.map((token, index) => (
                <tr key={index}>
                  <td className={sharedStyles.bodyItem}>
                    <span className='flex items-center gap-2'>
                      <img src={token.image} alt={`${token.name}-logo`} width={25} height={25} />
                      <span>{token.name}</span>
                    </span>
                  </td>
                  <td className={sharedStyles.bodyItem}>{token.balance}</td>
                  <td className={sharedStyles.bodyItem}>{token.displayValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
