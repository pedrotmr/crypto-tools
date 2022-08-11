import React, { useEffect, useState } from "react";
import { IoIosSwap } from "react-icons/io";
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
  const [errorMessage, setErrorMessage] = useState({ recipient: "", amount: "" });
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

  // const transactionStart = async (
  //   transaction: ethers.providers.TransactionResponse,
  //   recipient: string,
  //   convertedAmount: string,
  //   tokenSymbol = "ETH"
  // ) => {
  //   setIsLoading(true);
  //   setLoadingModalOpen(true);
  //   await transaction.wait();
  //   // setTransactionInfo({
  //   //   ...transactionInfo,
  //   //   txHash: transaction.hash,
  //   //   recipient: recipient,
  //   //   amount: convertedAmount,
  //   //   token: tokenSymbol,
  //   // });
  //   setIsLoading(false);
  //   setFormData({ tokenFromAmount: "", tokenToAmount: "" });
  // };

  // const sendToken = async (
  //   token: TransactionTokens | undefined,
  //   recipient: string,
  //   amount: string
  // ): Promise<void> => {
  //   if (!token) return;
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   try {
  //     if (token === transactionTokens?.[0]) {
  //       const transaction = await signer.sendTransaction({
  //         to: recipient,
  //         value: ethers.utils.parseEther(amount),
  //       });
  //       transactionStart(transaction, recipient, amount);
  //     } else {
  //       const contractAbiFragment = ["function transfer(address, uint256)"];
  //       const contract = new Contract(token.contractAddress, contractAbiFragment, signer);
  //       const numberOfTokens = ethers.utils.parseUnits(amount, token.decimals);
  //       const transaction = await contract.transfer(recipient, numberOfTokens);
  //       transactionStart(transaction, recipient, amount);
  //     }
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       toast.error(<span className='pr-5'>{error.message}</span>);
  //     }
  //   }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleError = (inputField: "tokenFromAmount" | "tokenToAmount", message: string) => {
  //   setErrorMessage({ ...errorMessage, [inputField]: message });
  //   return setTimeout(() => {
  //     setErrorMessage({ ...errorMessage, [inputField]: "" });
  //   }, 5000);
  // };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { tokenFromAmount, tokenToAmount } = formData;

    // if (!amount) {
    //   return handleError("amount", "Amount is required");
    // }
    // if (!tokenFromAmount) {
    //   return handleError("recipient", "Address is required");
    // }
    // if (recipient === account) {
    //   return handleError("recipient", "Address is the same as current user");
    // }
    // if (!ethers.utils.isAddress(recipient)) {
    //   return handleError("recipient", "Invalid address");
    // }
    // if (Number(amount) > Number(selectedToken?.balance)) {
    //   return handleError("amount", "Insufficient funds");
    // }
    // sendToken(selectedToken, recipient, amount);
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
        errorMessage={errorMessage.amount}
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
          <IoIosSwap className='text-2xl ' />
        </button>
      </div>
      <Input
        amount
        name='tokenToAmount'
        value={formData?.tokenToAmount}
        handleChange={handleChange}
        errorMessage={errorMessage.amount}
        selectedTokenTo={selectedTokenTo}
        openSelectTokenModal={() => setTokenListSecondModalOpen(true)}
      />
      <TransactionButton type='swap' handleSubmit={handleSubmit} />
    </FormWrapper>
  );
};

export default Swap;
