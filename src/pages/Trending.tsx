import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TokenTable from "../components/TokenTable";
import FooterButtons from "../components/FooterButton";
import { useGetTokenDetails } from "../hooks/useGetTokenDetails";

const Trending: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") navigate("/");
  }, [location]);

  return (
    <div className='py-8 px-2 md:px-8'>
      <TokenTable />
      <FooterButtons />
    </div>
  );
};

export default Trending;
