import RoutesFile from "./RoutesFile";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
// 1. Get projectId
const projectId = "45a0e6f0ec40c32ea865faa6d7000f5e";

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://rpc.sepolia.org",
  rpcUrl: "https://1rpc.io/sepolia",
};

const Arbitrum = {
  chainId: 42161,
  name: "Arbitrum",
  currency: "ETH",
  explorerUrl: "https://explorer.arbitrum.io/",
  rpcUrl: "https://rpc.ankr.com/arbitrum",
};
const basemainnet = {
  chainId: 8453,
  name: "Base Mainnet",
  currency: "ETH",
  explorerUrl: "https://basescan.org/",
  rpcUrl: "https://rpc.ankr.com/base",
};
// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [basemainnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});
function App() {
  return (
    <>
      <RoutesFile />
      <ToastContainer />
      {/* <Roadmap/> */}
    </>
  );
}

export default App;
