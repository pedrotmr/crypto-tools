import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TokenTable from "../components/TokenTable";
import useSWRInfinite from "swr/infinite";
import { getTrendingTokensTableData } from "../api/getTrendingTokens";
import { TrendingTokens } from "../types/trending-tokens";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") navigate("/");
  }, [location]);

  const { data, error, size, setSize } = useSWRInfinite<TrendingTokens[]>(
    (page) => (page + 1).toString(),
    getTrendingTokensTableData
  );

  const isLoading = !error && size > 0 && data && typeof data[size - 1] === "undefined";

  const trendingTokens = data ? ([] as TrendingTokens[]).concat(...data) : [];

  return (
    <div className='my-8 lg:px-8'>
      <TokenTable trendingTokens={trendingTokens} />
      <div className='flex justify-center items-center mt-6'>
        <button
          className='py-2 px-4 text-sm rounded-lg text-gray-500 bg-white inline-flex items-center border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          onClick={() => setSize(size + 1)}
          disabled={isLoading}>
          {isLoading ? <span>Loading ...</span> : <span>Load more ...</span>}
        </button>
      </div>
    </div>
  );
};

export default Home;
