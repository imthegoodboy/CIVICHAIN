// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CivicIdentity
 * @dev Soulbound NFT for verified citizen identity
 * @notice Non-transferable ERC721 token representing verified identity
 */
contract CivicIdentity is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    uint256 public mintFee;
    
    mapping(address => uint256) public identityTokenId;
    mapping(uint256 => address) public tokenToOwner;
    mapping(address => bool) public verifiedIdentities;
    mapping(address => string) public identityMetadata;
    
    event IdentityMinted(address indexed to, uint256 indexed tokenId, string metadata);
    event IdentityVerified(address indexed user, bool verified);
    event MintFeeUpdated(uint256 newFee);
    
    constructor(address initialOwner) ERC721("CivicChain Identity", "CIVICID") Ownable(initialOwner) {
        mintFee = 2 * 10**18; // 2 tokens (will be converted via SideShift)
    }
    
    /**
     * @dev Mint a new identity NFT (Soulbound - non-transferable)
     * @param to Address to mint the identity to
     * @param metadataURI IPFS URI containing identity metadata
     */
    function mintIdentity(address to, string memory metadataURI) 
        external 
        payable 
        nonReentrant 
    {
        require(msg.value >= mintFee, "Insufficient payment");
        require(identityTokenId[to] == 0, "Identity already exists");
        require(to != address(0), "Cannot mint to zero address");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        identityTokenId[to] = newTokenId;
        tokenToOwner[newTokenId] = to;
        verifiedIdentities[to] = true;
        identityMetadata[to] = metadataURI;
        
        emit IdentityMinted(to, newTokenId, metadataURI);
    }
    
    /**
     * @dev Override transfer functions to make NFT soulbound (non-transferable)
     */
    function transferFrom(address, address, uint256) public pure override {
        revert("CivicIdentity: Token is soulbound and non-transferable");
    }
    
    function safeTransferFrom(address, address, uint256) public pure override {
        revert("CivicIdentity: Token is soulbound and non-transferable");
    }
    
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("CivicIdentity: Token is soulbound and non-transferable");
    }
    
    /**
     * @dev Check if address has verified identity
     */
    function hasIdentity(address user) external view returns (bool) {
        return verifiedIdentities[user] && identityTokenId[user] > 0;
    }
    
    /**
     * @dev Get token ID for a user
     */
    function getTokenId(address user) external view returns (uint256) {
        return identityTokenId[user];
    }
    
    /**
     * @dev Update mint fee (only owner)
     */
    function setMintFee(uint256 _newFee) external onlyOwner {
        mintFee = _newFee;
        emit MintFeeUpdated(_newFee);
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Get total identities minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}

