// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import OpenZeppelin's ERC-1155 implementation
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BlueCarbonCredit
 * @dev ERC-1155 contract for Blue Carbon Credits with admin minting and marketplace functionality
 * Each token ID represents a unique carbon project (e.g., Gujarat Mangroves Project #101)
 * The amount of tokens represents the tons of CO2 captured
 */
contract BlueCarbonCredit is ERC1155, Ownable {
    using Strings for uint256;
    
    // Project metadata structure
    struct Project {
        string name;            // e.g., "Gujarat Mangrove Restoration"
        string location;        // e.g., "22.3N, 69.6E"
        uint256 verificationDate; // UNIX timestamp
        string verifiedBy;      // e.g., "NCCR - Ministry of Earth Sciences"
        string ipfsHash;        // IPFS hash for additional metadata
    }
    
    // Mapping from token ID to Project details
    mapping(uint256 => Project) public projects;
    
    // Mapping to track listed items for sale (tokenId => seller => price)
    mapping(uint256 => mapping(address => uint256)) public listedPrices;
    
    // Counter for token IDs
    uint256 private _currentTokenId = 0;
    
    // Events for important actions
    event ProjectCreated(uint256 indexed tokenId, string name, string location);
    event CreditsMinted(uint256 indexed tokenId, address indexed to, uint256 amount);
    event CreditsListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event CreditsPurchased(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 amount, uint256 price);
    
    /**
     * @dev Constructor sets the metadata URI and transfers ownership to deployer
     * @param _uri Base URI for token metadata (e.g., "https://api.bluecarbon.com/tokens/")
     */
    constructor(string memory _uri) ERC1155(_uri) Ownable(msg.sender) {}
    
    /**
     * @dev ONLY OWNER (NCCR): Create a new carbon project and mint initial credits
     * @param _to The address that will receive the minted tokens (farmer/NGO wallet)
     * @param _amount The amount of tokens to mint (tons of CO2)
     * @param _name Name of the carbon project
     * @param _location GPS coordinates of the project
     * @param _verifiedBy Organization that verified the project
     * @param _ipfsHash IPFS hash containing project evidence (images, reports)
     * @return The new token ID assigned to this project
     */
    function createProjectAndMint(
        address _to, 
        uint256 _amount, 
        string memory _name,
        string memory _location,
        string memory _verifiedBy,
        string memory _ipfsHash
    ) external onlyOwner returns (uint256) {
        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;
        
        // Store project metadata
        projects[newTokenId] = Project({
            name: _name,
            location: _location,
            verificationDate: block.timestamp,
            verifiedBy: _verifiedBy,
            ipfsHash: _ipfsHash
        });
        
        // Mint the carbon credits to the recipient
        _mint(_to, newTokenId, _amount, "");
        
        emit ProjectCreated(newTokenId, _name, _location);
        emit CreditsMinted(newTokenId, _to, _amount);
        
        return newTokenId;
    }
    
    /**
     * @dev ONLY OWNER (NCCR): Mint additional credits for an existing project
     * @param _to The address that will receive the minted tokens
     * @param _id Existing token ID of the project
     * @param _amount Additional amount of tokens to mint
     */
    function mintAdditionalCredits(address _to, uint256 _id, uint256 _amount) external onlyOwner {
        require(_id <= _currentTokenId && _id != 0, "Invalid token ID");
        _mint(_to, _id, _amount, "");
        emit CreditsMinted(_id, _to, _amount);
    }
    
    /**
     * @dev LIST CREDITS: Allow token owners to list their credits for sale
     * @param _tokenId The project token ID to list for sale
     * @param _price Price per credit in wei (1 ETH = 10^18 wei)
     */
    function listCreditsForSale(uint256 _tokenId, uint256 _price) external {
        require(balanceOf(msg.sender, _tokenId) > 0, "You don't own these credits");
        require(_price > 0, "Price must be greater than 0");
        
        listedPrices[_tokenId][msg.sender] = _price;
        emit CreditsListed(_tokenId, msg.sender, _price);
    }
    
    /**
     * @dev BUY CREDITS: Allow anyone to purchase listed credits
     * @param _tokenId The project token ID to purchase
     * @param _seller The address of the seller
     * @param _amount The amount of credits to purchase
     */
    function buyCredits(uint256 _tokenId, address _seller, uint256 _amount) external payable {
        uint256 pricePerCredit = listedPrices[_tokenId][_seller];
        require(pricePerCredit > 0, "Credits not listed for sale");
        require(balanceOf(_seller, _tokenId) >= _amount, "Seller doesn't have enough credits");
        
        uint256 totalPrice = pricePerCredit * _amount;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Transfer the credits to the buyer
        _safeTransferFrom(_seller, msg.sender, _tokenId, _amount, "");
        
        // Transfer the payment to the seller
        payable(_seller).transfer(totalPrice);
        
        // Refund excess ETH if any
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit CreditsPurchased(_tokenId, msg.sender, _seller, _amount, pricePerCredit);
    }
    
    /**
     * @dev Get the URI for a specific token's metadata
     * @param _tokenId The token ID to get metadata for
     * @return The metadata URI string
     */
    function uri(uint256 _tokenId) public view override returns (string memory) {
        require(_tokenId <= _currentTokenId && _tokenId != 0, "Token doesn't exist");
        return string(abi.encodePacked(super.uri(_tokenId), _tokenId.toString()));
    }
    
    /**
     * @dev Get project details for a token ID
     * @param _tokenId The token ID to get project details for
     */
    function getProjectDetails(uint256 _tokenId) external view returns (Project memory) {
        require(_tokenId <= _currentTokenId && _tokenId != 0, "Token doesn't exist");
        return projects[_tokenId];
    }
    
    /**
     * @dev ONLY OWNER: Update the base URI for all tokens
     * @param _newUri New base URI string
     */
    function setBaseURI(string memory _newUri) external onlyOwner {
        _setURI(_newUri);
    }
}