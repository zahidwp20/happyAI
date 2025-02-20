import React, { useState } from "react";

const StakingCard = ({
  item,
  index,
  isConnected,
  hoveredIndex,
  setHoveredIndex,
  handleStake,
  handleUnstake,
  isWithdrawValid,
  loading,
  formatTime,
}) => {
  const [modalType, setModalType] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setTokenAmount("");
  };

  const closeModal = () => {
    setModalType("");
    setTokenAmount("");
  };

  const confirmAction = async () => {
    if (!tokenAmount || isNaN(tokenAmount) || Number(tokenAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      setIsProcessing(true);
      if (modalType === "stake") {
        await handleStake(index, tokenAmount);
      } else if (modalType === "unstake") {
        await handleUnstake(index, tokenAmount);
      }
      closeModal();
    } catch (error) {
      console.error(`${modalType} failed:`, error);
      alert(`Failed to ${modalType}.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="staking-card-wrapper w-full transition-all duration-300 ease-in-out"
      onMouseOver={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="bg-[#1C1C1C] p-4 rounded-lg shadow-lg text-white">
        <h2 className="text-xl font-bold">APY: {item.apy}%</h2>
        <p>Staked: {item.stakedAmount} CHRLE</p>
        <p>Earned: {item.rewardAmount} CHRLE</p>

        {item.stakedAmount > 0 ? (
          <>
            <button
              onClick={() => openModal("unstake")}
              className="mt-2 w-full bg-gradient text-white px-4 py-2 rounded"
              disabled={loading[index]}
            >
              Unstake
            </button>
          </>
        ) : (
          <button
            onClick={() => openModal("stake")}
            className="mt-2 w-full bg-gradient text-white px-4 py-2 rounded"
          >
            Stake
          </button>
        )}
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] p-6 rounded-lg w-[90%] max-w-md text-white">
            <h2 className="text-xl font-bold">
              {modalType === "stake" ? "Stake Tokens" : "Unstake Tokens"}
            </h2>
            <input
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full p-2 rounded bg-[#2B2B2B] text-white mb-4"
              placeholder={`Enter amount to ${modalType}`}
            />
            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 bg-gray-500 rounded" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  isProcessing
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient text-white"
                }`}
                onClick={confirmAction}
              >
                {isProcessing ? "Processing..." : `Confirm ${modalType}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StakingCard;
