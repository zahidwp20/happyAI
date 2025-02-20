import React, { useEffect, useState } from "react";


import { format } from "mathjs";
import styled from "styled-components";
import CountdownTimer from "./CountDown";
import { toast } from "react-toastify";
import { PER_USDT_TO_BNB } from "../contracts/contracts";
import useContract from "../hooks/useContract";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useWeb3Modal } from "@web3modal/ethers/react";
import ClipLoader from "react-spinners/ClipLoader";
import { FaTelegramPlane, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import CopyToClipboardButton from "./CoppyBtn";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { PRESALE_CONTRACT_ADDRESS, PRESALE_ABI } from "../contracts/contracts";

import { ethers } from "ethers";


import ETH from "./icons/ETH";
import USDT from "./icons/USDT";
import USDC from "./icons/USDC";


export default function PricePerToken() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { open } = useWeb3Modal();
    const { isConnected, address } = useWeb3ModalAccount();
    const [paymenType, setPaymentType] = useState("ETH");
    const [amount, setAmount] = useState();
    const [receiveable, setReceiveable] = useState();
  
    const [balance, setBalance] = useState(0);
    const [maxBalance, setMaxBalance] = useState(null);
    const [price, setPrice] = useState(0);
  
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#ffffff");
  
    const { buy, myTokenBalance, maxBalances, getPrice ,claimTokens,claimAirdropTokens} = useContract();
  
  
    useEffect(() => {
      const _getPrice = async () => {
        const _price = await getPrice();
        console.log("Price fetched in MainPage:", _price);
        setPrice(_price || 0); // Set price or fallback to 0
      };
    
      _getPrice(); // Call it on load
    }, []); // Remove `isConnected` dependency to fetch even if not connected
    
  
    const handlePaymentChange = (e) => {
      const precision = 15; // Precision for calculations
  
      const formatValue = (value) => {
        if (Math.abs(value) < 1e-6) {
          // For very small values, use fixed-point notation with high precision
          return value.toFixed(precision);
        }
        return parseFloat(value.toFixed(precision)); // Trim trailing zeros for normal values
      };
  
      const inputName = e.target.name;
      const inputValue = e.target.value;
  
      if (inputName === "amount") {
        setAmount(inputValue); // Store raw input as string
        const numericValue = parseFloat(inputValue);
        if (!isNaN(numericValue)) {
          if (paymenType === "ETH") {
            const value = numericValue * price * PER_USDT_TO_BNB;
            setReceiveable(formatValue(value).toString());
          } else if (paymenType === "USDT") {
            const value = numericValue * price;
            setReceiveable(formatValue(value).toString());
          } else if (paymenType === "USDC") {
            const value = numericValue * price;
            setReceiveable(formatValue(value).toString());
          }
        }
      } else if (inputName === "receiveable") {
        setReceiveable(inputValue); // Store raw input as string
        const numericValue = parseFloat(inputValue);
        if (!isNaN(numericValue)) {
          if (paymenType === "ETH") {
            const value = numericValue / price / PER_USDT_TO_BNB;
            setAmount(formatValue(value).toString());
          } else if (paymenType === "USDT") {
            const value = numericValue / price;
            setAmount(formatValue(value).toString());
          } else if (paymenType === "USDC") {
            const value = numericValue / price;
            setAmount(formatValue(value).toString());
          }
        }
      }
    };
    useEffect(() => {
      const _balance = async () => {
        const _myBalance = await myTokenBalance();
        console.log(_myBalance);
        setBalance(_myBalance);
        const _maxBalance = await maxBalances();
        console.log(_maxBalance);
        setMaxBalance(_maxBalance);
      };
      if (address) _balance();
    }, [address]);
  
    
    const [referrer, setReferrer] = useState(null); // State for storing referrer
  
  
    useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const ref = queryParams.get("ref");
      if (ref) {
        setReferrer(ref); // Store the referrer address
      }
    }, []);
    const referralLink = `${window.location.origin}?ref=${address}`;
  
  
  
 
  
  
    const [activeIndex, setActiveIndex] = useState(null);
  // Toggle answer visibility
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Close if already open
  };
  
  
  
  
  
  
  const [error, setError] = useState(null); // State for any errors
  
  const { getPresaleAllocation,getAirdropAllocation,getreferAllocation } = useContract();
  const [unclaimedTokens, setUnclaimedTokens] = useState(null);
  
  useEffect(() => {
    const fetchUnclaimedTokens = async () => {
      try {
        const allocation = await getPresaleAllocation();
        setUnclaimedTokens(allocation);
      } catch (error) {
        console.error("Error fetching unclaimed tokens:", error.message || error);
        setError(error.message || "Failed to fetch unclaimed tokens.");
      }
    };
  
    fetchUnclaimedTokens();
  }, [getPresaleAllocation]);
  
  
  const [airdropUnclaimedTokens, setAirdropUnclaimedTokens] = useState(null);
  
  useEffect(() => {
    const fetchAirdropUnclaimedTokens = async () => {
      try {
        const allocation = await getAirdropAllocation();
        setAirdropUnclaimedTokens(allocation);
      } catch (error) {
        console.error("Error fetching unclaimed tokens:", error.message || error);
        setError(error.message || "Failed to fetch unclaimed tokens.");
      }
    };
  
    fetchAirdropUnclaimedTokens();
  }, [getAirdropAllocation]);
  
  
  
  const [referUnclaimedTokens, setReferUnclaimedTokens] = useState(null);
  useEffect(() => {
    const fetchfereUnclaimedTokens = async () => {
      try {
        const allocation = await getreferAllocation();
        setReferUnclaimedTokens(allocation);
      } catch (error) {
        console.error("Error fetching unclaimed tokens:", error.message || error);
        setError(error.message || "Failed to fetch unclaimed tokens.");
      }
    };
  
    fetchfereUnclaimedTokens();
  }, [getreferAllocation]);
  
  
  
  
  const [pricePerToken, setPricePerToken] = useState(null); // State for token price
  const [tokensPerUSDT, setTokensFor1USD] = useState(null); // State for tokens per 1 USDT
  
  useEffect(() => {
      const fetchTokenPrices = async () => {
        try {
          console.log("Connecting to provider...");
          // Connect to the Ethereum network using a public RPC provider
          const provider = new ethers.JsonRpcProvider(
            "https://arbitrum-mainnet.infura.io/v3/9dbc6e2f99d34b13981fcdbaadf67f09"
          );
  
          // Create a contract instance
          const contract = new ethers.Contract(
            PRESALE_CONTRACT_ADDRESS,
            PRESALE_ABI,
            provider
          );
  
          console.log("Fetching perDollarPrice...");
          // Call the `perDollarPrice` function from the contract
          const perDollarPrice = await contract.perDollarPrice();
          console.log("Raw perDollarPrice fetched:", perDollarPrice.toString());
  
          // Assuming perDollarPrice has 18 decimals, format it correctly
          const decimals = 18;
          const formattedPrice = ethers.formatUnits(perDollarPrice, decimals);
          console.log("Formatted perDollarPrice:", formattedPrice);
        
          const formattedPriceNum = parseFloat(formattedPrice);
          // Calculate price per token (1 / perDollarPrice in USD)
          const tokenPriceInUSD = (1 / formattedPrice).toFixed(4); // Keep 6 decimal places
          setPricePerToken(tokenPriceInUSD);
  
  
               // Calculate how many tokens are equivalent to 1 USD (which is the value of perDollarPrice)
        const tokensPer1USD = formattedPriceNum; // perDollarPrice directly gives tokens per 1 USD
        setTokensFor1USD(tokensPer1USD.toFixed(0)); // Update the state with the calculated value
  
           // Calculate how many tokens are equivalent to 1 USDT
          // Tokens per 1 USDT = 1 / perDollarPrice
    // Calculate how many tokens are equivalent to 1 USDT
  
  
        } catch (err) {
          console.error("Error fetching prices:", err.message);
          setError("Failed to fetch token price. Please try again later.");
        }
      };
  
      fetchTokenPrices();
    }, []);
  
  
  
  
  
  
  
  
  
    
  
      
        // State for managing accordion open/close
    const [openSection, setOpenSection] = useState(1);
  
    const toggleSection = (section) => {
      setOpenSection(openSection === section ? null : section);
    };
  
  
  
  
  
  
  
  
  
  
    const handleClaimTokens = async () => {
      try {
        await claimTokens();
        toast.success("Claim Sucessful");
        window.location.reload();
      } catch (err) {
        console.log(err);
        toast.error("Error Claiming");
        setLoading(false);
      }
    }
  
  
  
    
    const handleAirdropClaimTokens = async () => {
      try {
        await claimAirdropTokens();
        toast.success("Claim Sucessful");
        window.location.reload();
      } catch (err) {
        console.log(err);
        toast.error("Error Claiming");
        setLoading(false);
      }
    }
  
  
  
    const handleBuy = async () => {
      setLoading(true);
    
      // Check balances based on payment type
      if (paymenType === "ETH") {
        if (amount > maxBalance.eth) {
          toast.error("Not enough ETH balance");
          setLoading(false);
          return;
        }
      } else if (paymenType === "USDT") {
        if (amount > maxBalance.usdt) {
          toast.error("Not enough USDT balance");
          setLoading(false);
          return;
        }
      } else if (paymenType === "USDC") {
        if (amount > maxBalance.usdc) {
          toast.error("Not enough USDC balance");
          setLoading(false);
          return;
        }
      }
    
      // Check if a referer is provided, otherwise default to the zero address
      const refererAddress = referrer || "0x0000000000000000000000000000000000000000";
    
      try {
        // Call the buy function with the referer address
        await buy(paymenType, amount, refererAddress);
        toast.success("Buy Successful");
        window.location.reload();  // Refresh the page or trigger UI updates as needed
      } catch (err) {
        console.error("Error during buy:", err);
        toast.error("Error in Buying");
      }
    
      setLoading(false);
    };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    const handlePaymentTypechange = (type) => {
      setPaymentType(type);
      setAmount(0);
      setReceiveable(0);
    };
  
  return (
    <div className="flex justify-center relative my-10 sm:my-20">
      <div className="relative w-full max-w-[1145px] bg-gray-100 box-shadow rounded-[16px] py-[32px] sm:py-[64px] px-4 sm:px-[92px]">
        <div className="absolute bottom-0 right-0 sm:w-[200px] w-[100px]">
          {/* Image size is adjusted based on screen size */}
          <img src="price-per-token-cartoon.png" alt="cartoon" className="w-full h-auto" />
        </div>
        <div className="rounded-[30px] bg-[#F1F8FF]">
          <h1 className="text-[#3A80FE] text-[20px] sm:text-[24px] font-medium font-dynapuff text-center">
            Price Per Token: $0.0002 USD 1USD = 5000 $HAPPYGUY
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-8 mt-10 items-center">
            {/* Section 1 */}
            <div className="col-span-1">
              <div
                className="p-[30px] sm:p-[45px] bg-no-repeat bg-cover bg-center rounded-[20px]"
                style={{ backgroundImage: "url(/count-down-bg.png)" }}
              >
                <h4 className="text-center text-[18px] sm:text-[24px] font-semibold text-white">
                  Presale Starts In:
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 mt-[20px] sm:mt-[38px]">
                  <div className="col-span-1 flex flex-col items-center">
                    <div
                      className="flex justify-center items-center h-[56px] sm:h-[76px] w-[56px] sm:w-[76px] text-[#15447E] text-[24px] sm:text-[30px] font-medium"
                      style={{ backgroundImage: "url(/step-bg.svg)" }}
                    >
                      0
                    </div>
                    <div className="text-center mt-[15px] text-white font-semibold">
                      days
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col items-center">
                    <div
                      className="flex justify-center items-center h-[56px] sm:h-[76px] w-[56px] sm:w-[76px] text-[#15447E] text-[24px] sm:text-[30px] font-medium"
                      style={{ backgroundImage: "url(/step-bg.svg)" }}
                    >
                      0
                    </div>
                    <div className="text-center mt-[15px] text-white font-semibold">
                      hours
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col items-center">
                    <div
                      className="flex justify-center items-center h-[56px] sm:h-[76px] w-[56px] sm:w-[76px] text-[#15447E] text-[24px] sm:text-[30px] font-medium"
                      style={{ backgroundImage: "url(/step-bg.svg)" }}
                    >
                      0
                    </div>
                    <div className="text-center mt-[15px] text-white font-semibold">
                      minutes
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col items-center">
                    <div
                      className="flex justify-center items-center h-[56px] sm:h-[76px] w-[56px] sm:w-[76px] text-[#15447E] text-[24px] sm:text-[30px] font-medium"
                      style={{ backgroundImage: "url(/step-bg.svg)" }}
                    >
                      0
                    </div>
                    <div className="text-center mt-[15px] text-white font-semibold">
                      seconds
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center relative my-10 sm:my-20">
      <div className="relative w-full max-w-[1145px] bg-gray-100 box-shadow rounded-[16px] py-[32px] sm:py-[64px] px-4 sm:px-[92px]">
        {/* Payment Type Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handlePaymentTypechange("ETH")}
            className={`${
              paymenType === "ETH" ? "bg-blue-500 text-white" : "bg-gray-200"
            } py-2 px-4 rounded`}
          >
           <div className="flex justify-center items-center">
                  <ETH />
                </div>
          </button>
          <button
            onClick={() => handlePaymentTypechange("USDT")}
            className={`${
              paymenType === "USDT" ? "bg-blue-500 text-white" : "bg-gray-200"
            } py-2 px-4 rounded`}
          >
           <div className="flex justify-center items-center">
                  <ETH />
                </div>
          </button>
          <button
            onClick={() => handlePaymentTypechange("USDC")}
            className={`${
              paymenType === "USDC" ? "bg-blue-500 text-white" : "bg-gray-200"
            } py-2 px-4 rounded`}
          >
            <div className="flex justify-center items-center">
                  <ETH />
                </div>
          </button>
        </div>
           
        {/* Payment Form */}
        <form className="mt-5">
          <div className="flex flex-col gap-4">
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={handlePaymentChange}
              placeholder={`Enter ${paymenType} amount`}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="receiveable"
              value={receiveable}
              onChange={handlePaymentChange}
              placeholder="Tokens you will receive"
              className="border p-2 rounded"
            />
          </div>
          <button
            type="button"
            onClick={handleBuy}
            className="bg-blue-500 text-white mt-4 py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy Tokens"}
          </button>
        </form>
      </div>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
}
