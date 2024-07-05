import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSWRInfinite from "swr/infinite";
import { getTrendingTokensTableData } from "../api/getTrendingTokens";
import TableSkeleton from "../components/Home/TableSkeleton";
import TokenTable from "../components/Home/TokenTable";
import { TrendingTokens } from "../types/trending-tokens";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") navigate("/");
  }, [location]);
  const { data, error, size, setSize } = useSWRInfinite<TrendingTokens[]>(
    (pageIndex) => `trendingTokens-${pageIndex + 1}`,
    async (key) => {
      const page = parseInt(key.split('-')[1]);
      return await getTrendingTokensTableData(page);
    }
  );

  console.log("data", data);

  const isLoading = !error && size > 0 && data && typeof data[size - 1] === "undefined";

  const trendingTokens = data ? ([] as TrendingTokens[]).concat(...data) : [];

  return (
    <div className="my-8 lg:px-8">
      {!data ? <TableSkeleton /> : <TokenTable trendingTokens={trendingTokens} />}
      <div className="flex justify-center items-center mt-6">
        <button
          className="py-2 px-4 text-sm rounded-lg text-gray-500 bg-white inline-flex items-center border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={() => setSize(size + 1)}
          disabled={isLoading}
        >
          {isLoading ? <span>Loading ...</span> : <span>Load more ...</span>}
        </button>
      </div>
    </div>
  );
};

export default Home;
