export const _fetch = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const formatNumber = (
  number: number,
  decimalHandler: { decimal: boolean } = { decimal: true }
): string => {
  let decimals = decimalHandler.decimal
    ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    : { maximumFractionDigits: 0 };

  return number.toLocaleString("en", {
    style: "currency",
    currency: "USD",
    ...decimals,
  });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

export const setBalanceWithDecimals = (rawBalance: number, decimals: number) => {
  return (Number(rawBalance) / Math.pow(10, decimals)).toFixed(2);
};
