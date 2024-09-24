import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const Ata = () => {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState("");
  const [tokenProgram, setTokenProgram] = useState("");
  const [ataAddress, setAtaAddress] = useState(""); 

  const handleGetAddress = () => {
    if(tokenProgram===""){
        alert("Choose a token program.");
        return;
    }
    setLoading(true);

    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const seeds = [
        wallet.publicKey.toBuffer(),
        tokenProgram === "1" ? TOKEN_2022_PROGRAM_ID.toBuffer() : TOKEN_PROGRAM_ID.toBuffer(),
        mintPublicKey.toBuffer(),
      ];
      const ata = PublicKey.findProgramAddressSync(
        seeds,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      console.log("ATA: ", ata[0].toBase58(), "bump: ", ata[1]);
      setAtaAddress(ata[0].toBase58());
    } catch (error) {
      console.error("Error finding ATA:", error);
      setAtaAddress("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Left Panel */}
        <div
          className="w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=2549&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
          }}
        >
          <div className="h-full bg-black/70 flex flex-col justify-center p-10 space-y-4 rounded-l-lg">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Solana Token Creator: Build Your Marketing Strategy!
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed">
              Try all premium features for free. Simply register and create your first widget. It’s quick and easy,
              designed for your success.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 h-full bg-gray-950 text-slate-300 flex justify-center items-center rounded-r-lg">
          <div className="space-y-20 max-w-md mx-auto">
            <h1 className="w-full bg-purple-600/50 text-purple-200 py-4 px-8 text-center text-3xl font-bold rounded-lg shadow-lg">
              Get Your ATA Public Key
            </h1>
            <div className="space-y-5">
              <div className="space-y-4">
                <input
                  className="bg-slate-50 text-black py-3 px-5 border-none outline-none rounded-lg w-full shadow-md"
                  type="text"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  placeholder="Enter Token Public Address"
                />
                <select
                  className="bg-slate-50 text-black py-3 px-5 border-none outline-none rounded-lg w-full shadow-md"
                  value={tokenProgram}
                  onChange={(e) => setTokenProgram(e.target.value)}
                >
                  <option value="" disabled>Select Token Program</option>
                  <option value="1">TOKEN_2022_PROGRAM_ID</option>
                  <option value="2">TOKEN_PROGRAM_ID</option>
                </select>
                <button
                  className="py-3 px-5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-all duration-300 shadow-lg"
                  onClick={handleGetAddress}
                >
                  {loading ? (
                    <ClipLoader color="white" loading size={25} aria-label="Loading Spinner" data-testid="loader" />
                  ) : (
                    "Get Your Address"
                  )}
                </button>
              </div>
            </div>
            {/* ATA Address Display */}
            {ataAddress && (
              <div className="text-slate-300 mt-4">
                <h2 className="text-lg font-semibold text-purple-400">ATA:</h2>
                <p className="text-base leading-relaxed">{ataAddress}</p>
              </div>
            )}
            {/* ATA Information Section */}
            <div className="space-y-4 text-slate-300">
              <h2 className="text-xl font-semibold text-purple-400">What is an ATA?</h2>
              <p className="text-base leading-relaxed">
                An <strong>Associated Token Account (ATA)</strong> is a special kind of account in the Solana blockchain
                that holds tokens tied to a specific wallet. Each token has its own ATA address, making it easy to
                manage your tokens securely.
              </p>
              <p className="text-base leading-relaxed">
                Once you enter your token public address above, you can retrieve your ATA and use it for various
                token-related operations, such as transfers, staking, or swaps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ata;
