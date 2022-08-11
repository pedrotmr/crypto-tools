import React from "react";
import { AiOutlineDown } from "react-icons/ai";
import { useWalletContext } from "../../context/WalletContext";
import { TransactionTokens } from "../../types/transaction-tokens";

type InputProps = {
  value: string;
  name: string;
  amount?: boolean;
  address?: boolean;
  errorMessage: string;
  selectedToken?: TransactionTokens;
  selectedTokenFrom?: TransactionTokens;
  selectedTokenTo?: TransactionTokens;
  setMaxValue?: () => void;
  openSelectTokenModal?: () => void;
  openSelectTokenSecondModal?: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
  const value = e.clipboardData.getData("text");
  const regex = /[^0-9.,]/g;
  if (regex.test(value)) {
    e.preventDefault();
  }
};

const allowOnlyDigits = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  const key = e.key;
  const regex = /[^0-9.]/g;

  if (regex.test(key)) {
    e.preventDefault();
  }
};

const Input: React.FC<InputProps> = ({
  value,
  amount,
  name,
  address,
  errorMessage,
  selectedToken,
  selectedTokenFrom,
  selectedTokenTo,
  setMaxValue,
  openSelectTokenModal,
  handleChange,
}) => {
  const { account } = useWalletContext();

  const topInputToken = selectedToken || selectedTokenFrom;

  return (
    <div className='p-5 bg-gray-100 dark:bg-gray-800 relative my-3 rounded-2xl text-3xl flex justify-between'>
      {address && (
        <input
          className='bg-transparent text-gray-500 outline-none mb-6 w-full text-2xl'
          type='text'
          name={name}
          placeholder='0x...'
          value={value}
          onChange={handleChange}
        />
      )}
      {amount && (
        <>
          <input
            className='bg-transparent text-gray-500 outline-none mb-6 w-full text-2xl'
            type='text'
            name={name}
            placeholder='0.0'
            value={value}
            onChange={handleChange}
            onPaste={handlePaste}
            onKeyPress={allowOnlyDigits}
            autoComplete='off'
          />
          {account &&
            topInputToken &&
            renderDropDown(topInputToken, openSelectTokenModal, setMaxValue)}

          {account && !topInputToken && !selectedTokenTo && (
            <div className='flex items-center'>
              <div className='flex relative w-max h-min justify-between items-center bg-gray-300 dark:bg-[#234169] rounded-2xl text-xl font-medium cursor-pointer p-2 px-3'>
                <button
                  className='flex items-center jusitfy-center gap-2 rounded-full text-base'
                  onClick={openSelectTokenModal}>
                  <div className='w-max'>Select a token</div>
                  <AiOutlineDown className='text-md' />
                </button>
              </div>
            </div>
          )}

          {account && selectedTokenTo && renderDropDown(selectedTokenTo, openSelectTokenModal)}
        </>
      )}
      {errorMessage && renderErrorMessage(errorMessage)}
    </div>
  );
};

const renderErrorMessage = (errorMessage: string) => {
  return <div className='absolute bottom-4 left-6 text-sm text-red-400'>{errorMessage}</div>;
};

const renderDropDown = (
  token: TransactionTokens,
  openModal?: () => void,
  setMaxValue?: () => void
) => {
  return (
    <div className='flex relative w-max h-min justify-between gap-2 items-center bg-gray-300 dark:bg-[#234169] rounded-2xl text-xl font-medium cursor-pointer p-2 px-3 -mt-1 '>
      <button className='flex items-center gap-2 rounded-full text-base' onClick={openModal}>
        <div>
          <img src={token.logo} alt={`${token.symbol}-logo`} height={35} width={35} />
        </div>
        <span>{token.symbol}</span>
        <AiOutlineDown className='text-2xl' />
      </button>

      <div className='text-sm flex absolute w-max -bottom-8 right-0 text-[#585d6a]'>
        Balance: {token.balance}
        {setMaxValue && (
          <div
            className='ml-2 px-2 bg-sky-200 dark:bg-[#172A42] border border-sky-400 hover:border-sky-500 dark:border-[#163256] dark:hover:border-[#234169] rounded-2xl cursor-pointer text-[11px] text-[#4F90EA]'
            onClick={setMaxValue}>
            MAX
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
