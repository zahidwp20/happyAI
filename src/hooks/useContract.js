import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";

import Web3 from "web3";

import {
  TOKEN_CONTRACT_ADDRESS,
  PRESALE_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  TOKEN_ABI,
  PRESALE_ABI,
} from "../contracts/contracts";

const chain_id = 8453;

function useContract() {
  const { walletProvider } = useWeb3ModalProvider();
  const { address, isConnected } = useWeb3ModalAccount();
  const getProvider = () => {
    return new BrowserProvider(walletProvider);
  };
  const getSigner = async (provider) => {
    return provider.getSigner();
  };

  const getContract = async (address, abi, signer) => {
    const contract = new Contract(address, abi, signer);
    return contract;
  };

  const buy = async (paymentType, amount, referrer = null) => {
    console.log("Payment Type:", paymentType, "Amount:", amount, "Referrer:", referrer);


    const provider = getProvider();
    const signer = await getSigner(provider);
    // print singer address
    const contract = await getContract(
      PRESALE_CONTRACT_ADDRESS,
      PRESALE_ABI,
      signer
    );
    const referrerAddress = referrer || "0x0000000000000000000000000000000000000000";

    if (paymentType === "ETH") {
      console.log("ETH");
      const transaction = await contract.buyFromNative( referrerAddress,
    
        {
          value: parseUnits(amount.toString(), 18),     
        }
      );
      const receipt = await transaction.wait();
      return receipt;
    } else if (paymentType === "USDT") {
      const usdc = await getContract(USDT_CONTRACT_ADDRESS, TOKEN_ABI, signer);
      const transaction = await usdc.approve(
        PRESALE_CONTRACT_ADDRESS,
        parseUnits(amount.toString(), 6)
      );
      await transaction.wait();

      const trx2 = await contract.buyFromToken( referrerAddress,
        // buying from token
        1,
       
        parseUnits(amount.toString(), 6)
      );
      await trx2.wait();
    } else if (paymentType === "USDT") {
      const usdc = await getContract(USDC_CONTRACT_ADDRESS, TOKEN_ABI, signer);
      const transaction = await usdc.approve(
        PRESALE_CONTRACT_ADDRESS,
        parseUnits(amount.toString(), 6)
      );
      await transaction.wait();

      const trx2 = await contract.buyFromToken( referrerAddress,
        // buying from token
        2,
       
        parseUnits(amount.toString(), 6)
      );
      await trx2.wait();
    }
  };

  const getData = async () => {
    // console.log(address);
    let token;
    if (!isConnected) {
      return;
      const web3 = new Web3(
        "https://rpc.ankr.com/base"
      );
      token = new web3.eth.Contract(TOKEN_ABI, TOKEN_CONTRACT_ADDRESS);
    } else {
      const provider = getProvider();
      // check chain id and throw error if not correct
      const chainId = await provider.getNetwork();
      // base chain id
      if (chainId.chainId != chain_id) {
        return;
      }

      const signer = await getSigner(provider);
      token = await getContract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, signer);
    }

    const balance = await token.balanceOf(address);
    const balanceInEth = formatUnits(balance, 18);
    // console.log(balanceInEth);
    // contract token balance
    const contractBalanceInEth = await token.balanceOf(
      PRESALE_CONTRACT_ADDRESS
    );
    const contractBalance = formatUnits(contractBalanceInEth, 18);

    return {
      balanceInEth,
      contractBalance,
    };
  };

  const myTokenBalance = async () => {
    let token;
    if (!isConnected) {
      return 0;
    } else {
      const provider = getProvider();
      // check chain id and throw error if not correct
      const chainId = await provider.getNetwork();
      // base chain id
      if (chainId.chainId != chain_id) {
        return;
      }

      const signer = await getSigner(provider);
      token = await getContract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, signer);
      const balance = await token.balanceOf(address);
      const balanceInEth = formatUnits(balance, 18);
      return balanceInEth;
    }
  };

  const maxBalances = async () => {
    let token;
    let token2;
    let usdcBalance;
    let usdtBalance;
    let ethbalance;
    if (!isConnected) {
      return {
        usdt: 0,
        busd: 0,
        eth: 0,
      };
    } else {
      const provider = getProvider();
      // check chain id and throw error if not correct
      const chainId = await provider.getNetwork();
      // base chain id
      if (chainId.chainId != chain_id) {
        return;
      }

      const signer = await getSigner(provider);
      token = await getContract(USDT_CONTRACT_ADDRESS, TOKEN_ABI, signer);
      token2 = await getContract(USDC_CONTRACT_ADDRESS, TOKEN_ABI, signer);
      usdtBalance = await token.balanceOf(address);

      usdcBalance = await token2.balanceOf(address);

      // eth balance
      ethbalance = await provider.getBalance(address);
    }

    return {
      usdt: Number(formatUnits(usdtBalance, 6)).toFixed(4),
      usdc: Number(formatUnits(usdcBalance, 6)).toFixed(4),
      eth: Number(formatUnits(ethbalance, 18)).toFixed(4),
    };
  };




  

  const claimTokens = async () => {
    console.log(claimTokens);

    const provider = getProvider();
    const signer = await getSigner(provider);
    // print singer address
    const contract = await getContract(
      PRESALE_CONTRACT_ADDRESS,
      PRESALE_ABI,
      signer
    );
    const transaction = await contract.claimTokens(

   
    );
    const receipt = await transaction.wait();
    return receipt;
  };


 

  const getPresaleAllocation = async () => {

    if (!isConnected) {
      return 0;
    } else {
      const provider = getProvider();
      // check chain id and throw error if not correct
      const chainId = await provider.getNetwork();
      // base chain id
      if (chainId.chainId != chain_id) {
        return;
      }

    const signer = await getSigner(provider);
    const contract = await getContract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);

    console.log("Fetching unclaimed tokens for address:", address);






       // Call the getReferralReward function
       const [, , totalAmount] = await contract.getTotalUnclaimed(address);
       console.log("Raw totalAmount (BigNumber):", totalAmount);
   
       // Format the tokens using ethers.js formatUnits for 18 decimals
       const formattedUnclaimedTokens = formatUnits(totalAmount, 18);
       console.log("Formatted unclaimed tokens:", formattedUnclaimedTokens);
   
       // Reduce decimals to 2
       const airdropAmount = Number(formattedUnclaimedTokens).toFixed(0);
       console.log("Reduced unclaimed tokens (2 decimals):", airdropAmount);
   
       return airdropAmount;
  } 
};


const getAirdropAllocation = async () => {

  if (!isConnected) {
    return 0;
  } else {
    const provider = getProvider();
    // check chain id and throw error if not correct
    const chainId = await provider.getNetwork();
    // base chain id
    if (chainId.chainId != chain_id) {
      return;
    }

  const signer = await getSigner(provider);
  const contract = await getContract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);

  console.log("Fetching unclaimed tokens for address:", address);



  
    // Call the getReferralReward function
    const unclaimedTokens = await contract.getAirdropUnclaimed(address);
    console.log("Raw unclaimed tokens (BigNumber):", unclaimedTokens);

    // Format the tokens using ethers.js formatUnits for 18 decimals
    const formattedUnclaimedTokens = formatUnits(unclaimedTokens, 18);
    console.log("Formatted unclaimed tokens:", formattedUnclaimedTokens);

    // Reduce decimals to 2
    const airdropAmount = Number(formattedUnclaimedTokens).toFixed(0);
    console.log("Reduced unclaimed tokens (2 decimals):", airdropAmount);

    return airdropAmount;
} 
};


const getreferAllocation = async () => {

  if (!isConnected) {
    return 0;
  } else {
    const provider = getProvider();
    // check chain id and throw error if not correct
    const chainId = await provider.getNetwork();
    // base chain id
    if (chainId.chainId != chain_id) {
      return;
    }

  const signer = await getSigner(provider);
  const contract = await getContract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);

  console.log("Fetching unclaimed tokens for address:", address);

    // Call the getReferralReward function
    const unclaimedTokens = await contract.getReferralReward(address);
    console.log("Raw unclaimed tokens (BigNumber):", unclaimedTokens);

    // Format the tokens using ethers.js formatUnits for 18 decimals
    const formattedUnclaimedTokens = formatUnits(unclaimedTokens, 18);
    console.log("Formatted unclaimed tokens:", formattedUnclaimedTokens);

    // Reduce decimals to 2
    const referamount = Number(formattedUnclaimedTokens).toFixed(0);
    console.log("Reduced unclaimed tokens (2 decimals):", referamount);

    return referamount;
} 
};




const fetchTokenPrice = async () => {
  try {
    // Connect to the blockchain using a public provider
    const web3 = new Web3("https://rpc.ankr.com/base"); // Replace with your RPC URL

    // Instantiate the contract
    const contract = new web3.eth.Contract(PRESALE_ABI, PRESALE_CONTRACT_ADDRESS);

    // Fetch the perDollarPrice from the contract
    const rawPrice = await contract.methods.perDollarPrice().call();
    console.log("Raw perDollarPrice:", rawPrice);

    // Convert the price from BigNumber to human-readable format
    const decimals = 18; // Assuming 18 decimals
    const formattedPrice = rawPrice / Math.pow(10, decimals);

    return formattedPrice;
  } catch (err) {
    console.error("Error in fetchTokenPrice:", err.message || err);
    throw err; // Let the caller handle the error
  }
};

const claimAirdropTokens = async (merkleProof, claimAmount) => {
  if (!isConnected) {
    throw new Error("Wallet not connected");
  }

  try {
    const provider = getProvider(); // Get the provider
    const signer = await getSigner(provider);
    const contract = await getContract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);

    console.log("Submitting airdrop claim with proof and amount...");
    const transaction = await contract.claimAirdrop(merkleProof, claimAmount);
    const receipt = await transaction.wait(); // Wait for the transaction to be mined

    console.log("Airdrop claim successful:", receipt);
    return receipt;
  } catch (error) {
    console.error("Error in claimAirdropTokens:", error.message);
    throw error;
  }
};








  const getPrice = async () => {
    console.log("Fetching price...");
    try {
      let contract;
      let price;
  
      if (!isConnected) {
        console.log("Not connected, using public Web3 provider...");
        const web3 = new Web3("https://rpc.ankr.com/base");
        contract = new web3.eth.Contract(PRESALE_ABI, PRESALE_CONTRACT_ADDRESS);
        price = await contract.methods.perDollarPrice().call();
        console.log("Price from public provider:", price);
      } else {
        console.log("Wallet connected, using signer...");
        const provider = getProvider();
        const chainId = await provider.getNetwork();
        if (chainId.chainId !== chain_id) {
          console.error("Incorrect chain ID!");
          return 0;
        }

  
        const signer = await getSigner(provider);
        contract = await getContract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);
        price = await contract.perDollarPrice();
        console.log("Price from connected wallet:", price);
      }
  
      const formattedPrice = Number(formatUnits(price, 18)).toFixed(4);
      console.log("Formatted price:", formattedPrice);
      return formattedPrice;
    } catch (error) {
      console.error("Error in getPrice:", error);
      return 0; // Fallback value
    }
  };
  
  const getAirdropUserData = async () => {
    if (!isConnected) {
      return { token_balance: 0, claimed_token: 0 };
    }
  
    try {
      const provider = getProvider();
      const signer = await getSigner(provider);
      const contract = await getContract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);
  
      console.log("Fetching airdrop user data for:", address);
  
      // Call the `airdropusers` function from the contract
      const [tokenBalance, claimedToken] = await contract.airdropusers(address);
  
      // Convert BigNumber values to readable format
      const formattedTokenBalance = formatUnits(tokenBalance, 18);
      const formattedClaimedToken = formatUnits(claimedToken, 18);
  
      console.log("Airdrop Token Balance:", formattedTokenBalance);
      console.log("Claimed Tokens:", formattedClaimedToken);
  
      return {
        token_balance: Number(formattedTokenBalance),
        claimed_token: Number(formattedClaimedToken),
      };
    } catch (error) {
      console.error("Error fetching airdrop user data:", error);
      return { token_balance: 0, claimed_token: 0 };
    }
  };
  const claimReferralRewards = async () => {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }
  
    try {
      const provider = getProvider(); // Get the provider
      const signer = await getSigner(provider);
      const contract = await getContract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);
  
      console.log("Claiming referral rewards...");
      const transaction = await contract.claimReferralRewards();
      const receipt = await transaction.wait(); // Wait for the transaction to be confirmed
  
      console.log("Referral rewards claimed successfully:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error in claimReferralRewards:", error.message);
      throw error;
    }
  };
  
  return {
    buy,
    getData,
    myTokenBalance,
    maxBalances,
    getPrice,
    claimTokens,
    getPresaleAllocation,
    getAirdropAllocation,
    fetchTokenPrice,
    claimAirdropTokens,
    getreferAllocation,
    getAirdropUserData,
    claimReferralRewards,
  };
}

export default useContract;
