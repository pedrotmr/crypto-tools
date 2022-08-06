import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { useWalletContext } from "../context/WalletContext";
import { TransactionTokens } from "../types/transaction-tokens";

type TokenListModalProps = {
  closeModal: () => void;
  selectToken: (token: TransactionTokens) => void;
};

const TokenListModal: React.FC<TokenListModalProps> = ({ closeModal, selectToken }) => {
  const { transactionTokens } = useWalletContext();

  const handleTokenClick = (token: TransactionTokens) => {
    selectToken(token);
    closeModal();
  };

  return (
    <div className='flex flex-col text-white h-[70vh] overflow-hidden'>
      <div className='border-b-[0.1px] border-grey'>
        <div className='flex justify-between text-lg items-center p-4 w-full'>
          <div>Select a token</div>
          <RiCloseFill className='cursor-pointer text-3xl' onClick={closeModal} />
        </div>
      </div>
      <div className='overflow-auto'>
        {transactionTokens?.map((token, idx) => (
          <div key={idx} onClick={() => handleTokenClick(token)} className='first:mt-3 last:mb-3'>
            <div className='flex items-center cursor-pointer hover:bg-gray-700 transition-all duration-800 h-14 my-1'>
              <div className='flex w-full px-5 items-center justify-between'>
                <div className='flex'>
                  <div className='flex items-center'>
                    <img src={token.logo} alt={`${token.name}-logo`} height={30} width={30} />
                  </div>
                  {/* <div className='flex ml-4 items-center gap-2'>
                  <div>{token.symbol}</div>
                  <span className='text-[#aaaaa3]'>-</span>
                  <div className='text-[#aaaaa3] text-sm'>{token.name}</div>
                </div> */}
                  <div className='flex flex-col ml-4 leading-5'>
                    <span>{token.symbol}</span>
                    <span className='text-xs text-[#aaaaa3]'>{token.name}</span>
                  </div>
                </div>
                <div>{token.balance}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenListModal;
