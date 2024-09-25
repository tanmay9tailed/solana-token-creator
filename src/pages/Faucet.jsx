import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import ClipLoader from "react-spinners/ClipLoader";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Faucet = () => {
  const { connection } = useConnection("https://solana-devnet.g.alchemy.com/v2/djt3Hz2vuRd_sihRFtfXzdXWZjbciIJg");
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);
  const [sol, setSol] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      }
    };

    fetchBalance();
  }, [publicKey, connection, sol]);

  const getSol = async () => {
    const endpoint = localStorage.getItem("endpoint") || "https://solana-devnet.g.alchemy.com/v2/djt3Hz2vuRd_sihRFtfXzdXWZjbciIJg";
    if (endpoint.trim() === "https://solana-mainnet.g.alchemy.com/v2/djt3Hz2vuRd_sihRFtfXzdXWZjbciIJg") {
      alert("You can't AirDrop yourself on the MAINNET.");
      return;
    }
    if(!publicKey){
      alert("Connect your wallet first.")
      return;
    }
    if (publicKey) {
      setLoading(true);
      try {
        const airdropSignature = await connection.requestAirdrop(publicKey, sol * 1000000000);
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
        console.log(airdropSignature);
        setSol(0);
      } catch (error) {
        console.error("Airdrop failed:", error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left Panel */}
      <div
        className="w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=2549&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        }}
      >
        <div className="h-full bg-black/60 flex flex-col justify-center p-10 space-y-4">
          <h1 className="text-4xl font-bold text-white">Solana Token Creator, to build your marketing strategy!</h1>
          <p className="text-lg text-gray-200">
            Try all paid functions for free. Just register and create your first widget, it’s simple and fast.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 h-full bg-gray-950 text-slate-300 flex justify-center items-center">
        <div className="space-y-20">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white text-center">
              SOL Balance: <span>{balance}</span>
            </h1>
            <p className="text-xl text-green-500 w-full text-center">You are now successfully creating your Solana token.</p>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center space-x-4">
              <input
                className="bg-slate-50 text-black py-2 px-4 border-none outline-none rounded"
                type="number"
                value={sol}
                onChange={(e) => setSol(e.target.value)}
                placeholder="Enter SOL Amount"
              />
              <button
                className="py-2 px-4 bg-purple-600 text-white border-none outline-none rounded hover:bg-purple-500 transition-all duration-300 font-bold"
                onClick={getSol}
              >
                {loading ? (
                  <ClipLoader color="white" loading size={25} aria-label="Loading Spinner" data-testid="loader" />
                ) : (
                  "Airdrop SOL"
                )}
              </button>
            </div>
            {!publicKey&& <WalletMultiButton/>}

            <p className="text-center text-red-700 font-bold">You can only request SOLs once every 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
