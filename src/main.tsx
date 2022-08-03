import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import Router from "./routes/routes";
import { TokenProvider } from "./context/TokenContext";
import { WalletProvider } from "./context/WalletContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <WalletProvider>
      <TokenProvider>
        <Router />
      </TokenProvider>
    </WalletProvider>
  </React.StrictMode>
);
