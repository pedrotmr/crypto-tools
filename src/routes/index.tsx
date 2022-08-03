import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wallet from "../pages/Wallet";
import Home from "../pages/Home";
import CoinChart from "../pages/CoinChart";
import App from "../App";

const Router: React.FC = ({}) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Home />} />
          <Route path='wallet' element={<Wallet />} />
          <Route path='coins'>
            <Route path=':id' element={<CoinChart />} />
          </Route>
          <Route path='*' element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
