import { TransactionTokens } from "../types/transaction-tokens";

export const fetchTransactionTokens = async (): Promise<TransactionTokens[]> => {
  const url = "https://api.npoint.io/d293b1b86402d170861f";
  const response = await fetch(url);
  const data = response.json();
  return data;
};
