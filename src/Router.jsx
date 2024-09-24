import React, { useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Faucet from "./pages/Faucet";
import CreateToken from "./pages/CreateToken";
import App from "./App";
import BuyCoffee from "./pages/BuyCoffee";
import TokenMetadata from "./pages/TokenMetadata";
import Ata from "./pages/Ata";

const Router = () => {
  const [endpoint, setEndpoint] = useState("https://solana-devnet.g.alchemy.com/v2/djt3Hz2vuRd_sihRFtfXzdXWZjbciIJg");
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    const endpoint = localStorage.getItem("endpoint");
    if(endpoint) setEndpoint(localStorage.getItem("endpoint"));  
  },[])
  const handleChange = (e) => {
    setEndpoint(e.target.value);
    localStorage.setItem("endpoint",e.target.value)
  }
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <nav className="flex justify-between items-center p-6 fixed top-0 w-full bg-slate-900 text-white z-50">
            <a href="/" className="text-3xl font-bold cursor-pointer">SOLANA</a>
            <div className="flex items-center space-x-6 font-bold">
              <button onClick={() => scrollToSection("home")} className="hover:text-purple-400">
                Home
              </button>
              <button onClick={() => scrollToSection("tools")} className="hover:text-purple-400">
                Tools
              </button>
              <button onClick={() => scrollToSection("buy-me-a-coffee")} className="hover:text-purple-400">
                Buy me a Coffee
              </button>
              <button onClick={() => scrollToSection("faq")} className="hover:text-purple-400">
                FAQ
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <select
                className="bg-purple-600 text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="network"
                id="network"
                value={endpoint}
                onChange={(e) => handleChange(e)}
              >
                <option value="https://solana-mainnet.g.alchemy.com/v2/djt3Hz2vuRd_sihRFtfXzdXWZjbciIJg">
                  Mainnet
                </option>
                <option value="https://solana-devnet.g.alchemy.com/v2/djt3Hz2vuRd_sihRFtfXzdXWZjbciIJg">Devnet</option>
                <option value="https://api.testnet.solana.com">TestNet</option>
              </select>

              <WalletMultiButton />
            </div>
          </nav>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/airdrop" element={<Faucet />} />
              <Route path="/create-token" element={<CreateToken />} />
              <Route path="/buy-me-a-coffee" element={<BuyCoffee coffee={"true"} />} />
              <Route path="/send-transaction" element={<BuyCoffee coffee={"false"} />} />
              <Route path="/token-metadata" element={<TokenMetadata />} />
              <Route path="/ata-address" element={<Ata />} />
            </Routes>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Router;
