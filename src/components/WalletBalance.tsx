import React, { useState } from "react";
import { useWalletContext } from "../context/WalletContext";

const sharedStyles = {
  headItem: "py-3 px-6",
  bodyItem: "py-4 px-6",
};

const WalletBalance: React.FC = () => {
  const { account, isOnTheEnergiNetwork, switchToEnergiNetwork, ENGBalance, tokenBalances } =
    useWalletContext();
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");

  if (!account) return null;

  const handleCopy = (account: string) => {
    navigator.clipboard.writeText(account);
    setTooltipText("Copied!");
    setTimeout(() => {
      setTooltipText("Copy to clipboard");
    }, 2000);
  };

  return (
    <div className='p-4 mt-10 rounded-lg w-full md:w-3/4 mx-auto flex flex-col bg-slate-200 dark:bg-gray-800'>
      <div className='flex p-2 dark:border-gray-700 border-b justify-between'>
        <div className='flex items-center gap-3'>
          <img
            src='https://app.energiswap.exchange/favicon.png'
            className='grayscale'
            width={18}
            height={18}
          />
          Energi Network
        </div>
        <div className='flex text-sm'>
          {isOnTheEnergiNetwork() ? (
            <p className='text-green-600'>● Connected</p>
          ) : (
            <button
              className='text-white bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg px-3 py-1'
              onClick={() => switchToEnergiNetwork()}>
              ⊗ Wrong network
            </button>
          )}
        </div>
      </div>
      <div className='flex p-2 mt-4 justify-between '>
        <span className='flex gap-2 text-sm items-center text-gray-500 dark:text-gray-400'>
          <img src='./assets/metamask.svg' alt='metamask logo' width={25} height={25} />
          {`${account.slice(0, 6)}...${account.slice(-8)}`}
        </span>
        <button onClick={() => handleCopy(account)} className='relative inline-block group'>
          <span className='bg-gray-300 dark:bg-gray-700 flex justify-center items-center rounded-full w-6 h-6'>
            ❏
          </span>
          <span className='invisible group-hover:visible text-black absolute w-max bg-gray-300 py-1 px-3 text-sm z-10 top-full left-1/2 -ml-12 rounded-lg'>
            {tooltipText}
          </span>
        </button>
      </div>

      <div className='flex flex-col justify-center items-center mt-8 mb-8'>
        <div className='flex text-lg'>Total Balance</div>
        <div className='flex items-center justify-between gap-8 mt-5'>
          <span className='flex gap-3'>
            <img src='https://app.energiswap.exchange/favicon.png' width={25} height={35} />
            {ENGBalance?.balance}
          </span>
          {ENGBalance?.value}
        </div>
      </div>

      {tokenBalances && tokenBalances.length > 0 && (
        <div className='rounded-xl w-full md:w-3/4  mx-auto overflow-x-auto mt-4 mb-8'>
          <table className='w-full px-4 text-sm text-left text-gray-500 dark:text-gray-200'>
            <thead className='text-xs text-gray-700 dark:text-gray-50 bg-slate-300 dark:bg-gray-700'>
              <tr>
                <th className='py-3 px-6'>Coin</th>
                <th className='py-3 px-6'>Symbol</th>
                <th className='py-3 px-6'>Balance</th>
                <th className='py-3 px-6'>Value</th>
              </tr>
            </thead>

            <tbody className='bg-slate-100 dark:text-gray-400 dark:bg-gray-900 dark:border-gray-700'>
              {tokenBalances.map((token, index) => (
                <tr key={index}>
                  <td className={sharedStyles.bodyItem}>
                    <span className='flex items-center gap-2'>
                      <img src={token.image} alt={`${token.name}-logo`} width={25} height={25} />
                      <span>{token.name}</span>
                    </span>
                  </td>
                  <td className={sharedStyles.bodyItem}>{token.symbol}</td>
                  <td className={sharedStyles.bodyItem}>{token.balance}</td>
                  <td className={sharedStyles.bodyItem}>{token.value}</td>
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
