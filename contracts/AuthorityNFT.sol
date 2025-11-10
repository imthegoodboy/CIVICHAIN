// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AuthorityNFT
 * @dev NFT for authorized election creators (Governments/DAOs)
 */
contract AuthorityNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    mapping(address => uint256) public authorityTokenId;
    mapping(uint256 => address) public tokenToAuthority;
    mapping(address => bool) public isAuthorized;
    
    event AuthorityGranted(address indexed to, uint256 indexed tokenId);
    
    constructor(address initialOwner) ERC721("CivicChain Authority", "CIVICAUTH") Ownable(initialOwner) {}
    
    /**
     * @dev Grant authority to create elections (only owner)
     */
    function grantAuthority(address to, string memory metadataURI) external onlyOwner {
        require(!isAuthorized[to], "Already authorized");
        require(to != address(0), "Invalid address");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        authorityTokenId[to] = newTokenId;
        tokenToAuthority[newTokenId] = to;
        isAuthorized[to] = true;
        
        emit AuthorityGranted(to, newTokenId);
    }
    
    /**
     * @dev Check if address has authority
     */
    function hasAuthority(address user) external view returns (bool) {
        return isAuthorized[user];
    }
}

