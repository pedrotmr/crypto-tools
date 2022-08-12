import { Contract, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormWrapper from "../components/Send | Swap/FormWrapper";
import Input from "../components/Send | Swap/Input";
import TransactionButton from "../components/Send | Swap/TransactionButton";
import { useWalletContext } from "../context/WalletContext";
import { SendTransactionInfo } from "../types/transaction-info";
import { TransactionTokens } from "../types/transaction-tokens";

declare let window: any;

const Send = () => {
  const [selectedToken, setSelectedToken] = useState<TransactionTokens>();
  const [formData, setFormData] = useState({ recipient: "", amount: "" });
  const [errorMessage, setErrorMessage] = useState({ recipient: "", amount: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [tokenListModalOpen, setTokenListModalOpen] = useState(false);
  const [transactionInfo, setTransactionInfo] = useState<SendTransactionInfo>({
    recipient: "",
    amount: "",
    token: "",
    txHash: "",
    type: "send",
  });

  const { account, transactionTokens } = useWalletContext();

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

  const handleError = (inputField: "amount" | "recipient", message: string) => {
    setErrorMessage({ ...errorMessage, [inputField]: message });
    setTimeout(() => {
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
    <FormWrapper
      title='Send'
      loadingModalOpen={loadingModalOpen}
      tokenListModalOpen={tokenListModalOpen}
      tokenListSecondModalOpen={false}
      isLoading={isLoading}
      transactionInfo={transactionInfo}
      closeLoadingModal={() => {
        setLoadingModalOpen(false), window.location.reload();
      }}
      closeTokenListModal={() => setTokenListModalOpen(false)}
      selectToken={(token: TransactionTokens) => setSelectedToken(token)}>
      <Input
        amount
        name='amount'
        value={formData?.amount}
        handleChange={handleChange}
        errorMessage={errorMessage.amount}
        selectedToken={selectedToken}
        openSelectTokenModal={() => setTokenListModalOpen(true)}
        setMaxValue={() => setFormData({ ...formData, amount: selectedToken?.balance as string })}
      />
      <Input
        address
        name='recipient'
        value={formData?.recipient}
        handleChange={handleChange}
        errorMessage={errorMessage.recipient}
      />
      <TransactionButton type='send' handleSubmit={handleSubmit} />
    </FormWrapper>
  );
};

export default Send;
