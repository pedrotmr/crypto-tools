import React, { ReactNode, useEffect } from "react";
import { useSort } from "../hooks/useSort";
import { Link } from "react-router-dom";
import { useTokenContext } from "../context/TokenContext";
import { TrendingTokens } from "../types/trendingTokens";
import { Sparklines, SparklinesLine, SparklinesNormalBand } from "react-sparklines";

type TableHeader = {
  dataId: keyof TrendingTokens;
  name: string;
};

const sharedStyles = {
  headItem: "py-3 px-6 flex items-center gap-2",
  bodyItem: "py-4 px-6",
};

const TokenTable: React.FC = () => {
  const { getTokenPage, pagination, trendingTokens } = useTokenContext();

  const { sortedItems, sortIt, getClassForSortedColumn } = useSort(trendingTokens);

  const tableHeader: TableHeader[] = [
    { dataId: "id", name: "#" },
    { dataId: "name", name: "Coin" },
    { dataId: "symbol", name: "" },
    { dataId: "price", name: "Price" },
    { dataId: "volume24h", name: "24h Volume" },
    { dataId: "mktCap", name: "Mkt Cap" },
  ];

  useEffect(() => {
    getTokenPage(pagination.perPage);
  }, []);

  return (
    <div className='overflow-x-auto rounded-xl '>
      <table className='w-full text-sm text-left text-gray-500 h-[75vh] dark:text-gray-200'>
        <thead className='text-xs text-gray-700 dark:text-gray-50 bg-slate-200 dark:bg-gray-700'>
          <tr>
            {tableHeader.map((header, idx) => (
              <th key={idx}>
                <button
                  aria-label={`sort by ${header.dataId}`}
                  className={`py-3 px-6 flex items-center gap-2 ${getClassForSortedColumn(
                    header.dataId
                  )} `}
                  onClick={() => sortIt(header.dataId)}>
                  {header.name}
                </button>
              </th>
            ))}
            <th className={sharedStyles.headItem}>Last 7 days</th>
          </tr>
        </thead>

        <tbody className='bg-slate-100 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700'>
          {sortedItems &&
            sortedItems.map((token, index) => (
              <tr key={index}>
                <td className={sharedStyles.bodyItem}>{token.id}</td>
                <td className={sharedStyles.bodyItem}>
                  <span className='flex items-center gap-2'>
                    <img src={token.logo} alt={`${token.name}-logo`} width={25} height={25} />
                    <span>{token.name}</span>
                  </span>
                </td>
                <td className={sharedStyles.bodyItem}>{token.symbol}</td>
                <td className={sharedStyles.bodyItem}>{token.displayPrice}</td>
                <td className={sharedStyles.bodyItem}>{token.displayVolume24h}</td>
                <td className={sharedStyles.bodyItem}>{token.displayMktCap}</td>
                <td className={sharedStyles.headItem}>
                  <Link to={`/coins/${token.idx}`}>{renderSparkline(token.sparkline)}</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const renderSparkline = (data: number[]): ReactNode => {
  return (
    <div className="w-24 md:w-40 h-4 md:h-8">
      <Sparklines data={data}>
        <SparklinesLine
          style={{ fill: "none", strokeWidth: 3 }}
          color={data[0] < data[data.length - 1] ? "#57bd0d" : "#ed5565"}
        />
      </Sparklines>
    </div>
  );
};

export default TokenTable;
