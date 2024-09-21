import React, { useState } from "react";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { ENV, TokenListProvider } from "@solana/spl-token-registry";
import { ClipLoader } from "react-spinners";

const TokenMetadata = () => {
  const [tokenPublicKey, setTokenPublicKey] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTokenMetadata = async (tokenAddress) => {
    const connection = new Connection("https://api.devnet.solana.com");
    const metaplex = Metaplex.make(connection);
    const mintAddress = new PublicKey(tokenAddress);

    let tokenMetadata = {
      name: null,
      symbol: null,
      logo: null,
    };

    try {
      const metadataAccount = metaplex.nfts().pdas().metadata({ mint: mintAddress });
      const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

      if (metadataAccountInfo) {
        const token = await metaplex.nfts().findByMint({ mintAddress });
        tokenMetadata.name = token.name;
        tokenMetadata.symbol = token.symbol;
        tokenMetadata.logo = token.json?.image;
      } else {
        const provider = await new TokenListProvider().resolve();
        const tokenList = provider.filterByChainId(ENV.Devnet).getList();
        const tokenMap = tokenList.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map());

        const token = tokenMap.get(mintAddress.toBase58());
        if (token) {
          tokenMetadata.name = token.name;
          tokenMetadata.symbol = token.symbol;
          tokenMetadata.logo = token.logoURI;
        } else {
          throw new Error("Token not found in the token list.");
        }
      }

      return tokenMetadata;

    } catch (error) {
      console.error("Error fetching token metadata:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  };

  const fetchMetadata = async () => {
    if (!tokenPublicKey) {
      alert("Please enter a valid public key.");
      return;
    }

    setLoading(true);
    try {
      const metadata = await getTokenMetadata(tokenPublicKey.trim());
      setMetadata(metadata);
    } catch (error) {
      alert(`Failed to fetch metadata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Left side: Background Image with Text */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=2549&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        }}
      >
        <div className="w-full h-full flex flex-col justify-end text-white p-12 bg-black/40">
          <h1 className="text-4xl font-bold mb-4">Solana Token Metadata</h1>
          <p className="text-lg mb-2">Explore metadata of your tokens!</p>
          <p className="text-sm mb-10">Enter the public key of any Solana token to view its metadata details.</p>
        </div>
      </div>

      {/* Right side: Form and Metadata */}
      <div className="w-1/2 flex justify-center items-center bg-gray-950 text-white p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Enter Token Public Key</h2>

          {/* Token Public Key Input */}
          <div>
            <label className="block text-sm mb-2" htmlFor="tokenPublicKey">
              Token Public Key
            </label>
            <input
              id="tokenPublicKey"
              type="text"
              value={tokenPublicKey}
              onChange={(e) => setTokenPublicKey(e.target.value)}
              placeholder="PublicKey"
              className="w-full p-3 bg-white text-black rounded mb-6"
            />
          </div>

          <button
            onClick={fetchMetadata}
            className="w-full bg-indigo-600 py-3 rounded hover:bg-indigo-700 transition-all mb-3"
          >
            {loading ? (
              <ClipLoader color="white" loading size={25} aria-label="Loading Spinner" data-testid="loader" />
            ) : (
              "Fetch Metadata"
            )}
          </button>

          {metadata && (
            <div className="bg-gray-800 p-4 rounded mt-4">
              <h3 className="text-xl font-bold">Token Metadata</h3>
              <p>
                <strong>Name:</strong> {metadata.name || "N/A"}
              </p>
              <p>
                <strong>Symbol:</strong> {metadata.symbol || "N/A"}
              </p>
              {metadata.logo && (
                <img src={metadata.logo} alt={`${metadata.name} logo`} className="w-10 h-10 mt-2" />
              )}
            </div>
          )}
          <p>Currently this feature is not working</p>
        </div>
      </div>
    </div>
  );
};

export default TokenMetadata;
