// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

// Import Chainlink's Aggregator Interface
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);

    function description() external view returns (string memory);

    function version() external view returns (uint256);

    function getRoundData(
        uint80 _roundId
    )
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function decimals() external view returns (uint8);
}

contract HappyguyPresale {
    IERC20 public token;
    IERC20 public usdc;
    IERC20 public usdt;
    AggregatorV3Interface public priceFeed;
    // Payment wallet address
    address public paymentWallet = 0xD5F36d13085B73babed6cab308E3456122A67872;
    address public owner;
    bool public paused;
    bool public claimStarted;
    bool public airdropStarted;
    uint256 public totalUsers;

    uint256 public currentStage;
    uint256 public perDollarPrice;
    uint256 public maxTokensPerUser = 100_000_000 * 10 ** 18; // Max 100M tokens per user
    uint256[] public stagePrices;
    uint256[] public stageSupplies;

    uint256 public totalUsdRaised;

    uint256 public totalTokensSold;
    uint256 public Usdtoeth; // To track the USD to ETH conversion rate

    uint256 public referralBonus = 5; // Default 5% referral bonus
    bool public referralClaimEnabled = false;

    mapping(address => address) public referrerOf; // Mapping to store referrer of each user
    mapping(address => uint256) public referralRewards; // Mapping to store referral rewards

    event ReferralRewardClaimed(address indexed referrer, uint256 reward);

    // Stage tracking (new variable)
    mapping(uint256 => uint256) public stageSold; // Mapping to track sold tokens in each stage
    // Tracks the tokens sold at each stage
    bytes32 public merkleRoot;

    // Presale tracking
    mapping(address => uint256) public presaleAllocations;
    mapping(address => bool) public oldBuyer;

    // Claim airdrop tokens
    uint256 public totalClaimedAirdrop;
    event Claimed(address indexed claimant, uint256 amount);
    event DebugLeaf(bytes32 leaf);
    event DebugProof(bytes32[] proof);

    event ClaimToken(address indexed _user, uint256 indexed _amount);
    event ClaimAirdropToken(address indexed _user, uint256 indexed _amount);
    struct user {
        uint256 native_balance;
        uint256 usdt_balance;
        uint256 token_balance;
        uint256 claimed_token;
    }

    struct airdropuser {
        uint256 token_balance;
        uint256 claimed_token;
    }

    mapping(address => user) public users;
    mapping(address => airdropuser) public airdropusers;
    mapping(uint256 => address) public presaleUsers;
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
    event TokensRescued(address indexed recipient, uint256 amount);

    constructor(
        uint256[] memory _prices,
        uint256[] memory _supplies,
        bytes32 _merkleRoot, // Add this new parameter to the constructor
        address _token,
        address _usdc,
        address _usdt,
        address _priceFeed
    ) {
        require(_prices.length == 6, "Must provide 6 stage prices");
        require(_supplies.length == 6, "Must provide 6 stage supplies");

        owner = msg.sender;
        stagePrices = _prices;
        stageSupplies = _supplies;
        currentStage = 1;
        perDollarPrice = stagePrices[0];
        merkleRoot = _merkleRoot; // Set the passed merkleRoot value
        token = IERC20(_token);
        usdc = IERC20(_usdc);
        usdt = IERC20(_usdt);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // Admin functions
    function setPause(bool _value) external onlyOwner {
        paused = _value;
    }

    function startClaim() external onlyOwner {
        claimStarted = true;
    }

    function startAirdropClaim() external onlyOwner {
        airdropStarted = true;
    }

    function stopAirdropClaim() external onlyOwner {
        airdropStarted = false;
    }

    function stopClaim() external onlyOwner {
        claimStarted = false;
    }

    function updateMaxPurchase(uint256 _newLimit) external onlyOwner {
        maxTokensPerUser = _newLimit;
    }

    // Change the payment wallet address (onlyOwner)
    function changePaymentWallet(address _newPaymentWallet) external onlyOwner {
        paymentWallet = _newPaymentWallet;
    }

    function updateToken(address _saleToken) external onlyOwner {
        token = IERC20(_saleToken);
    }

    function changeUSDTInterface(address _address) external onlyOwner {
        usdt = IERC20(_address);
    }

    // Function to get the price of the next stage
    function getNextStagePrice() public view returns (uint256) {
        require(currentStage < 6, "No next stage; already at the final stage");
        return stagePrices[currentStage]; // CurrentStage is 1-based index; next stage is in array index `currentStage`
    }

    function changeUSDCInterface(address _address) external onlyOwner {
        usdc = IERC20(_address);
    }

    function updateStagePrice(uint256 _stage, uint256 _price) public onlyOwner {
        require(_stage >= 1 && _stage <= 6, "Invalid stage");
        stagePrices[_stage - 1] = _price;

        if (_stage == currentStage) {
            perDollarPrice = _price;
        }
    }

    function setCurrentStage(uint256 _stage) public onlyOwner {
        require(_stage >= 1 && _stage <= 6, "Invalid stage");
        require(_stage > currentStage, "Cannot go back to previous stages");

        currentStage = _stage;
        perDollarPrice = stagePrices[_stage - 1];
    }

    function updateStageSupply(
        uint256 _stage,
        uint256 _newSupply
    ) external onlyOwner {
        require(
            _stage > 0 && _stage <= stageSupplies.length,
            "Invalid stage number"
        );
        require(
            _newSupply >= stageSold[_stage],
            "New supply cannot be less than already sold tokens in this stage"
        );
        stageSupplies[_stage - 1] = _newSupply;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    function rescueFunds() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Price update
    function updateEthPrice() public {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price data");
        Usdtoeth = uint256(price) * 10 ** 10; // Adjust to 18 decimals
    }

    // Presale purchase with Token (USDC or USDT)
    function buyFromToken(
        address _referrer,
        uint256 _pid,
        uint256 _amount
    ) external {
        require(!paused, "Presale is paused");

        if (!oldBuyer[msg.sender]) {
            presaleUsers[totalUsers] = msg.sender;
            totalUsers += 1;
            oldBuyer[msg.sender] = true; // Mark this user as tracked
        }
        uint256 tokensToAllocate = (_amount * perDollarPrice) / (10 ** 6);
        require(
            presaleAllocations[msg.sender] + tokensToAllocate <=
                maxTokensPerUser,
            "Exceeds maximum token purchase limit"
        );
        require(
            stageSold[currentStage] + tokensToAllocate <=
                stageSupplies[currentStage - 1],
            "Exceeds current stage supply"
        );

        if (_pid == 1) {
            usdt.transferFrom(msg.sender, paymentWallet, _amount);
        } else if (_pid == 2) {
            usdc.transferFrom(msg.sender, paymentWallet, _amount);
        } else {
            revert("Invalid token type");
        }

        totalUsdRaised += _amount; // Update the total USD raised

        // Ensure the referrer is not the buyer and is a valid address
        if (_referrer != msg.sender && _referrer != address(0)) {
            uint256 _referralBonus = (tokensToAllocate * referralBonus) / 100; // Calculate the referral bonus
            referralRewards[_referrer] += _referralBonus; // Add the bonus to the referrer
            referrerOf[msg.sender] = _referrer; // Store the referrer address
        }

        presaleAllocations[msg.sender] += tokensToAllocate;
        stageSold[currentStage] += tokensToAllocate; // Update the stageSold for the current stage
        totalTokensSold += tokensToAllocate;

        users[msg.sender].usdt_balance += _amount;

        users[msg.sender].token_balance =
            users[msg.sender].token_balance +
            (tokensToAllocate);
    }

    // Presale purchase with Native Ether
    function buyFromNative(address _referrer) external payable {
        require(!paused, "Presale is paused");

        if (!oldBuyer[msg.sender]) {
            presaleUsers[totalUsers] = msg.sender;
            totalUsers += 1;
            oldBuyer[msg.sender] = true; // Mark this user as tracked
        }
        updateEthPrice();

        uint256 ethAmount = msg.value;
        uint256 usdValue = (ethAmount * Usdtoeth) / 10 ** 18;

        uint256 tokensToAllocate = (usdValue * perDollarPrice) / (10 ** 18);
        require(
            presaleAllocations[msg.sender] + tokensToAllocate <=
                maxTokensPerUser,
            "Exceeds maximum token purchase limit"
        );
        require(
            stageSold[currentStage] + tokensToAllocate <=
                stageSupplies[currentStage - 1],
            "Exceeds current stage supply"
        );
        presaleAllocations[msg.sender] += tokensToAllocate;
        stageSold[currentStage] += tokensToAllocate; // Update the stageSold for the current stage
        totalTokensSold += tokensToAllocate;
        totalUsdRaised += usdValue; // Update total USD raised

        users[msg.sender].native_balance =
            users[msg.sender].native_balance +
            (msg.value);
        users[msg.sender].token_balance =
            users[msg.sender].token_balance +
            (tokensToAllocate);

        // Handle referral reward
        if (_referrer != msg.sender && _referrer != address(0)) {
            uint256 _referralBonus = (tokensToAllocate * referralBonus) / 100;
            referralRewards[_referrer] += _referralBonus;
            referrerOf[msg.sender] = _referrer;
        }

        // Transfer the ETH to the owner
        payable(paymentWallet).transfer(ethAmount);
    }

    // Claim bought tokens
    function claimTokens() external {
        require(claimStarted, "Claiming not started yet");

        uint256 purchasedTokens = users[msg.sender].token_balance; // Get unclaimed purchased tokens
        uint256 referralTokens = referralRewards[msg.sender]; // Get referral bonus tokens
        uint256 totalTokensToClaim = purchasedTokens + referralTokens; // Total tokens to claim

        require(totalTokensToClaim > 0, "No tokens to claim");

        // Reset the user's balances
        users[msg.sender].token_balance = 0;
        referralRewards[msg.sender] = 0;

        // Transfer the total tokens to the user
        token.transfer(msg.sender, totalTokensToClaim);

        // Emit an event
        emit ClaimToken(msg.sender, totalTokensToClaim);
    }

    // View function to get the referral rewards for the sender
    function getReferralReward(address _user) external view returns (uint256) {
        return referralRewards[_user];
    }

    // Query functions
    function getPresalePurchased(address _user) public view returns (uint256) {
        return presaleAllocations[_user];
    }

    function getPresaleUnclaimed(address _user) public view returns (uint256) {
        return users[_user].token_balance;
    }

    function getTotalReferralTokens(
        address _user
    ) external view returns (uint256) {
        return referralRewards[_user];
    }

    // Function to get the total allocation (referral bonus + unclaimed purchased tokens)
    function getTotalUnclaimed(
        address _user
    )
        external
        view
        returns (
            uint256 totalReferralBonus,
            uint256 unclaimedPurchasedTokens,
            uint256 totalAmount
        )
    {
        totalReferralBonus = referralRewards[_user]; // Total referral rewards earned by the user
        unclaimedPurchasedTokens = users[_user].token_balance; // Unclaimed purchased tokens
        totalAmount = totalReferralBonus + unclaimedPurchasedTokens; // Total tokens (sum of both)
    }

    function getPresaleClaimed(address _user) public view returns (uint256) {
        return users[_user].claimed_token;
    }

    function claimReferralRewards() external {
        require(referralClaimEnabled, "Referral claim is not enabled");
        uint256 reward = referralRewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        referralRewards[msg.sender] = 0;
        token.transfer(msg.sender, reward);
        emit ReferralRewardClaimed(msg.sender, reward);
    }

    // Function to rescue any ERC20 token (such as USDT or USDC) from the contract
    function rescueERC20Tokens(address tokenAddress) external onlyOwner {
        IERC20 tokenContract = IERC20(tokenAddress);
        uint256 tokenBalance = tokenContract.balanceOf(address(this));
        require(tokenBalance > 0, "No tokens to withdraw");
        tokenContract.transfer(owner, tokenBalance);
    }

    function enableReferralClaim(bool _enabled) external onlyOwner {
        referralClaimEnabled = _enabled;
    }

    // Set the referral bonus percentage
    function setReferralBonus(uint256 _percentage) external onlyOwner {
        require(_percentage <= 15, "Bonus percentage cannot exceed 15%");
        referralBonus = _percentage;
    }

    // Function to get the current stage supply
    function getCurrentStageSupply()
        external
        view
        returns (uint256 currentSupply)
    {
        return stageSupplies[currentStage - 1]; // Return the supply for the current stage
    }

    // Function to get the amount of tokens sold in a particular stage
    function getStageSold(uint256 _stage) public view returns (uint256) {
        require(_stage >= 1 && _stage <= 6, "Invalid stage");
        return stageSold[_stage];
    }

    function getTotalUnclaimedTokens() public view returns (uint256) {
        uint256 totalUnclaimed = 0;

        for (uint256 i = 0; i < totalUsers; i++) {
            address userAddress = presaleUsers[i]; // Fetch each presale user's address
            totalUnclaimed += users[userAddress].token_balance; // Add their unclaimed token balance
        }

        return totalUnclaimed;
    }

    // Claim airdrop tokens
    function claimAirdrop(
        bytes32[] memory merkleProof,
        uint256 totalAmount
    ) external {
        require(airdropStarted, "Airdrop claim is not active");
        require(totalAmount > 0, "Amount must be greater than zero");

        // Calculate remaining claimable amount
        uint256 alreadyClaimed = airdropusers[msg.sender].claimed_token;
        require(totalAmount > alreadyClaimed, "No remaining tokens to claim");

        uint256 claimableAmount = totalAmount - alreadyClaimed;

        // Create the leaf node (ensure consistency with off-chain hashing)
        bytes32 leaf = keccak256(abi.encode(msg.sender, totalAmount));

        // Verify the Merkle proof
        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "Invalid proof"
        );

        // Update user's claim status
        airdropusers[msg.sender].claimed_token = totalAmount; // Update the total claimed amount
        airdropusers[msg.sender].token_balance += claimableAmount; // Update token balance

        // Transfer tokens to the user
        token.transfer(msg.sender, claimableAmount);

        // Update the total airdrop claimed
        totalClaimedAirdrop += claimableAmount;

        // Emit event
        emit Claimed(msg.sender, claimableAmount);
    }

    function getTotalClaimedAirdrop() public view returns (uint256) {
        return totalClaimedAirdrop;
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }
}
