// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        string party;
        uint256 votes;
        uint256 id;
        bool exists; // Added to track if a candidate exists
    }

    struct Voter {
        address id;
        string name;
        string aadharnumber;
        string voteridnumber;
        bool hasVoted;
        bool authorized;
        bool exists; // Added to track if a voter exists
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;

    // Declare an array to store voter addresses
    address[] public voterAddresses;

    uint256 public candidateCount;
    uint256 public voterCount;
    address private admin;

    // Events for tracking actions
    event CandidateAdded(uint256 indexed candidateId, string name, string party);
    event VoterRegistered(address indexed voterAddress, string name);
    event VoterAuthorized(address indexed voterAddress);
    event VoterRevoked(address indexed voterAddress);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VoteFailed(address indexed voter, string reason);
    event CandidateUpdated(uint256 indexed candidateId, string newName, string newParty);
    event CandidateRemoved(uint256 indexed candidateId);

    constructor(string[][] memory candidateNames) {
        admin = msg.sender;
        for (uint256 i = 0; i < candidateNames.length; i++) {
            addCandidate(candidateNames[i][0], candidateNames[i][1]);
        }
    }

    function isAdmin(address check) public view returns (bool) {
        return check == admin;
    }

    function isVoter() public view returns (bool) {
        return voters[msg.sender].exists;
    }

    function addCandidate(string memory name, string memory party) public {
        require(bytes(name).length > 0, "Candidate name cannot be empty");
        require(bytes(party).length > 0, "Party name cannot be empty");

        candidates[candidateCount] = Candidate(
            name,
            party,
            0,
            candidateCount,
            true
        ); // Mark candidate as existing
        emit CandidateAdded(candidateCount, name, party); // Emit event
        candidateCount++;
    }

    function addVoter(
        string memory name,
        string memory aadharnumber,
        string memory voteridnumber
    ) public {
        require(!isVoter(), "You are already registered as Voter");
        require(bytes(name).length > 0, "Voter name cannot be empty");
        require(
            bytes(aadharnumber).length > 0,
            "Aadhar number cannot be empty"
        );
        require(bytes(voteridnumber).length > 0, "Voter ID cannot be empty");

        voters[msg.sender] = Voter(
            msg.sender,
            name,
            aadharnumber,
            voteridnumber,
            false,
            false,
            true
        ); // Mark voter as existing

        // Add the voter's address to the array
        voterAddresses.push(msg.sender);
        emit VoterRegistered(msg.sender, name); // Emit event

        voterCount++;
    }

    function authorizeVoter(address voter) public {
        require(isAdmin(msg.sender), "Only admin can authorize voters");
        require(voters[voter].exists, "Voter does not exist");

        voters[voter].authorized = true;
        emit VoterAuthorized(voter); // Emit event
    }

    function revokeVoter(address voter) public {
        require(isAdmin(msg.sender), "Only admin can revoke voter");
        require(voters[voter].exists, "Voter does not exist");

        voters[voter].authorized = false;
        emit VoterRevoked(voter); // Emit event
    }

    function vote(uint256 candidateId) public {
        require(isVoter(), "You are not registered as Voter");
        require(
            voters[msg.sender].authorized,
            "You are not authorized to vote!"
        );
        require(!voters[msg.sender].hasVoted, "You have already voted!");
        require(candidateId < candidateCount, "Invalid candidate ID");
        require(candidates[candidateId].exists, "Candidate does not exist");

        candidates[candidateId].votes += 1;
        voters[msg.sender].hasVoted = true;
        
        emit VoteCast(msg.sender, candidateId); // Emit event for successful vote
    }

    function totalVotesFor(uint256 candidateId) public view returns (uint256) {
        require(candidateId < candidateCount, "Invalid candidate ID");
        require(candidates[candidateId].exists, "Candidate does not exist");

        return candidates[candidateId].votes;
    }

    function updateCandidateName(
        uint256 candidateId,
        string memory newName
    ) public {
        require(candidateId < candidateCount, "Invalid candidate ID");
        require(candidates[candidateId].exists, "Candidate does not exist");
        require(bytes(newName).length > 0, "New name cannot be empty");

        candidates[candidateId].name = newName;
        emit CandidateUpdated(candidateId, newName, candidates[candidateId].party); // Emit event
    }

    function updateCandidateParty(
        uint256 candidateId,
        string memory newParty
    ) public {
        require(candidateId < candidateCount, "Invalid candidate ID");
        require(candidates[candidateId].exists, "Candidate does not exist");
        require(bytes(newParty).length > 0, "New party cannot be empty");

        candidates[candidateId].party = newParty;
        emit CandidateUpdated(candidateId, candidates[candidateId].name, newParty); // Emit event
    }

    function removeCandidate(uint256 candidateId) public {
        require(candidateId < candidateCount, "Invalid candidate ID");
        require(candidates[candidateId].exists, "Candidate does not exist");

        delete candidates[candidateId];
        emit CandidateRemoved(candidateId); // Emit event
    }

    function removeByValue(address value) public {
        for (uint i = 0; i < voterAddresses.length; i++) {
            if (voterAddresses[i] == value) {
                // Shift elements to the left
                for (uint j = i; j < voterAddresses.length - 1; j++) {
                    voterAddresses[j] = voterAddresses[j + 1];
                }
                // Remove the last element
                voterAddresses.pop();
                return; // Exit after removing the first found instance
            }
        }
        revert("Value not found in the array");
    }

    function removeVoter(address voter) public {
        require(isAdmin(msg.sender), "Only admin can remove voters");
        require(voters[voter].exists, "Voter does not exist");

        // Remove the voter's address from the voterAddresses array
        removeByValue(voter);

        // Delete the voter's record from the mapping
        delete voters[voter];
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory result = new Candidate[](candidateCount);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < candidateCount; i++) {
            if (candidates[i].exists) {
                result[resultIndex] = candidates[i];
                resultIndex++;
            }
        }

        return result;
    }

    // Implementing the getAllVoters function
    function getAllVoters() public view returns (Voter[] memory) {
        Voter[] memory result = new Voter[](voterAddresses.length);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < voterAddresses.length; i++) {
            address voterAddress = voterAddresses[i];
            if (voters[voterAddress].exists) {
                result[resultIndex] = voters[voterAddress];
                resultIndex++;
            }
        }

        return result;
    }
}
