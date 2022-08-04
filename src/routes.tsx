import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wallet from "./pages/Wallet";
import Trending from "./pages/Home";
import CoinChart from "./pages/CoinChart";
import App from "./App";
import Send from "./pages/Send";
import Swap from "./pages/Swap";

const Router: React.FC = ({}) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Trending />} />
          <Route path='wallet' element={<Wallet />} />
          <Route path='send' element={<Send />} />
          <Route path='swap' element={<Swap />} />
          <Route path='coins'>
            <Route path=':id' element={<CoinChart />} />
          </Route>
          <Route path='*' element={<Trending />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
