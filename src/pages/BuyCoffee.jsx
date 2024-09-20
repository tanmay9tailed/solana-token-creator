import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNavigate } from "react-router";

const BuyCoffee = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      }
    };
    fetchBalance();
  }, [wallet, connection]);

  const handleDonate = (e) => {
    e.preventDefault();
    // Add the function to process the donation here
    alert(`Donate ${amount} SOL`);
  };

  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Left side: Background Image with Text */}
      <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=2549&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)` }}>
        <div className="w-full h-full flex flex-col justify-end text-white p-12 bg-black/40">
          <h1 className="text-4xl font-bold mb-4">Solana Token Creator</h1>
          <p className="text-lg mb-2">to build your marketing strategy!</p>
          <p className="text-sm mb-10">
            Try all paid functions for free, just register and create your first widget. It's simple and fast.
          </p>
        </div>
      </div>

      {/* Right side: Form and Details */}
      <div className="w-1/2 flex justify-center items-center bg-gray-950 text-white p-10">
        <div className="w-full max-w-md">
          {/* Solana Logo */}
          <div className="flex justify-center mb-6">
            <img src="https://www.liblogo.com/img-logo/so2809sc45-solana-logo-solana-blockchain-platform-liblogo.png" alt="Solana Logo" className="w-32 rounded-full" />
          </div>

          {/* SOL Balance */}
          <h2 className="text-2xl font-semibold text-center mb-4">Your SOL Balance: {solBalance}</h2>

          {/* Message */}
          <p className="text-center font-bold text-2xl">Buy me a Coffee.</p>
          <p className="text-center mb-8 text-rose-700">Your sol will be debited and given to the creator of this website</p>

          {/* Donation Form */}
          <form onSubmit={handleDonate}>
            <label className="block text-sm mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="amount"
              className="w-full p-3 bg-white text-black rounded mb-6"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 py-3 rounded hover:bg-indigo-700 transition-all"
            >
              Donate
            </button>
          </form>

          {/* Close Icon */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 flex justify-center items-center bg-gray-700 rounded-full hover:bg-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCoffee;
