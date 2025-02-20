
import PricePerToken from "./PricePerToken";
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
import Spinner from "./Spinner";
import { ethers } from "ethers";
import proofsData from "../hooks/proofs.json"; // Import the proofs JSON file

export default function Section1() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useWeb3Modal();
  const { isConnected, address } = useWeb3ModalAccount();
  const [paymenType, setPaymentType] = useState("ETH");
  const [amount, setAmount] = useState();
  const [receiveable, setReceiveable] = useState();
  const [loadingAirdrop, setLoadingAirdrop] = useState(false);
  const [loadingReferral, setLoadingReferral] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [balance, setBalance] = useState(0);
  const [maxBalance, setMaxBalance] = useState(null);
  const [price, setPrice] = useState(0);

  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");

  const { buy, myTokenBalance, maxBalances, getPrice, claimTokens, claimAirdropTokens } = useContract();


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



  const handleAirdropClaim = async () => {
    if (!proofDetails) {
      toast.error("No proof available for this address.");
      return;
    }

    const { proof, amount } = proofDetails;

    // Convert amount to BigInt
    const claimAmount = ethers.toBigInt(amount);

    setLoading(true);
    try {
      await claimAirdropTokens(proof, claimAmount); // Call the contract function with proof and claimAmount
      toast.success("Airdrop claimed successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error claiming airdrop:", err);
      toast.error("Failed to claim airdrop.");
    }
    setLoading(false);
  };


  const [activeIndex, setActiveIndex] = useState(null);
  // Toggle answer visibility
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Close if already open
  };






  const [error, setError] = useState(null); // State for any errors

  const { getPresaleAllocation, getAirdropAllocation, getreferAllocation } = useContract();
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
          "https://rpc.ankr.com/base"
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

  // State for managing accordion open/close
  const [openSection, setOpenSection] = useState(1);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };










  const handleClaimTokens = async () => {
    setLoadingTokens(true)
    try {
      await claimTokens();
      toast.success("Claim Sucessful");
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Error Claiming");
      setLoading(false);

    }
    setLoadingTokens(false)
  }



  const [proofDetails, setProofDetails] = useState(null); // Proof details from JSON


  // Match connected wallet address with JSON data
  useEffect(() => {
    if (!isConnected || !address) return;

    // Find proof for the connected wallet address
    const proofForAddress = proofsData[address];
    if (proofForAddress) {
      setProofDetails(proofForAddress);
    } else {
      setError("No airdrop allocation found for this address.");
    }
  }, [isConnected, address]);


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








  const { getAirdropUserData } = useContract();



  const [airdropData, setAirdropData] = useState({
    token_balance: 0,
    claimed_token: 0,
  });



  useEffect(() => {
    const fetchAirdropData = async () => {
      const data = await getAirdropUserData();
      setAirdropData(data);
    };

    if (isConnected && address) {
      fetchAirdropData();
    }
  }, [isConnected, address]);




  const { claimReferralRewards } = useContract();


  const handleClaimReferral = async () => {
    setLoadingReferral(true);
    try {
      await claimReferralRewards();
      toast.success("Referral rewards claimed successfully!");
      window.location.reload();  // Reload to update balance
    } catch (err) {
      console.error("Error claiming referral rewards:", err);
      toast.error("Failed to claim referral rewards.");
    }
    setLoadingReferral(false);
  };


  const handlePaymentTypechange = (type) => {
    setPaymentType(type);
    setAmount(0);
    setReceiveable(0);
  };

  return (
    <div
      style={{ backgroundImage: "url(/section-1-bg.png)" }}
      className="bg-cover h-full"

      id="claimtoken"


    >
      <div className="relative">
        <div className="w-full flex justify-center">
          <PricePerToken />
        </div>
      </div>
      <div className="flex justify-center pb-20">
        <div className="w-full max-w-[1145px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 lg:px-0">


          <div className="col-span-1">
            <div className="bg-white box-shadow rounded-[10px] p-4 lg:p-[30px] border-[4px] border-[#212529]">
              <div className="flex justify-center">
                <img src="/claim-airdrop.png" alt="" />
              </div>
              <h2 className="font-alfa text-[18px] lg:text-[22px] text-[#212529] text-center">
                Claim Your Airdrop
              </h2>
              <p className="text-center mt-[20px] lg:mt-[35px] font-dynapuff text-[#212529]">
                Your Airdrop Tokens Amount
              </p>

              <div className="balance-display">
                {proofDetails && airdropData ? (
                  <span
                    className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[29px] text-black"
                    style={{ fontSize: "40px" }}
                  >
                    {proofDetails.amount
                      ? ((proofDetails.amount / 1e18) - airdropData.claimed_token).toFixed(0)
                      : <div className="flex justify-center">

                      </div>}
                  </span>
                ) : (
                  <div className="flex justify-center">
                    <div className="flex gap-4 text-[#212529]">
                      <div className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[40px]">0</div>
                      <div className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[40px]">0</div>
                      <div className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[40px]">0</div>
                    </div>
                  </div>
                )}
              </div>



              <button
                className={`text-white bg-[#3A80FE] py-2 w-full rounded-[5px] mt-[20px] lg:mt-[25px] font-semibold relative flex items-center justify-center`}
                onClick={isConnected ? handleAirdropClaim : () => open("Connect")}
                disabled={loading}
              >
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner size={20} />
                  </div>
                )}
                <span className={`${loading ? "opacity-50" : ""}`}>
                  {isConnected ? "CLAIM AIRDROP" : "CONNECT"}
                </span>
              </button>
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-white box-shadow rounded-[10px] p-4 lg:p-[30px] border-[4px] border-[#212529]">
              <div className="flex justify-center">
                <img src="/generate.png" alt="" />
              </div>
              <h2 className="font-alfa text-[18px] lg:text-[22px] text-[#15447E] text-center">
                Claim Your Referral
              </h2>
              <p className="text-center mt-[20px] lg:mt-[35px] font-dynapuff text-[#212529]">
                Your Referral Tokens
              </p>


              <div className="balance-display">
                {referUnclaimedTokens ? (
                  <span className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[29px] text-black" style={{ fontSize: "40px" }} >{referUnclaimedTokens}</span>
                ) : (
                  <div className="flex justify-center">
                    <div className="flex gap-4 text-[#212529]">
                      <div className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[40px] ">
                        0
                      </div>
                      <div className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[40px]">
                        0
                      </div>
                      <div className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[40px]">
                        0
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                className={`text-white bg-[#3A80FE] py-2 w-full rounded-[5px] mt-[20px] lg:mt-[25px] font-semibold relative flex items-center justify-center`}
                onClick={isConnected ? handleClaimReferral : () => open("Connect")}
                disabled={loadingReferral}
              >
                {loadingReferral && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner size={20} />
                  </div>
                )}
                <span className={`${loadingReferral ? "opacity-50" : ""}`}>
                  {isConnected ? "CLAIM REFERRAL" : "CONNECT"}
                </span>
              </button>
            </div>
          </div>




          <div className="col-span-1">
            <div className="bg-white box-shadow rounded-[10px] p-4 lg:p-[30px] border-[4px] border-[#212529]">
              <div className="flex justify-center">
                <img src="/claim-token.png" alt="" />
              </div>
              <h2 className="font-alfa text-[18px] lg:text-[22px] text-[#15447E] text-center">
                Claim Your Tokens
              </h2>
              <p className="text-center mt-[20px] lg:mt-[35px] font-dynapuff text-[#212529]">
                Your Total Tokens Amount
              </p>

              <div className="balance-display">
                {unclaimedTokens ? (
                  <span className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[29px] text-black" style={{ fontSize: "40px" }} >{unclaimedTokens}</span>
                ) : (
                  <div className="flex justify-center">
                    <div className="flex gap-4 text-[#212529]">
                      <div className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[40px]">
                        0
                      </div>
                      <div className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[40px]">
                        0
                      </div>
                      <div className="underline underline-offset-4 font-dynapuff text-[24px] lg:text-[40px]">
                        0
                      </div>
                    </div>
                  </div>
                )}
              </div>




              <button
                className={`text-white bg-[#3A80FE] py-2 w-full rounded-[5px] mt-[20px] lg:mt-[25px] font-semibold relative flex items-center justify-center`}
                onClick={isConnected ? handleClaimTokens : () => open("Connect")}
                disabled={loadingTokens}
              >
                {loadingTokens && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner size={20} />
                  </div>
                )}
                <span className={`${loadingTokens ? "opacity-50" : ""}`}>
                  {isConnected ? " CLAIM TOKENS" : "CONNECT"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}
