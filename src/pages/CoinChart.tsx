import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ChartData } from "../types/chartData";
import { useTokenContext } from "../context/TokenContext";

const CoinChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useOutletContext<boolean>();

  const { chartData, chartDataIsLoading, getChartData } = useTokenContext();

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      getChartData(params.id);
    }
  }, [params]);

  useEffect(() => {
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
    candleSeries.setData(chartData as ChartData[]);

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
  }, [chartData, isDarkMode]);

  if (chartDataIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='border border-spacing-4 rounded-xl justify-center items-center h-[calc(100vh-80px)]  md:h-[calc(100vh-200px)] flex md:w-[85vw] max-w-screen-2xl mx-auto md:mt-6 p-2'>
      <div ref={chartContainerRef} className=' h-full w-full flex-1 overflow-hidden' />
    </div>
  );
};

export default CoinChart;
