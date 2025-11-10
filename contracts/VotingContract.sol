// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CivicIdentity.sol";

/**
 * @title VotingContract
 * @dev On-chain voting system with privacy support
 */
contract VotingContract is Ownable, ReentrancyGuard {
    CivicIdentity public identityContract;
    
    enum VotingType { SingleChoice, Ranked, Quadratic }
    enum ElectionStatus { Pending, Active, Ended, Cancelled }
    
    struct Election {
        uint256 electionId;
        address creator;
        string title;
        string description;
        string[] candidates;
        VotingType votingType;
        uint256 startTime;
        uint256 endTime;
        ElectionStatus status;
        uint256 totalVotes;
        mapping(string => uint256) votes;
        mapping(address => bool) hasVoted;
        mapping(address => string) voterChoices; // For transparency (can be made private with ZK)
        bool isPrivate;
        uint256 rewardAmount;
    }
    
    mapping(uint256 => Election) public elections;
    uint256 public electionCounter;
    
    mapping(address => bool) public authorizedCreators; // DAOs/Governments
    
    event ElectionCreated(
        uint256 indexed electionId,
        address indexed creator,
        string title,
        VotingType votingType
    );
    event VoteCast(
        uint256 indexed electionId,
        address indexed voter,
        string candidate
    );
    event ElectionEnded(uint256 indexed electionId, string winner);
    event CreatorAuthorized(address indexed creator, bool authorized);
    
    constructor(address _identityContract, address initialOwner) Ownable(initialOwner) {
        identityContract = CivicIdentity(_identityContract);
    }
    
    /**
     * @dev Authorize an address to create elections (DAO/Government)
     */
    function authorizeCreator(address creator) external onlyOwner {
        authorizedCreators[creator] = true;
        emit CreatorAuthorized(creator, true);
    }
    
    /**
     * @dev Create a new election
     */
    function createElection(
        string memory title,
        string memory description,
        string[] memory candidates,
        VotingType votingType,
        uint256 startTime,
        uint256 endTime,
        bool isPrivate,
        uint256 rewardAmount
    ) external payable nonReentrant {
        require(authorizedCreators[msg.sender] || msg.sender == owner(), "Not authorized");
        require(candidates.length >= 2, "Need at least 2 candidates");
        require(endTime > startTime, "Invalid time range");
        require(startTime >= block.timestamp, "Start time must be in future");
        
        if (rewardAmount > 0) {
            require(msg.value >= rewardAmount, "Insufficient reward funds");
        }
        
        electionCounter++;
        Election storage election = elections[electionCounter];
        
        election.electionId = electionCounter;
        election.creator = msg.sender;
        election.title = title;
        election.description = description;
        election.votingType = votingType;
        election.startTime = startTime;
        election.endTime = endTime;
        election.status = ElectionStatus.Pending;
        election.isPrivate = isPrivate;
        election.rewardAmount = rewardAmount;
        
        for (uint256 i = 0; i < candidates.length; i++) {
            election.candidates.push(candidates[i]);
            election.votes[candidates[i]] = 0;
        }
        
        emit ElectionCreated(electionCounter, msg.sender, title, votingType);
    }
    
    /**
     * @dev Start an election (can be called when startTime is reached)
     */
    function startElection(uint256 electionId) external {
        Election storage election = elections[electionId];
        require(election.creator == msg.sender || msg.sender == owner(), "Not authorized");
        require(election.status == ElectionStatus.Pending, "Invalid status");
        require(block.timestamp >= election.startTime, "Not yet time");
        
        election.status = ElectionStatus.Active;
    }
    
    /**
     * @dev Cast a vote
     */
    function vote(uint256 electionId, string memory candidate) external nonReentrant {
        Election storage election = elections[electionId];
        
        require(identityContract.hasIdentity(msg.sender), "No verified identity");
        require(election.status == ElectionStatus.Active, "Election not active");
        require(block.timestamp >= election.startTime && block.timestamp <= election.endTime, "Outside voting period");
        require(!election.hasVoted[msg.sender], "Already voted");
        
        // Verify candidate exists
        bool candidateExists = false;
        for (uint256 i = 0; i < election.candidates.length; i++) {
            if (keccak256(bytes(election.candidates[i])) == keccak256(bytes(candidate))) {
                candidateExists = true;
                break;
            }
        }
        require(candidateExists, "Invalid candidate");
        
        election.hasVoted[msg.sender] = true;
        election.voterChoices[msg.sender] = candidate;
        election.votes[candidate]++;
        election.totalVotes++;
        
        emit VoteCast(electionId, msg.sender, candidate);
    }
    
    /**
     * @dev End an election and determine winner
     */
    function endElection(uint256 electionId) external {
        Election storage election = elections[electionId];
        require(election.status == ElectionStatus.Active, "Not active");
        require(block.timestamp >= election.endTime, "Election not ended");
        
        election.status = ElectionStatus.Ended;
        
        // Find winner
        string memory winner = "";
        uint256 maxVotes = 0;
        
        for (uint256 i = 0; i < election.candidates.length; i++) {
            if (election.votes[election.candidates[i]] > maxVotes) {
                maxVotes = election.votes[election.candidates[i]];
                winner = election.candidates[i];
            }
        }
        
        emit ElectionEnded(electionId, winner);
    }
    
    /**
     * @dev Get vote count for a candidate
     */
    function getVoteCount(uint256 electionId, string memory candidate) 
        external 
        view 
        returns (uint256) 
    {
        return elections[electionId].votes[candidate];
    }
    
    /**
     * @dev Get election details
     */
    function getElection(uint256 electionId) 
        external 
        view 
        returns (
            uint256 id,
            address creator,
            string memory title,
            string memory description,
            string[] memory candidates,
            VotingType votingType,
            uint256 startTime,
            uint256 endTime,
            ElectionStatus status,
            uint256 totalVotes,
            bool isPrivate,
            uint256 rewardAmount
        ) 
    {
        Election storage election = elections[electionId];
        return (
            election.electionId,
            election.creator,
            election.title,
            election.description,
            election.candidates,
            election.votingType,
            election.startTime,
            election.endTime,
            election.status,
            election.totalVotes,
            election.isPrivate,
            election.rewardAmount
        );
    }
    
    /**
     * @dev Check if user has voted
     */
    function hasVoted(uint256 electionId, address voter) external view returns (bool) {
        return elections[electionId].hasVoted[voter];
    }
    
    /**
     * @dev Distribute rewards to voters (to be called after election ends)
     */
    function distributeRewards(uint256 electionId) external nonReentrant {
        Election storage election = elections[electionId];
        require(election.status == ElectionStatus.Ended, "Election not ended");
        require(election.rewardAmount > 0, "No rewards");
        
        // This is a simplified version - in production, you'd track all voters
        // and distribute proportionally
        // For now, this is a placeholder
    }
}

