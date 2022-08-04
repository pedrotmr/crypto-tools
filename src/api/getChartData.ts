import { ChartData } from "../types/chart-data";
import { formatDate } from "../utils";
import { fetchChartDataByCoinGecko } from "./coingecko";

export const getChartFormattedData = async (id: string): Promise<ChartData[]> => {
  const data = await fetchChartDataByCoinGecko(id);
  if (data && data.length) {
    const formattedData = data.map((token: number[]) => {
      return {
        time: formatDate(token[0]),
        open: token[1],
        high: token[2],
        low: token[3],
        close: token[4],
      };
    });
    return formattedData;
  } else {
    return [];
  }
};
