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

  const { data, size, setSize } = useSWRInfinite<TrendingTokens[]>(
    (page) => (page + 1).toString(),
    getTrendingTokensTableData
  );

  const trendingTokens = data ? ([] as TrendingTokens[]).concat(...data) : [];

  return (
    <div className='py-8 px-2 md:px-8'>
      <TokenTable trendingTokens={trendingTokens} />
      <button onClick={() => setSize(size + 1)}>Load more</button>
    </div>
  );
};

export default Home;
