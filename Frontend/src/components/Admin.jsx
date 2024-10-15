import React, { useEffect, useState } from "react";
import contract from "../hooks/web3";
import { useNavigate } from "react-router-dom";
function Admin() {
  const [isadmin, setisadmin] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [candidatename, setCandidateName] = useState("");
  const [candidateparty, setCandidateParty] = useState("");
  const [candidateID, setCandidateID] = useState("");
  const [candidateNewName, setCandidateNewName] = useState("");
  const [candidateNewParty, setCandidateNewParty] = useState("");
  const [voterAddress, setVoterAddress] = useState(""); // State for voter address
  const navigate = useNavigate();
  let admin = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const validate = await contract.methods.isAdmin(accounts[0]).call();
    setCurrentAccount(accounts[0]);
    return validate;
  };
  const [voters, setVoters] = useState([]);
  const fetchVoters = async () => {
    try {
      const voters = await contract.methods.getAllVoters().call();
      return voters;
    } catch (error) {
      console.error("Error fetching candidates:", error);
      return [];
    }
  };
  const setAuthorizedVoters=async ()=>{
    const fetchedVoters = await fetchVoters();
    setVoters(fetchedVoters.filter((voter) => (!voter.authorized && voter.exists)));
    console.log(fetchedVoters.filter((voter) => (!voter.authorized)));
  }
  useEffect(() => {
    admin()?.then( (value) => {
      console.log(value);
      setisadmin(value);
      setAuthorizedVoters();
      if (!value) {
        alert("You Are Not Authorized");
        navigate("/");
      }
    });
    window.ethereum?.on("accountsChanged", (accounts) => {
      admin()?.then((value) => {
        console.log(value);
        setisadmin(value);
        if (!value) {
          navigate("/");
        }
      });
    });
    return () => {
      window.ethereum?.removeListener("accountsChanged", () => {});
    };
  }, []);

  if (isadmin) {
    return (
      <div className="container my-3">
        <div className="d-flex flex-column gap-3">
          <h1 className="text-center mb-2">Admin Panel</h1>

          {/* Add New Candidate Form */}
          <form className="row g-3 align-items-center">
            <div className="col-auto">
              <div className="form-group">
                <label htmlFor="newCandidate">Add New Candidate:</label>
              </div>
            </div>
            <div className="col-auto">
              <input
                type="text"
                id="newCandidate"
                className="form-control"
                placeholder="Enter candidate name"
                onChange={(e) => {
                  setCandidateName(e.target.value);
                }}
                value={candidatename}
                required
              />
            </div>

            <div className="col-auto">
              <input
                type="text"
                id="newCandidate"
                className="form-control"
                placeholder="Enter candidate Party"
                onChange={(e) => {
                  setCandidateParty(e.target.value);
                }}
                value={candidateparty}
                required
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  if (candidatename !== "" && candidateparty !== "") {
                    const gasEstimate = await contract.methods
                      .addCandidate(candidatename, candidateparty)
                      .estimateGas({ from: currentAccount });
                    await contract.methods
                      .addCandidate(candidatename, candidateparty)
                      .send({ from: currentAccount, gas: gasEstimate });
                    setCandidateName("");
                    setCandidateParty("");
                  } else {
                    alert("Please fillout all the details!!");
                  }
                }}
              >
                Add Candidate
              </button>
            </div>
          </form>

          <form className="row g-3 align-items-center">
            <div className="col-auto">
              <div className="form-group">
                <label htmlFor="candidateIdUpdate">
                  Candidate ID to Update:
                </label>
              </div>
            </div>
            <div className="col-auto">
              <input
                type="number"
                id="candidateIdUpdate"
                className="form-control"
                placeholder="Enter candidate ID"
                onChange={(e) => {
                  setCandidateID(e.target.value);
                }}
                value={candidateID}
                required
              />
            </div>
            <div className="col-auto">
              <div className="form-group">
                <label htmlFor="newName">New Name:</label>
              </div>
            </div>
            <div className="col-auto">
              <input
                type="text"
                id="newName"
                className="form-control"
                placeholder="Enter new name"
                onChange={(e) => {
                  setCandidateNewName(e.target.value);
                }}
                value={candidateNewName}
                required
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-warning"
                onClick={async () => {
                  console.log(typeof candidateID);
                  if (candidateNewName !== "" && candidateID !== "") {
                    await contract.methods
                      .updateCandidateName(
                        Number(candidateID),
                        candidateNewName
                      )
                      .send({ from: currentAccount });
                    setCandidateID("");
                    setCandidateNewName("");
                  } else {
                    alert("Please fillout all the details!!");
                  }
                }}
              >
                Update Name
              </button>
            </div>
          </form>
          <form className="row g-3 align-items-center">
            <div className="col-auto">
              <div className="form-group">
                <label htmlFor="candidateIdUpdate">
                  Candidate ID to Update:
                </label>
              </div>
            </div>
            <div className="col-auto">
              <input
                type="number"
                id="candidateIdUpdate"
                className="form-control"
                placeholder="Enter candidate ID"
                onChange={(e) => {
                  setCandidateID(e.target.value);
                }}
                value={candidateID}
                required
              />
            </div>
            <div className="col-auto">
              <div className="form-group">
                <label htmlFor="newName">New Party:</label>
              </div>
            </div>
            <div className="col-auto">
              <input
                type="text"
                id="newName"
                className="form-control"
                placeholder="Enter new name"
                onChange={(e) => {
                  setCandidateNewParty(e.target.value);
                }}
                value={candidateNewParty}
                required
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-warning"
                onClick={async () => {
                  console.log(typeof candidateID);
                  if (candidateNewParty !== "" && candidateID !== "") {
                    await contract.methods
                      .updateCandidateParty(
                        Number(candidateID),
                        candidateNewParty
                      )
                      .send({ from: currentAccount });
                    setCandidateID("");
                    setCandidateNewParty("");
                  } else {
                    alert("Please fillout all the details!!");
                  }
                }}
              >
                Update Party
              </button>
            </div>
          </form>
          {/* Delete Candidate Form */}
          <form className="row g-3 align-items-center">
            <div className="col-auto">
              <div className="form-group">
                <label htmlFor="candidateIdDelete">
                  Candidate ID to Delete:
                </label>
              </div>
            </div>
            <div className="col-auto">
              <input
                type="number"
                id="candidateIdDelete"
                className="form-control"
                placeholder="Enter candidate ID"
                onChange={(e) => {
                  setCandidateID(e.target.value);
                }}
                value={candidateID}
                required
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-danger"
                onClick={async () => {
                  if (candidateID !== "") {
                    await contract.methods
                      .removeCandidate(Number(candidateID))
                      .send({ from: currentAccount });
                    setCandidateID("");
                  } else {
                    alert("Please fillout all the details!!");
                  }
                }}
              >
                Delete Candidate
              </button>
            </div>
          </form>

          {/* Authorize Voter Form */}
          <form className="row g-3 align-items-center">
            <div className="col-auto">
              <div className="form-group">
                <label htmlFor="voterAddress">Voter Address:</label>
              </div>
            </div>
            <div className="col-auto">
              <input
                type="text"
                id="voterAddress"
                className="form-control"
                placeholder="Enter voter address"
                onChange={(e) => {
                  setVoterAddress(e.target.value);
                }}
                value={voterAddress}
                required
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-danger"
                onClick={async () => {
                  if (voterAddress !== "") {
                    await contract.methods
                      .removeVoter(voterAddress)
                      .send({ from: currentAccount });
                    setVoterAddress("");
                  } else {
                    alert("Please fillout all the details!!");
                  }
                }}
              >
                Remove Voter
              </button>
            </div>
          </form>
        </div>
        {voters.length > 0 && (
          <>
            <h3>Pending Request</h3>
            <table className="table table-striped my-3">
              <thead>
                <tr>
                  <th>Voter Name</th>
                  <th>hasVoted</th>
                  <th>Authorize Voting Rights</th>
                  <th>Revoke Voting Rights</th>
                </tr>
              </thead>
              <tbody>
                {voters?.map((voter, index) => {
                  return (
                    <tr key={voter.id}>
                      <td>{voter.name}</td>
                      <td>{String(voter.hasVoted)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={async () => {
                            if (voter.id !== "") {
                              await contract.methods
                                .authorizeVoter(voter.id)
                                .send({ from: currentAccount });
                              setVoterAddress("");
                              setAuthorizedVoters();
                            }
                          }}
                        >
                          Approve
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={async () => {
                            if (voter.id !== "") {
                              await contract.methods
                                .revokeVoter(voter.id)
                                .send({ from: currentAccount });
                              setVoterAddress("");
                              setAuthorizedVoters();
                            }
                          }}
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  } else {
    return <h4 className="text-center my-3">Not Authorized</h4>;
  }
}

export default Admin;
