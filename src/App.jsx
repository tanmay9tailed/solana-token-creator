import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router";

export default function App() {
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(`/${path}`);
  };

  return (
    <>
      <div className="h-screen bg-gray-950 text-white">
        {/* Navbar */}
        <nav className="flex justify-between items-center p-6 fixed top-0 w-full bg-slate-900 z-50">
          <div className="text-3xl font-bold">SOLANA</div>
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
            >
              <option value="mainnet">Mainnet</option>
              <option value="devnet">Devnet</option>
              <option value="testnet">TestNet</option>
            </select>
            <WalletMultiButton />
          </div>
        </nav>

        {/* Hero Section */}
        <div id="home" className="grid grid-cols-2 gap-8 px-16 mt-12 h-full">
          <div className="h-full flex flex-col justify-center items-center">
            <div className="space-y-4">
              <h2 className="bg-purple-900/50 text-purple-400 font-bold inline-block px-4 py-2 rounded-lg">
                Create SOLANA Token 1.0.0
              </h2>
              <h1 className="text-5xl font-bold leading-snug">
                Now create Solana Token <br />
                <span className="text-purple-400">without code.</span>
              </h1>
              <p className="text-lg text-gray-400">
                Launch your Solana Token, All-in-one Solana token development and deployment.
              </p>
              <div className="flex items-center space-x-4 mt-6">
                <WalletMultiButton />
              </div>
            </div>
          </div>

          {/* Images Gallery */}
          <div className="grid grid-cols-2 gap-4 overflow-hidden h-screen">
            {/* Left Column with Scrolling Animation */}
            <div className="space-y-3 animate-scrollleft">
              {/* Add your image URLs here */}
              <img
                src="https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=2549&auto=format&fit=crop"
                alt="butterfly"
                className="rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=2549&auto=format&fit=crop"
                alt="butterfly"
                className="rounded-lg"
              />
              {/* More images as needed */}
            </div>

            {/* Right Column with Scrolling Animation */}
            <div className="space-y-3 animate-scrollright">
              <img
                src="https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=2549&auto=format&fit=crop"
                alt="butterfly"
                className="rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=2549&auto=format&fit=crop"
                alt="butterfly"
                className="rounded-lg"
              />
              {/* More images as needed */}
            </div>
          </div>

          {/* Tailwind Custom Animation */}
          <style jsx>{`
            @keyframes scrollleft {
              0% {
                transform: translateY(0%);
              }
              100% {
                transform: translateY(-100%);
              }
            }
            @keyframes scrollright {
              0% {
                transform: translateY(-80%);
              }
              100% {
                transform: translateY(0%);
              }
            }
            .animate-scrollleft {
              animation: scrollleft 200s linear infinite;
            }
            .animate-scrollright {
              animation: scrollright 200s linear infinite;
            }
          `}</style>
        </div>

        {/* Tools Section */}
        <div id="tools" className="bg-gray-950 text-white py-16 px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Solana Powerful Tools</h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">
            Start working with Solana Token Creator. It allows you to create Solana tokens by creating, deploying,
            airdropping, transferring, and updating metadata.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <ToolCard
              title="Create Token"
              path="create-token"
              description="Easily create your own Solana token without coding."
            />
            <ToolCard
              title="Token Metadata"
              path="token-metadata"
              description="Manage and update your token's metadata."
            />
            <ToolCard title="Airdrop" path="airdrop" description="Distribute tokens to multiple users effortlessly." />
            <ToolCard
              title="Send Transaction"
              path="send-transaction"
              description="Send transactions securely and quickly."
            />
          </div>

          <div className="text-center mt-8">
            <button
              className="bg-purple-600 py-2 px-6 rounded-full hover:bg-purple-700"
              onClick={() => alert("Coming soon...")}
            >
              More Tools →
            </button>
          </div>
        </div>

        {/* Buy Me A Coffee Section */}
        <div id="buy-me-a-coffee" className="flex flex-col items-center justify-center pt-12 px-16 bg-gray-950">
          <h2 className="bg-purple-900/50 text-purple-400 font-bold inline-block px-4 py-2 rounded-lg">
            Support My Work
          </h2>
          <h1 className="text-4xl font-bold leading-snug text-center mt-4">
            Enjoying the content? <br />
            <span className="text-purple-400">Buy me a coffee!</span>
          </h1>
          <p className="text-lg text-gray-400 text-center mt-2">
            Your support helps me create more amazing content and projects. Thank you!
          </p>

          <div className="mt-6">
              <button className="bg-gray-800 py-3 px-6 rounded-full hover:bg-gray-700 transition duration-300 flex justify-center items-center" onClick={() => navigate("/send-transaction")}>
                Buy Me a Coffee
                <img
                  src="https://play-lh.googleusercontent.com/aMb_Qiolzkq8OxtQZ3Af2j8Zsp-ZZcNetR9O4xSjxH94gMA5c5gpRVbpg-3f_0L7vlo"
                  alt="coffee"
                  className="w-8 h-8 rounded-3xl ml-4"
                />
              </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-gray-950 text-white py-16 px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">What is Solana?</h3>
              <p className="text-gray-400">
                Solana is a highly performant blockchain supporting builders around the world creating decentralized
                apps (dApps).
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">How do I create a Solana Token?</h3>
              <p className="text-gray-400">
                You can create Solana Tokens easily using our platform without needing to write code. Just follow the
                steps provided in the "Create" section.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                What is the difference between Mainnet, Devnet, and Testnet?
              </h3>
              <p className="text-gray-400">
                Mainnet is the live network, Devnet is for developers to test dApps, and Testnet is used for testing new
                features before moving to the mainnet.
              </p>
            </div>
          </div>

          {/* Ask a Question Form */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Ask Me Anything</h2>
            <form className="bg-gray-800 p-6 rounded-lg">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-400 mb-2">
                  Name:
                </label>
                <input type="text" id="name" className="w-full bg-gray-900 p-3 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-400 mb-2">
                  Email:
                </label>
                <input type="email" id="email" className="w-full bg-gray-900 p-3 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="question" className="block text-gray-400 mb-2">
                  Your Question:
                </label>
                <textarea id="question" rows="4" className="w-full bg-gray-900 p-3 rounded"></textarea>
              </div>
              <button
                type="submit"
                className="bg-purple-600 py-2 px-6 rounded-full hover:bg-purple-700 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function ToolCard({ title, path, description }) {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <button
        className="bg-purple-600 py-2 px-4 rounded-full hover:bg-purple-700"
        onClick={() => navigate(`/${path}`)}
      >
        Use this -&gt;
      </button>
    </div>
  );
}
