import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { IoIosSwap } from "react-icons/io";
import { toast } from "react-toastify";
import { ChainId, ETH, UniswapPair } from "simple-uniswap-sdk";
import FormWrapper from "../components/Send | Swap/FormWrapper";
import Input from "../components/Send | Swap/Input";
import TransactionButton from "../components/Send | Swap/TransactionButton";
import { useWalletContext } from "../context/WalletContext";
import { SwapTransactionInfo } from "../types/transaction-info";
import { TransactionTokens } from "../types/transaction-tokens";

declare let window: any;

const Swap = () => {
  const [selectedTokenFrom, setSelectedTokenFrom] = useState<TransactionTokens>();
  const [selectedTokenTo, setSelectedTokenTo] = useState<TransactionTokens>();
  const [formData, setFormData] = useState({ tokenFromAmount: "", tokenToAmount: "" });
  const [errorMessage, setErrorMessage] = useState({ tokenFromAmount: "", tokenToAmount: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [tokenListModalOpen, setTokenListModalOpen] = useState(false);
  const [tokenListSecondModalOpen, setTokenListSecondModalOpen] = useState(false);
  const [transactionInfo, setTransactionInfo] = useState<SwapTransactionInfo>({
    amountFrom: "",
    tokenFrom: "",
    amountTo: "",
    tokenTo: "",
    txHash: "",
    type: "swap",
  });

  const { account, transactionTokens } = useWalletContext();

  useEffect(() => {
    transactionTokens && setSelectedTokenFrom(transactionTokens[0]);
  }, [transactionTokens]);

  useEffect(() => {
    if (formData.tokenFromAmount && selectedTokenFrom && selectedTokenTo) {
      const tokenToCalculatedAmount = (
        (selectedTokenFrom.price / selectedTokenTo.price) *
        Number(formData.tokenFromAmount)
      ).toFixed(2);

      setFormData({ ...formData, tokenToAmount: tokenToCalculatedAmount });
    }
  }, [selectedTokenFrom, selectedTokenTo, formData.tokenFromAmount]);

  const swapInputData = () => {
    const _tokenFrom = selectedTokenFrom;
    const _tokenTo = selectedTokenTo;
    const _tokenFromAmount = formData.tokenFromAmount;
    const _tokenToAmount = formData.tokenToAmount;
    setSelectedTokenFrom(_tokenTo);
    setSelectedTokenTo(_tokenFrom);
    setFormData({ tokenFromAmount: _tokenToAmount, tokenToAmount: _tokenFromAmount });
  };

  const transactionStart = async (trade: any) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tradeTransaction = await signer.sendTransaction(trade);
      setIsLoading(true);
      setLoadingModalOpen(true);
      const tradeReceipt = await tradeTransaction.wait();
      setTransactionInfo({
        ...transactionInfo,
        amountFrom: formData.tokenFromAmount,
        tokenFrom: selectedTokenFrom!.symbol,
        amountTo: formData.tokenToAmount,
        tokenTo: selectedTokenTo!.symbol,
        txHash: tradeReceipt.transactionHash,
      });
      setIsLoading(false);
      setFormData({ tokenFromAmount: "", tokenToAmount: "" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(<span className='pr-5'>{error.message}</span>);
      }
    }
  };

  const swapToken = async (
    tokenFromAddress: string,
    tokenToAddress: string,
    tokenFromAmount: string
  ) => {
    try {
      const uniswapPair = new UniswapPair({
        fromTokenContractAddress:
          tokenFromAddress === ethers.constants.AddressZero
            ? ETH.MAINNET().contractAddress
            : tokenFromAddress,
        toTokenContractAddress:
          tokenToAddress === ethers.constants.AddressZero
            ? ETH.MAINNET().contractAddress
            : tokenToAddress,
        ethereumAddress: account!,
        chainId: ChainId.MAINNET,
      });
      const uniswapPairFactory = await uniswapPair.createFactory();
      const trade = await uniswapPairFactory.trade(tokenFromAmount);
      if (trade.approvalTransaction) {
        transactionStart(trade.approvalTransaction);
      } else {
        transactionStart(trade.transaction);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(<span className='pr-5'>{error.message}</span>);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleError = (inputField: "tokenFromAmount" | "tokenToAmount", message: string) => {
    setErrorMessage({ ...errorMessage, [inputField]: message });
    return setTimeout(() => {
      setErrorMessage({ ...errorMessage, [inputField]: "" });
    }, 5000);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { tokenFromAmount } = formData;
    if (!tokenFromAmount) {
      return handleError("tokenFromAmount", "Amount is required");
    }
    if (selectedTokenFrom === selectedTokenTo) {
      return handleError("tokenFromAmount", "Select different tokens");
    }
    if (Number(tokenFromAmount) > Number(selectedTokenFrom?.balance)) {
      return handleError("tokenFromAmount", "Insufficient funds");
    }
    swapToken(
      selectedTokenFrom!.contractAddress,
      selectedTokenTo!.contractAddress,
      tokenFromAmount
    );
  };

  return (
    <FormWrapper
      title='Swap'
      loadingModalOpen={loadingModalOpen}
      tokenListModalOpen={tokenListModalOpen}
      tokenListSecondModalOpen={tokenListSecondModalOpen}
      isLoading={isLoading}
      transactionInfo={transactionInfo}
      closeLoadingModal={() => setLoadingModalOpen(false)}
      closeTokenListModal={() => {
        setTokenListModalOpen(false), setTokenListSecondModalOpen(false);
      }}
      selectTokenFrom={(token: TransactionTokens) => setSelectedTokenFrom(token)}
      selectTokenTo={(token: TransactionTokens) => setSelectedTokenTo(token)}>
      <Input
        amount
        name='tokenFromAmount'
        value={formData?.tokenFromAmount}
        handleChange={handleChange}
        errorMessage={errorMessage.tokenFromAmount}
        selectedTokenFrom={selectedTokenFrom}
        openSelectTokenModal={() => setTokenListModalOpen(true)}
        setMaxValue={() =>
          setFormData({ ...formData, tokenFromAmount: selectedTokenFrom?.balance as string })
        }
      />
      <div className='flex absolute z-10 rotate-90 inset-x-1/2 top-[223px] '>
        <button
          onClick={swapInputData}
          className='p-1 border-4 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-xl'>
          <IoIosSwap className='text-md md:text-2xl ' />
        </button>
      </div>
      <Input
        amount
        name='tokenToAmount'
        value={formData?.tokenToAmount}
        handleChange={handleChange}
        errorMessage={errorMessage.tokenToAmount}
        selectedTokenTo={selectedTokenTo}
        openSelectTokenModal={() => setTokenListSecondModalOpen(true)}
      />
      <TransactionButton type='swap' handleSubmit={handleSubmit} />
    </FormWrapper>
  );
};

export default Swap;
