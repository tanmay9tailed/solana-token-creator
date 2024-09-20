import React, { useState } from "react";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { pack } from "@solana/spl-token-metadata";

const CreateToken = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenAccountAddress, setTokenAccountAddress] = useState("");

  const { connection } = useConnection();
  const wallet = useWallet();

  async function createToken(e) {
    e.preventDefault();
    if (!wallet.publicKey) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      const mintKeypair = Keypair.generate();
      const metadata = {
        mint: mintKeypair.publicKey,
        name: name,
        uri: img,
        symbol: symbol,
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
      const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

      const associatedToken = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(mintKeypair.publicKey, decimals, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        }),
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedToken,
          wallet.publicKey,
          amount * 1000000000,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      console.log(transaction);

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      transaction.partialSign(mintKeypair);

      await wallet.sendTransaction(transaction, connection);

      console.log(`Token mint created at ${mintKeypair.publicKey}`);
      setTokenAccountAddress(associatedToken.toBase58());
      setTokenAddress(mintKeypair.publicKey.toBase58());
      console.log(`Associated token account created at ${associatedToken.toBase58()}`);
      console.log("Minted!");
    } catch (error) {
      console.error("Transaction failed:", error.message);
      alert(`Transaction failed: ${error.message}`);
    }
  }

  return (
    <div className="w-full h-screen bg-stone-950 text-slate-300 flex justify-center items-center">
      <form
        className="space-y-6 bg-stone-900 p-10 rounded-lg shadow-lg w-[600px] border border-stone-800"
        onSubmit={createToken}
      >
        <h1 className="text-3xl font-bold text-center mb-6">Solana Token Creator</h1>
        <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-white/50 rounded-lg cursor-pointer">
          <label htmlFor="upload-image" className="flex flex-col items-center space-y-2">
            <svg
              className="w-12 h-12 text-white/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5a7.5 7.5 0 01-15 0 7.5 7.5 0 0115 0zM12 3v2.25M16.656 4.844l-1.591 1.591M7.344 4.844l1.591 1.591M12 18.75V21M7.344 19.656l1.591-1.591M16.656 19.656l-1.591-1.591"
              ></path>
            </svg>
            <span className="text-white/50">Click to upload image</span>
            <input
              id="upload-image"
              type="file"
              className="hidden"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </label>
        </div>
        <div>
          <label className="block text-white">Name</label>
          <input
            className="w-full px-4 py-2 mt-1 text-black rounded bg-gray-200"
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-white">Symbol</label>
          <input
            className="w-full px-4 py-2 mt-1 text-black rounded bg-gray-200"
            type="text"
            placeholder="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-white">Decimals</label>
          <input
            className="w-full px-4 py-2 mt-1 text-black rounded bg-gray-200"
            type="text"
            placeholder="decimals"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-white">Amount</label>
          <input
            className="w-full px-4 py-2 mt-1 text-black rounded bg-gray-200"
            type="text"
            placeholder="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-white">Description</label>
          <textarea
            className="w-full px-4 py-2 mt-1 text-black rounded bg-gray-200"
            placeholder="Description of your token..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          className="w-full py-3 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          type="submit"
        >
          Create Token
        </button>
      </form>
    </div>
  );
};

export default CreateToken;
