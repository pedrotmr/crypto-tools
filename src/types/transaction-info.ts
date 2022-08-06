export type TransactionInfo = {
  recipient: string;
  amount: string;
  token: string;
  txHash: string;
  type: "send" | "swap";
};
