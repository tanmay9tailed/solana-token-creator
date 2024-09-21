import React from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Faucet from "./pages/Faucet";
import CreateToken from "./pages/CreateToken";
import App from "./App";
import BuyCoffee from "./pages/BuyCoffee";
import TokenMetadata from "./pages/TokenMetadata";

const Router = () => {

  return (
    <ConnectionProvider endpoint="https://solana-devnet.g.alchemy.com/v2/djt3Hz2vuRd_sihRFtfXzdXWZjbciIJg">
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/airdrop" element={<Faucet />} />
              <Route path="/create-token" element={<CreateToken />} />
              <Route path="/buy-me-a-coffee" element={<BuyCoffee coffee={"true"} />} />
              <Route path="/send-transaction" element={<BuyCoffee coffee={"false"} />} />
              <Route path="/token-metadata" element={<TokenMetadata/>} />
            </Routes>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default Router;
