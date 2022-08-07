import React, { useState, useEffect } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { Contract, ethers } from "ethers";
import { useWalletContext } from "../context/WalletContext";
import ReactModal from "react-modal";
import TokenListModal from "../components/TokenListModal";
import { TransactionTokens } from "../types/transaction-tokens";
import LoadingModal from "../components/LoadingModal";
import { TransactionInfo } from "../types/transaction-info";
import { toast } from "react-toastify";

declare let window: any;

const Send = () => {
  const [formData, setFormData] = useState({ recipient: "", amount: "" });
  const [errorMessage, setErrorMessage] = useState({ recipient: "", amount: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [tokenListModalOpen, setTokenListModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TransactionTokens>();

  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo>({
    recipient: "",
    amount: "",
    token: "",
    txHash: "",
    type: "send",
  });

  const { account, connectWallet, transactionTokens, isConnectedToMainnet, switchToMainnet } =
    useWalletContext();

  useEffect(() => {
    transactionTokens && setSelectedToken(transactionTokens[0]);
  }, [transactionTokens]);

  const transactionStart = async (
    transaction: ethers.providers.TransactionResponse,
    recipient: string,
    convertedAmount: string,
    tokenSymbol = "ETH"
  ) => {
    setIsLoading(true);
    setLoadingModalOpen(true);
    await transaction.wait();
    setTransactionInfo({
      ...transactionInfo,
      txHash: transaction.hash,
      recipient: recipient,
      amount: convertedAmount,
      token: tokenSymbol,
    });
    setIsLoading(false);
    setFormData({ recipient: "", amount: "" });
  };

  const sendToken = async (
    token: TransactionTokens | undefined,
    recipient: string,
    amount: string
  ): Promise<void> => {
    if (!token) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      if (token === transactionTokens?.[0]) {
        const transaction = await signer.sendTransaction({
          to: recipient,
          value: ethers.utils.parseEther(amount),
        });
        transactionStart(transaction, recipient, amount);
      } else {
        const contractAbiFragment = ["function transfer(address, uint256)"];
        const contract = new Contract(token.contractAddress, contractAbiFragment, signer);
        const numberOfTokens = ethers.utils.parseUnits(amount, token.decimals);
        const transaction = await contract.transfer(recipient, numberOfTokens);
        transactionStart(transaction, recipient, amount);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(<span className='pr-5'>{error.message}</span>);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleError = (inputField: "amount" | "recipient", message: string) => {
    setErrorMessage({ ...errorMessage, [inputField]: message });
    return setTimeout(() => {
      setErrorMessage({ ...errorMessage, [inputField]: "" });
    }, 5000);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { recipient, amount } = formData;

    if (!amount) {
      return handleError("amount", "Amount is required");
    }
    if (!recipient) {
      return handleError("recipient", "Address is required");
    }
    if (recipient === account) {
      return handleError("recipient", "Address is the same as current user");
    }
    if (!ethers.utils.isAddress(recipient)) {
      return handleError("recipient", "Invalid address");
    }
    if (Number(amount) > Number(selectedToken?.balance)) {
      return handleError("amount", "Insufficient funds");
    }
    sendToken(selectedToken, recipient, amount);
  };

  return (
    <div className='flex items-center justify-center pt-10'>
      <div className='bg-gray-200 dark:bg-gray-700 w-[480px] lg:min-w-[480px] lg:w-2/5 rounded-3xl p-4'>
        <div className='px-2 font-semibold text-xl`,'>
          <div>Send</div>
        </div>

        <div className={style.inputWrapper}>
          <input
            type='text'
            name='amount'
            className={style.input}
            placeholder='0.0'
            value={formData?.amount}
            onChange={handleChange}
            onPaste={handlePaste}
            onKeyPress={allowOnlyDigits}
            autoComplete='off'
          />
          {errorMessage?.amount && renderErrorMessage(errorMessage?.amount)}

          {selectedToken && account && (
            <div className='flex relative w-max h-min justify-between gap-2 items-center bg-gray-300 dark:bg-[#234169] rounded-2xl text-xl font-medium cursor-pointer p-2 px-3 -mt-1 '>
              <button
                className='flex items-center gap-2 rounded-full text-base'
                onClick={() => setTokenListModalOpen(true)}>
                <div>
                  <img
                    src={selectedToken.logo}
                    alt={`${selectedToken.symbol}-logo`}
                    height={35}
                    width={35}
                  />
                </div>
                <span>{selectedToken.symbol}</span>
                <AiOutlineDown className='text-2xl' />
              </button>

              <div className='text-sm flex absolute w-max -bottom-8 right-0 text-[#585d6a]'>
                Balance: {selectedToken.balance}
                <div
                  className='ml-2 px-2 bg-sky-200 dark:bg-[#172A42] border border-sky-400 hover:border-sky-500 dark:border-[#163256] dark:hover:border-[#234169] rounded-2xl cursor-pointer text-[11px] text-[#4F90EA]'
                  onClick={() =>
                    setFormData({ ...formData, amount: selectedToken.balance as string })
                  }>
                  MAX
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={style.inputWrapper}>
          <input
            type='text'
            name='recipient'
            className={style.input}
            placeholder='0x...'
            value={formData?.recipient}
            onChange={handleChange}
          />
          {errorMessage?.recipient && renderErrorMessage(errorMessage?.recipient)}
        </div>

        {!account && (
          <button
            onClick={connectWallet}
            className={`${style.mainButton} text-gray-100 bg-[#ea6262cd] hover:bg-[#ea6262eb] hover:border-[#ff497d] dark:text-[#ea4f4f] dark:bg-[#4c1a1a] dark:hover:bg-[#471515] dark:border-[#561630] dark:hover:border-[#692341]`}>
            Connect Wallet
          </button>
        )}

        {account && !isConnectedToMainnet() && (
          <button
            onClick={switchToMainnet}
            className={`${style.mainButton} text-gray-100 bg-[#ea6262cd] hover:bg-[#ea6262eb] hover:border-[#ff497d] dark:text-[#ea4f4f] dark:bg-[#4c1a1a] dark:hover:bg-[#471515] dark:border-[#561630] dark:hover:border-[#692341]`}>
            Wrong Network
          </button>
        )}

        {account && isConnectedToMainnet() && (
          <button
            onClick={handleSubmit}
            className={`${style.mainButton} text-gray-100 bg-[#627deacd] hover:bg-[#627deaeb] hover:border-[#49a1ff] dark:text-[#4F90EA] dark:bg-[#172A42] dark:hover:bg-[#152b47] dark:border-[#163256] dark:hover:border-[#234169]`}>
            Send
          </button>
        )}

        <ReactModal
          isOpen={loadingModalOpen}
          onRequestClose={() => setLoadingModalOpen(false)}
          style={modalStyle}
          ariaHideApp={false}
          bodyOpenClassName='overflow-hidden'
          overlayClassName='fixed bg-faded inset-0 z-50'>
          <LoadingModal isLoading={isLoading} transactionInfo={transactionInfo} />
        </ReactModal>

        <ReactModal
          isOpen={tokenListModalOpen}
          onRequestClose={() => setTokenListModalOpen(false)}
          style={modalStyle}
          ariaHideApp={false}
          bodyOpenClassName='overflow-hidden'
          overlayClassName=' fixed bg-faded inset-0 z-50'>
          <TokenListModal
            selectToken={(token) => setSelectedToken(token)}
            closeModal={() => setTokenListModalOpen(false)}
          />
        </ReactModal>
      </div>
    </div>
  );
};

const renderErrorMessage = (errorMessage: string) => {
  return <div className='absolute bottom-4 left-6 text-sm text-red-400'>{errorMessage}</div>;
};

export default Send;

const style = {
  inputWrapper:
    "p-5 bg-gray-100 dark:bg-gray-800 relative my-3 rounded-2xl text-3xl flex justify-between",
  input: "bg-transparent text-gray-500 outline-none mb-6 w-full text-2xl",
  mainButton:
    "w-full my-2 py-5 px-8 text-xl font-semibold flex items-center justify-center rounded-2xl outline-none focus:outline-none transition ease-out duration-300 border",
};

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "25rem",
    backgroundColor: "#13181f",
    border: ".2px solid grey",
    borderRadius: "20px",
    padding: 0,
  },
};
