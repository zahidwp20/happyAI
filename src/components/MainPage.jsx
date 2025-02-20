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



import Carousel from "./Marque";
import Section1 from "./Section1";
import Header from "./Header";
import BuyToken from "./icons/BuyToken";
import HeroImage from "./icons/HeroImage";
import Logo from "./icons/Logo";
import { Link } from "react-router-dom";
import HappyAi from "./HappyAi";
import { ethers } from "ethers";
import TokenomicSection from "./TokenomicSection";
import WhyChoose from "./WhyChoose";
import PlanSection from "./PlanSection";
import RoadMap from "./RoadMapHappy";
import Footer from "./Footer";
import Embark from "./Embark";
import FAQ from "./FAQ";
// import { FaTelegramPlane } from "react-icons/fa";
// import { FaDiscord } from "react-icons/fa";
// import { FaTwitter } from "react-icons/fa";
// import Iconslink from "../assets/Linktree-Emblem-removebg-preview.png";
// import Roadmap from "../assets/RMupdate.jpg";
// import AutoSlider from "./AutoSlider.js";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const HeroSection = styled.section`
  display: flex;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1em;
    width: 95%;
    margin: auto;
    margin-top: 3em;
  }

  .left {
    width: 60%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(171, 130, 171, 0.2),
      rgba(88, 133, 191, 0.2),
      rgba(102, 125, 111, 0.2)
    );
    border: 1px solid rgba(68, 68, 68, 1);
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: flex-start;

    @media (max-width: 768px) {
      width: 100%;
    }
    .main-heading {
      flex-wrap: wrap;
    }

    .live {
      background: linear-gradient(
        90deg,
        #ce89ca 0%,
        #5885bf 33.33%,
        #7258df 66.67%,
        #75eea3 100%
      );
      clip-path: polygon(
        0% 1em,
        1em 0%,
        100% 0%,
        100% calc(100% - 1em),
        calc(100% - 1em) 100%,
        0 100%
      );
      color: #fff;
      font-size: 0.875rem;
      letter-spacing: 0.02857em;
      min-width: 64px;
      padding: 8px 10px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 1rem;

      i {
        margin-right: 0.2rem;
      }

      .icon {
        border-radius: 50%;
        padding: 0.2rem;
        margin-right: 0.2rem;
      }
    }

    .live:hover {
      transform: scale(1.05);
    }
    .presale-details {
      display: flex;
      flex-direction: column;
      gap: 0.2em;
      padding: 0rem 1rem 1rem 1rem;

      p {
        font-size: 16px;
        font-weight: 400;
        line-height: 28px;
      }

      .token {
        color: #fff;
        background: rgba(255, 255, 255, 0.3);
        padding: 0.1rem 0.5rem;
        border-radius: 2rem;
        font-weight: 500;
        font-size: 0.875rem;
        min-width: 64px;
        text-align: center;
      }
    }

    h1 {
      text-transform: none;
      font-size: 60px;
      font-weight: 800;
      color: #fff;
    }

    p {
      font-size: 24px;
      font-weight: 500;
    }
  }

  .right {
    width: 35%;
    margin: auto;
    display: flex;
    justify-content: flex-start;
    border: 2px solid black;
    background: linear-gradient(
      to right,
      rgba(171, 130, 171, 0.2),
      rgba(88, 133, 191, 0.2),
      rgba(102, 125, 111, 0.2)
    );
    border: 0;

    flex-direction: column;
    color: #fff;

    @media (max-width: 768px) {
      width: 100%;
      margin-top: 2em;
    }

    h2 {
      font-size: 30px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .timer {
      color: #fff;
      font-size: 20px;
      font-weight: 900;
    }

    .details {
      margin: 56px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-weight: 700;
      font-size: 20px;
    }

    .count {
      font-weight: 700;
      font-size: 20px;
      padding-bottom: 16px;
    }

    .contribute {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-weight: 600;
        font-size: 16px;
      }

      select {
        border: 2px solid #444444;
        padding: 8px;
        color: white;
        background: none;
        font-size: 16px;
        width: 30%;
        border-radius: 8px;
      }
    }

    .amount {
      margin: 15px 0;
      input {
        border: 2px solid #444444;
        padding: 12px;
        font-size: 16px;
        width: 100%;
        background: none;
        border-radius: 8px;
        color: white;
      }
    }

    .total {
      padding: 12px 0;
      font-weight: 700;
      font-size: 20px;
    }

    .buy_btn {
      background: linear-gradient(
        90deg,
        #ce89ca 0%,
        #5885bf 33.33%,
        #7258df 66.67%,
        #75eea3 100%
      );
      color: white;
      font-weight: bold;
      padding: 20px 20px;
      border: none;
      border: 1.02px solid rgba(255, 255, 255, 1);
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.3s ease;

      font-family: Montserrat;
      font-size: 20px;
      font-weight: 600;
      line-height: 19.5px;
      letter-spacing: -0.02em;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }
    .buy_btn.disabled {
      background: #999999;
      color: white;
    }
  }
`;



const MainPage = () => {
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



  const PHASES = [
    {
      question: "Why did we create 'HAPPYGUY'?",
      answer: "HAPPYGUY was created as a unique meme coin with a mission to break away from the repetitive nature of other meme coins. We wanted to create something truly innovative, bringing a blend of humor, AI technology, and community-driven development. With a solid vision to build something with lasting impact, we combined transparency, security, and trust into our core values. Our team is KYC verified, SAFU verified, and we’ve undergone a comprehensive audit. We’re committed to making HAPPYGUY a globally recognized name in the crypto community!"
    },
    {
      question: "Is the contract renounced?",
      answer: "YES, the contract is renounced to ensure security and prevent any future changes from the team."
    },
    {
      question: "Are team tokens locked?",
      answer: "YES, the team tokens are locked for 365 days to ensure transparency and trust."
    },
    {
      question: "Are the liquidity pools locked?",
      answer: "YES, the liquidity pools are locked for 10 years to provide stability for the community."
    },
    {
      question: "Is the team KYC verified?",
      answer: "YES, our team is fully KYC verified to establish trust and transparency."
    },
    {
      question: "Is the project SAFU?",
      answer: "YES, HAPPYGUY is SAFU verified for 10 years, ensuring the safety of user funds."
    },
    {
      question: "Is the contract audited?",
      answer: "YES, the contract has undergone a thorough audit to guarantee its security and reliability."
    },
    {
      question: "Is the team located in the United States?",
      answer: "YES, our team is based in the United States, working with the highest standards of professionalism."
    },
    {
      question: "Is the chatbot available to everyone?",
      answer: "Yes, the chatbot will be available in our Telegram group for free and on our website for verified holders."
    },
    {
      question: "Is the AI image generator available to everyone?",
      answer: "Yes, the AI image generator will be available in our Telegram group for free and on our website for verified holders."
    },
    {
      question: "Is the AI video generator available to everyone?",
      answer: "No, the AI video generator will be exclusive to verified holders."
    },
    {
      question: "Is the mini-game available to everyone?",
      answer: "Yes, the mini-game will be available in our Telegram group for free and on our website for verified holders."
    },
    {
      question: "Is the meme generator available to everyone?",
      answer: "YES, the meme generator will be available to all users."
    },
    {
      question: "Is the soundboard available to everyone?",
      answer: "YES, the soundboard will be available to all users."
    },
    {
      question: "Can we stake our HAPPYGUY Tokens?",
      answer: "YES, staking HAPPYGUY tokens will be available to all users, allowing you to earn additional rewards."
    },
    {
      question: "Is there a penalty for un-staking early?",
      answer: "Yes, there is a 25% penalty for un-staking early. We want to ensure that only committed holders benefit from staking rewards."
    },
    {
      question: "Is there a buy and sell tax?",
      answer: "NO! HAPPYGUY operates with a 0% tax on both buy and sell transactions."
    },
    {
      question: "Is CharlieSwap available to everyone?",
      answer: "YES, CharlieSwap will be available for all users to swap and trade HAPPYGUY tokens."
    },
    {
      question: "Are we committed to the longevity of the project?",
      answer: "1000% Yes! We’re here for the long run. Our goal is to create a lasting impact in the meme coin space and beyond. We’re committed to building a community-driven project that will thrive across multiple bull and bear cycles!"
    },
    {
      question: "What are governance and launchpad tokens?",
      answer: "Governance tokens provide voting rights, allowing holders to influence key decisions in the project. Launchpad tokens grant access to presales and special events within the project ecosystem."
    },
    {
      question: "How do I earn ‘governance’ and ‘launchpad’ tokens?",
      answer: "You can earn governance tokens by staking HAPPYGUY. Launchpad tokens are earned by participating in staking and community events."
    }
  ];
  


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
    <>
      
      <div
      className="min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url(/hero-bg.png)" }}
    >
      {/* Hero Section Content */}
      <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-10 mt-[80px] md:mt-[78px] max-w-[1145px]">
        
        {/* Left Content */}
        <div className="mt-[80px] md:mt-[155px] text-center md:text-left">
          <h1 className="text-5xl md:text-[80px] text-[#15447E] font-luckiest-guy">
            Just a Happy Guy AI
          </h1>
          <p className="text-[#15447E] mt-[15px] md:mt-[30px] max-w-[650px] text-base md:text-lg">
          Just a Happy Guy AI is the mascot of Finch AI trading helper AI agent by Aigisos. With over 150,000 users we are bringing a positive change to crypto with AI powered tailored trading suggestions
          </p>

          {/* Buy Token Button */}
          <div className="mt-[15px] md:mt-[30px] inline-block">
            <a href="#claimtoken" >
              <BuyToken />
            </a>
          </div>

          {/* Three Styled Buttons */}
          <div className="mt-[80px] flex flex-col md:flex-row items-center justify-center w-full gap-6 md:gap-12">
  <a href="https://finch.aidx.exchange/" target="_blank" rel="noopener noreferrer">
    <button className="w-[300px] h-auto p-2 border-2 border-[#4A90E2] text-lg font-semibold rounded-lg bg-[#4A90E2] text-white">
      Access Just a Happy Guy AI dashboard
    </button>
  </a>
  <a href="https://finch.aidx.exchange/stocks/BTC-USD/ai" target="_blank" rel="noopener noreferrer">
    <button className="w-[300px] h-auto p-2 border-2 border-[#4A90E2] text-lg font-semibold rounded-lg bg-[#4A90E2] text-white">
      Chat with Just a Happy Guy AI agent
    </button>
  </a>
  <a href="https://finch.aidx.exchange/stocks/BTC-USD" target="_blank" rel="noopener noreferrer">
    <button className="w-[300px] h-auto p-2 border-2 border-[#4A90E2] text-lg font-semibold rounded-lg bg-[#4A90E2] text-white">
      Get AI trading signals by Happy Guy AI agent
    </button>
  </a>
</div>


        </div>

        {/* Right Image (Hero Image) */}
        <div className="relative flex justify-center mt-[20px] md:mt-0 md:absolute md:-right-20 md:top-[12px] w-[320px] sm:w-[280px] md:w-[400px]">
          <HeroImage className="w-[80%] sm:w-[60%] md:w-auto max-h-[400px] object-contain" />
        </div>
      </div>
    </div>





  {/* Carousel */}
  <Carousel />





  <Section1 />



    {/* Happy Ai */}
    <HappyAi />


    {/* Tokenomic Section */}
    <TokenomicSection />
     {/* Why Choose */}
     <WhyChoose />

    {/* Plan Section */}
    <PlanSection />
      {/* Roadmap */}
      <RoadMap />

        {/* FAQ */}
        <FAQ />

{/* EMBARK */}
<Embark />

<Footer />
    </>

    
    
  );
};

export default MainPage;
