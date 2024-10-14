const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
const contractAddress = "0xce60998cD57ae4A1d1c2553252A989Bd086dbB30"; 
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "candidateNames",
        "type": "string[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "candidateCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "votes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "check",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "totalVotesFor",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "newName",
        "type": "string"
      }
    ],
    "name": "updateCandidateName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "removeCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCandidates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "votes",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function loadCandidates() {
    const candidates = await contract.methods.getAllCandidates().call();
    
    const candidateList = document.getElementById("candidateList");
    candidateList.innerHTML = "";
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                const currentAccount = accounts[0]; 
                if (currentAccount) {
                    console.log("Current account:", currentAccount);
                } else {
                    console.log("No account selected.");
                }
            })
            .catch((error) => {
                console.error("Error connecting to MetaMask:", error);
            });
    } else {
        console.error("MetaMask is not installed.");
    }
    const currentAccount = window.ethereum.selectedAddress;
    const isAdmin = await contract.methods.isAdmin(currentAccount).call();
    console.log(isAdmin);
    candidates.forEach((candidate, index) => {
        if (candidate.name !== "") {
            candidateList.innerHTML += `<li>ID: ${index}, Name: ${candidate.name}, Votes: ${candidate.votes}</li>`;
        }
    });
}
document.getElementById("create-candidate-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const candidateName = document.getElementById("newCandidate").value;
    const accounts = await web3.eth.getAccounts();
    const currentAccount = window.ethereum.selectedAddress;
    await contract.methods.addCandidate(candidateName).send({ from: currentAccount });
    loadCandidates();
});

document.getElementById("update-candidate-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const candidateId = document.getElementById("candidateIdUpdate").value;
    const newName = document.getElementById("newName").value;
    const currentAccount = window.ethereum.selectedAddress;
    await contract.methods.updateCandidateName(candidateId, newName).send({ from:currentAccount});
    loadCandidates();
});

document.getElementById("delete-candidate-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const candidateId = document.getElementById("candidateIdDelete").value;
    const currentAccount = window.ethereum.selectedAddress;
    await contract.methods.removeCandidate(candidateId).send({ from:currentAccount});
    loadCandidates();
});

document.getElementById("voting-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const candidateId = document.getElementById("candidateIdVote").value;
    const currentAccount = window.ethereum.selectedAddress;
    await contract.methods.vote(candidateId).send({ from:currentAccount});
    loadCandidates();
});

window.onload = loadCandidates;