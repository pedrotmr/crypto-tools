export type TransactionInfo = SendTransactionInfo | SwapTransactionInfo;

export type SendTransactionInfo = {
  recipient: string;
  amount: string;
  token: string;
  txHash: string;
  type: "send";
};

export type SwapTransactionInfo = {
  amountFrom: string;
  tokenFrom: string;
  tokenTo: string;
  amountTo: string;
  txHash: string;
  type: "swap";
};
