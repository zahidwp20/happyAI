import React, { useState, useEffect } from "react";

import useContract from "../hooks/useContract"; // Import your custom hook
import { toast } from "react-toastify"; // For notifications

import { useWeb3ModalAccount, useWeb3Modal } from "@web3modal/ethers/react";
const Sidebar = ({ activePage, setActivePage, setIsSidebarOpen }) => {
  const handlePageChange = React.useCallback((item) => {
    setActivePage(item);
    setIsSidebarOpen(false);
  }, [setActivePage, setIsSidebarOpen]);

  const pages = ["earning", "Purchase", "Stake", "transactions"];

  return (
    <ul className="mt-5 space-y-4">
      {pages.map((item) => (
        <li
          key={item}
          onClick={() => handlePageChange(item)}
          className={`p-4 rounded-lg cursor-pointer capitalize ${
            activePage === item
              ? "bg-[#4D8DFF] text-white"
              : "hover:bg-gray-700 text-white"
          }`}
          aria-current={activePage === item ? "page" : undefined}
          aria-label={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
const MainPage = () => {







  const { buy, maxBalances } = useContract(); // Extract buy and maxBalances
  const [selectedAmount, setSelectedAmount] = useState(50); // Default amount
  const [paymenType, setPaymentType] = useState("package1"); // Default payment type
  const [balances, setBalances] = useState({ usdt: 0, busd: 0, eth: 0 }); // User balances
  const [loading, setLoading] = useState(false); // Loading state


  // Fetch balances when component is mounted
  useEffect(() => {
    const fetchBalances = async () => {
      const userBalances = await maxBalances();
      setBalances(userBalances); // Set user balances
    };
    fetchBalances();
  }, [maxBalances]);

  // Function to change payment type
  const handlePaymentTypechange = (type) => {
    setPaymentType(type);
    console.log("Payment type updated to:", type);
  };

  // Function to handle package purchase
  const handleBuy = async () => {
    setLoading(true);

    // Validate user's balance for the selected payment type
    if (paymenType === "package1" && balances.usdt < selectedAmount) {
      toast.error("Insufficient USDT balance!");
      setLoading(false);
      return;
    }

    try {
      console.log(`Purchasing ${paymenType} with amount ${selectedAmount}`);
      await buy(paymenType, selectedAmount); // Call buy function
      toast.success("Purchase successful!");
    } catch (error) {
      console.error("Error during purchase:", error);
      toast.error("Purchase failed!");
    } finally {
      setLoading(false);
    }
  };




  const { isConnected, address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { stake, vestTokens,unstake,claimVesting,claimAirdrop   } = useContract();

  const [modalType, setModalType] = useState(""); // To determine if it’s a stake or vest modal
  const [tokenAmount, setTokenAmount] = useState("");
  const [isStakeProcessing, setStakeProcessing] = useState(false); // Loading state for staking
  const [isVestProcessing, setVestProcessing] = useState(false); // Loading state for vesting
  const [isClaimVestingLoading, setClaimVestingLoading] = useState(false); // Loading state for claim vest
  const [isUnstakeLoading, setUnstakeLoading] = useState(false); // Loading state for unstake
  const [isStakeLoading, setStakeLoading] = useState(false); // Loading state for stake
  const [isClaimRewardLoading, setClaimRewardLoading] = useState(false); // Loading for claiming rewards

  const openModal = (type) => {
    setModalType(type); // Type is either 'stake' or 'vest'
    setTokenAmount(""); // Clear token amount
  };

  const closeModal = () => {
    setModalType("");
    setTokenAmount("");
  };

  const handleConfirm = async () => {
    if (modalType !== "claimVest" &&  !tokenAmount || isNaN(tokenAmount) || Number(tokenAmount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      if (modalType === "stake") {
        setStakeProcessing(true); // Set staking processing state
        console.log(`Staking ${tokenAmount} tokens...`);
        await stake(tokenAmount);
        toast.success("Tokens staked successfully!");
      } 
      else if (modalType === "unstake") {
        console.log(`Unstaking ${tokenAmount} tokens...`);
        await unstake(tokenAmount); // Call the unstake function
        toast.success("Tokens unstaked successfully!");
      }
      
      else if (modalType === "claimVest") {
        console.log("Claiming all vested tokens...");
        await claimVesting(); // Call the claim vested tokens function
        toast.success("Vested tokens claimed successfully!");
      }else if (modalType === "vest") {
        setVestProcessing(true); // Set vesting processing state
        console.log(`Vesting ${tokenAmount} tokens...`);
        await vestTokens(tokenAmount);
        toast.success("Tokens vested successfully!");
      }
      else if (modalType === "claimReward") {
        setClaimRewardLoading(true);
        console.log("Claiming rewards...");
        await claimAirdrop();
        toast.success("Rewards claimed successfully!");
      }

      closeModal();
    } catch (error) {
      console.error(`Error during ${modalType}:`, error.message || error);
      toast.error(`Failed to ${modalType === "stake" ? "stake" : modalType === "unstake" ? "unstake" : modalType === "claimVesting" ? "claim vested tokens" : "claim rewards"}.`);
    } finally {
      if (modalType === "stake") setStakeLoading(false);
      if (modalType === "unstake") setUnstakeLoading(false);
      if (modalType === "claimVesting") setClaimVestingLoading(false);
      if (modalType === "claimReward") setClaimRewardLoading(false);
    }
  };

  const isProcessing = modalType === "stake" ? isStakeProcessing : isVestProcessing;


  const [activePage, setActivePage] = React.useState("earning");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // Function to render dynamic page content
  const renderContent = React.useCallback(() => {
    switch (activePage) {
      case "earning":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6 text-white ">N2G RewardEarnings </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              {/* Box 1 */}
              <div className="bg-[#1C1C1C] p-6 rounded-lg shadow-lg border border-[#4D8DFF] glow-card">
                <h2 className="text-lg font-semibold mb-2 text-white">N2G Reward</h2>
                <p className="text-2xl font-bold text-white">0 N2G Reward</p>
                <p className="text-white">$0</p>
              </div>
              {/* Box 2 */}
              <div className="bg-[#1C1C1C] p-6 rounded-lg shadow-lg border border-[#4D8DFF] glow-card">
                <h2 className="text-lg font-semibold mb-2 text-white">Total Rewards Paid</h2>
                <p className="text-2xl font-bold text-white">0.000 ETH</p>
                <p className="text-white">$0</p>
              </div>
              {/* Box 3 */}
              <div className="bg-[#1C1C1C] p-6 rounded-lg shadow-lg border border-[#4D8DFF] glow-card">
                <h2 className="text-lg font-semibold mb-2 text-white">Next Payout</h2>
                <p className="text-xl font-bold text-green-500">Processing</p>
              </div>
              {/* Box 4 */}
              <div className="bg-[#1C1C1C] p-6 rounded-lg shadow-lg border border-[#4D8DFF] glow-card">
                <h2 className="text-lg font-semibold mb-2 text-white">Total Earnings</h2>
                <p className="text-2xl font-bold text-white">0 N2G Reward</p>
                <p className="text-white">$0</p>
              </div>
            </div>
          </div>
        );
      case "Purchase":
        return (
          <div
            style={{
              color: "white",
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#000",
              minHeight: "100vh",
            }}
          >
            {/* Balance Section */}
            <div
              style={{
                marginBottom: "30px",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 20px",
                backgroundColor: "#1f1f1f",
                borderRadius: "10px",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Your Balance:
              </span>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                ${selectedAmount.toFixed(1)}
              </span>
            </div>
      
            {/* Amount Input */}
            <div style={{ marginBottom: "30px" }}>
              <input
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
                style={{
                  width: "90%",
                  padding: "10px",
                  fontSize: "18px",
                  borderRadius: "10px",
                  border: "1px solid #444",
                  backgroundColor: "#1f1f1f",
                  color: "white",
                  textAlign: "center",
                }}
                placeholder="Enter Amount"
              />
            </div>
      
            {/* Amount Selection Buttons */}
            <div>
              <h3
                style={{ marginBottom: "20px", fontWeight: "bold", textAlign: "left" }}
              >
                Amount Money
              </h3>
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}
              >
                {[50, 100, 200, 500, 1000, 2000].map((amount, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAmount(amount);
                      handlePaymentTypechange(`package${index + 1}`);
                    }}
                    style={{
                      padding: "15px",
                      backgroundColor:
                        selectedAmount === amount ? "#00c853" : "#1f1f1f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
      
            {/* Confirm Button */}
            <button
              onClick={handleBuy}
              style={{
                marginTop: "50px",
                padding: "15px",
                backgroundColor: loading ? "#555" : "#00c853",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "20px",
                fontWeight: "bold",
                width: "100%",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Purchase Package"}
            </button>
          </div>
        );
      case "Stake":
        return (
          <div className="p-6 ">
          {/* Header */}

    
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  grind">
            {/* Stake Section */}
            <div className="bg-[#1C1C1C] p-6 rounded-lg shadow-lg text-white">
            <div className="w-full flex flex-col">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">APY:</span>
                                                <span className="text-white text-base font-normal">30%</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">Earn:</span>
                                                <span className="text-white text-base font-normal">N2G Reward</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">Deposit Fee:</span>
                                                <span className="text-white text-base font-normal">0%</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">Harvest Lockup:</span>
                                                <span className="text-white text-base font-normal"> days</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="tracking-[-0.052em] text-base font-semibold gradient-text">
                                                N2G Reward
                                                </span>
                                                <span className="text-white text-base font-normal">Earned</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xl font-semibold text-[#747474]"> N2G Reward</span>
                                                <span className="bg-[#242424] font-semibold text-base info-container px-2 py-1 text-[#747474]">
                                                    Harvest
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="tracking-[-0.052em] text-base font-semibold gradient-text">
                                                N2G Reward
                                                </span>
                                                <span className="text-white text-base font-normal">Staked</span>
                                            </div>
                                        </div>
                                        
              <button
                className="w-full px-4 py-2 bg-gradient text-white rounded"
                onClick={() => openModal("stake")}
              >
                Stake Tokens
              </button>
            </div>
    
            {/* Vesting Section */}
            <div className="bg-[#1C1C1C] p-6 rounded-lg shadow-lg text-white">
            <div className="w-full flex flex-col">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">APY:</span>
                                                <span className="text-white text-base font-normal">50%</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">Earn:</span>
                                                <span className="text-white text-base font-normal">N2G Reward</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">Deposit Fee:</span>
                                                <span className="text-white text-base font-normal">0%</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">Harvest Lockup:</span>
                                                <span className="text-white text-base font-normal"> days</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="tracking-[-0.052em] text-base font-semibold gradient-text">
                                                    N2G Reward
                                                </span>
                                                <span className="text-white text-base font-normal">Earned</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xl font-semibold text-[#747474]"> N2G Reward</span>
                                                <span className="bg-[#242424] font-semibold text-base info-container px-2 py-1 text-[#747474]">
                                                    Harvest
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="tracking-[-0.052em] text-base font-semibold gradient-text">
                                                    N2G Reward
                                                </span>
                                                <span className="text-white text-base font-normal">Vested</span>
                                            </div>
                                        </div>
              <button
                className="w-full px-4 py-2 bg-gradient text-white rounded"
                onClick={() => openModal("vest")}
              >
                Vest Tokens
              </button>
            </div>
              {/* Unstake Section */}
        <div className="bg-[#1C1C1C] p-6 rounded-lg shadow-lg text-white">
        <div className="w-full flex flex-col">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">APY:</span>
                                                <span className="text-white text-base font-normal">30%</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">Earn:</span>
                                                <span className="text-white text-base font-normal">N2G Reward</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">Deposit Fee:</span>
                                                <span className="text-white text-base font-normal">0%</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[#747474] text-base font-normal">Harvest Lockup:</span>
                                                <span className="text-white text-base font-normal"> days</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="tracking-[-0.052em] text-base font-semibold gradient-text">
                                                N2G Reward
                                                </span>
                                                <span className="text-white text-base font-normal">Earned</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xl font-semibold text-[#747474]"> N2G Reward</span>
                                                <span className="bg-[#242424] font-semibold text-base info-container px-2 py-1 text-[#747474]">
                                                    Harvest
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="tracking-[-0.052em] text-base font-semibold gradient-text">
                                                N2G Reward
                                                </span>
                                                <span className="text-white text-base font-normal">Staked</span>
                                            </div>
                                        </div>
          <button
            className="w-full px-4 py-2 bg-gradient text-white rounded"
            onClick={() => openModal("unstake")}
          >
            Unstake Tokens
          </button>
        </div>
        {/* Claim Vested Tokens */}
        <div className="bg-[#1C1C1C] p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-xl font-bold mb-4 text-white">Withdraw Vested Tokens</h2>
          <p className="mb-4">Click the button below to claim all your vested tokens.</p>
          <button
            className={`w-full px-4 py-2 rounded ${
              isClaimVestingLoading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient text-white"
            }`}
            onClick={async () => {
              try {
                setClaimVestingLoading(true);
                console.log("Claiming vested tokens...");
                await claimVesting();
                toast.success("Vested tokens claimed successfully!");
              } catch (error) {
                console.error("Error claiming vested tokens:", error.message || error);
                toast.error("Failed to claim vested tokens.");
              } finally {
                setClaimVestingLoading(false);
              }
            }}
            disabled={isClaimVestingLoading}
          >
            {isClaimVestingLoading ? "Processing..." : "Withdraw Vested Tokens"}
          </button>
        </div>

       < div className="bg-[#1C1C1C] p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-xl font-bold mb-4">Claim Rewards</h2>
          <p className="mb-4">Click the button below to claim your rewards </p>
          <button
            className={`w-full px-4 py-2 rounded ${isClaimRewardLoading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient text-white"}`}
            onClick={async () => {
              try {
                setClaimRewardLoading(true);
                console.log("Claiming rewards...");
                await claimAirdrop();
                toast.success("Rewards claimed successfully!");
              } catch (error) {
                console.error("Error claiming rewards:", error.message || error);
                toast.error("Failed to claim rewards.");
              } finally {
                setClaimRewardLoading(false);
              }
            }}
            disabled={isClaimRewardLoading}
          >
            {isClaimRewardLoading ? "Processing..." : "Claim Rewards"}
          </button>
        </div>
          </div>
    
          {/* Modal */}
          
          {modalType && modalType !== "claimVesting" && modalType !== "claimReward" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">{modalType === "stake" ? "Stake Tokens" : "Unstake Tokens"}</h2>
            <p className="mb-4 text-white">Enter the amount of tokens you want to {modalType}.</p>
            <input
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-2 rounded bg-[#2B2B2B] text-white text-base mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={closeModal}
                disabled={isStakeLoading || isUnstakeLoading}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  isStakeLoading || isUnstakeLoading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient text-white"
                }`}
                onClick={handleConfirm}
                disabled={isStakeLoading || isUnstakeLoading}
              >
                {modalType === "stake" && isStakeLoading ? "Staking..." : modalType === "unstake" && isUnstakeLoading ? "Unstaking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
       
        </div>
        );
      case "transactions":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-white">Transactions</h1>
            <div className="p-6 bg-[#1C1C1C] rounded-lg text-white">
              <p>View your recent transactions here.</p>
            </div>
          </div>
        );
      default:
        return <p className="text-white">Select a section to display content.</p>;
    }
  }, [activePage]);

  const sidebarClasses = isSidebarOpen ? "block" : "hidden md:block";

  return (
    <div className="flex">
    <div className={`w-64 bg-gray-800 ${sidebarClasses}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </div>
    <div className="ml-0 md:ml-64 p-8 flex-1 bg-[#0E1118]">
      {renderContent()}
    </div>
  </div>
  );
};

export default MainPage;
