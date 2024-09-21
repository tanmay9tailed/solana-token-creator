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
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { pack } from "@solana/spl-token-metadata";
import axios from "axios";
import { config } from "dotenv";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ClipLoader } from "react-spinners";

config();

const CreateToken = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenAccountAddress, setTokenAccountAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const { connection } = useConnection();
  const wallet = useWallet();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = await uploadImagePinata(file); // Await API call to Pinata
      setImg(imgUrl);
      setImgPreview(URL.createObjectURL(file)); // Preview local image
    }
  };

  const createToken = async (e) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      setLoading(true);
      const mintKeypair = Keypair.generate();

      // Upload metadata including image
      const metadata = {
        mint: mintKeypair.publicKey,
        name: name,
        uri: await uploadMetadata(), // Upload metadata to Pinata
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
          amount * 10 ** decimals, // Updated amount conversion
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      transaction.partialSign(mintKeypair);

      await wallet.sendTransaction(transaction, connection);

      console.log(`Token mint created at ${mintKeypair.publicKey}`);
      setTokenAccountAddress(associatedToken.toBase58());
      setTokenAddress(mintKeypair.publicKey.toBase58());
      console.log(`Associated token account created at ${associatedToken.toBase58()}`);
      setName("");
      setSymbol("");
      setDecimals("");
      setAmount("");
      setDescription("");
      setImg(null);
    } catch (error) {
      console.error("Transaction failed:", error.message);
      alert(`Transaction failed: ${error.message}`);
    }
    setLoading(false);
  };

  const uploadMetadata = async () => {
    const data = JSON.stringify({
      name: name,
      symbol: symbol,
      description: description,
      image: img, // Use the uploaded image URL
    });

    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: "5b06244232bb405a1b71", // Add your Pinata API key here
          pinata_secret_api_key: "414672f588d5a9fbb704cb25eee519030ada3041ac43b729572beaa4f284a518", // Add your Pinata secret API key here
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log(url);
      return url;
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImagePinata = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "POST",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "5b06244232bb405a1b71", // Add your Pinata API key here
            pinata_secret_api_key: "414672f588d5a9fbb704cb25eee519030ada3041ac43b729572beaa4f284a518", // Add your Pinata secret API key here
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        console.log(ImgHash);
        return ImgHash;
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=2549&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        }}
      >
        <div className="w-full h-full flex flex-col justify-end text-white p-12 bg-black/40">
          <h1 className="text-4xl font-bold mb-4">Solana Token Creator</h1>
          <p className="text-lg mb-2">Build your marketing strategy!</p>
          <p className="text-sm mb-10">
            Try all paid functions for free, just register and create your first widget. It's simple and fast.
          </p>
          <div className="flex gap-5">
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
        </div>
      </div>
      <div className="w-1/2 h-screen bg-stone-950 text-slate-300 flex justify-center items-center">
        <form
          className="space-y-6 bg-stone-900 p-10 rounded-lg shadow-lg w-[600px] border border-stone-800"
          onSubmit={createToken}
        >
          <h1 className="text-3xl font-bold text-center mb-6">Solana Token Creator</h1>
          <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-white/50 rounded-lg cursor-pointer">
            <label htmlFor="upload-image" className="flex flex-col items-center space-y-2">
              {imgPreview ? (
                <img src={imgPreview} alt="Selected" className="h-40 w-auto object-contain" />
              ) : (
                <>
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
                      d="M12 16.5v-5.25m0 0V4.5M12 11.25L9.75 9m2.25 2.25l2.25-2.25M12 16.5v-5.25M15.75 9l-3.75 3.75M6 19.5V17.25m12 0V19.5M12 19.5v-2.25M6 17.25A1.5 1.5 0 016 15V13.5a1.5 1.5 0 013 0V15m6 0v-1.5a1.5 1.5 0 113 0V15m-9 0a1.5 1.5 0 01-3 0v-1.5M6 13.5a1.5 1.5 0 013 0v1.5m6-1.5a1.5 1.5 0 113 0V15m-9-2.25A1.5 1.5 0 006 13.5V15a1.5 1.5 0 003 0V13.5m-9 0A1.5 1.5 0 016 13.5m0-7.5a1.5 1.5 0 113 0V9m0 0L9.75 12.75M12 9v2.25m0-2.25L15.75 6"
                    />
                  </svg>
                  <p className="text-white/50">Upload Image</p>
                </>
              )}
            </label>
            <input id="upload-image" type="file" onChange={handleImageUpload} className="hidden" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">Name</label>
            <input
              type="text"
              placeholder="Token Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full bg-stone-800 border border-stone-600 rounded-md py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">Symbol</label>
            <input
              type="text"
              placeholder="Token Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
              className="mt-1 block w-full bg-stone-800 border border-stone-600 rounded-md py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">Decimals</label>
            <input
              type="number"
              placeholder="Token Decimals"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              required
              className="mt-1 block w-full bg-stone-800 border border-stone-600 rounded-md py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">Amount</label>
            <input
              type="number"
              placeholder="Token Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 block w-full bg-stone-800 border border-stone-600 rounded-md py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">Description</label>
            <textarea
              placeholder="Token Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-stone-800 border border-stone-600 rounded-md py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? (
              <ClipLoader color="white" loading size={25} aria-label="Loading Spinner" data-testid="loader" />
            ) : (
              "Create Token"
            )}
          </button>
          {tokenAccountAddress && (
            <p className="text-gray-700 font-semibold mb-2">
              Your Token Account Address →{" "}
              <a
                href={`https://explorer.solana.com/address/${tokenAccountAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                click here to see on Solana Explorer
              </a>
            </p>
          )}
          {tokenAddress && (
            <p className="text-gray-700 font-semibold">
              Your Token Mint →{" "}
              <a
                href={`https://explorer.solana.com/address/${tokenAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                click here to see on Solana Explorer
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateToken;
