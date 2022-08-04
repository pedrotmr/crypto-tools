import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ChartData } from "../types/chart-data";
import useSWR from "swr";
import { getChartFormattedData } from "../api/getChartData";

const CoinChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useOutletContext<boolean>();

  const params = useParams();

  const { data } = useSWR(params.id, getChartFormattedData);

  useEffect(() => {
    if (data) {
      const chart = createChart(chartContainerRef.current as HTMLDivElement, {
        layout: {
          backgroundColor: `${isDarkMode ? "#141d29" : "#f1f5f9"}`,
          textColor: `${isDarkMode ? "#aeb1b6" : "##5b5c5d"}`,
        },
        grid: {
          vertLines: {
            color: `${isDarkMode ? "#020305" : "#e3e8eb"}`,
          },
          horzLines: {
            color: `${isDarkMode ? "#020305" : "#e3e8eb"}`,
          },
        },
        timeScale: {
          borderColor: "#485c7b",
        },
      });

      const candleSeries = chart.addCandlestickSeries();
      candleSeries.setData(data as ChartData[]);

      const handleResize = (): void => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [data, isDarkMode]);

  return (
    <div className='border border-spacing-4 rounded-xl justify-center items-center h-[calc(100vh-80px)] md:h-[calc(100vh-200px)] flex md:w-[85vw] max-w-screen-2xl mx-auto md:mt-6 p-2'>
      {!data ? (
        <div>Loading...</div>
      ) : (
        <div ref={chartContainerRef} className=' h-full w-full flex-1 overflow-hidden' />
      )}
    </div>
  );
};

export default CoinChart;
