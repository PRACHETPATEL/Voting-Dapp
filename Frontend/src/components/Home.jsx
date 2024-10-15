import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import contract from "../hooks/web3";
import CandidateDetails from "./CandidateDetails";

function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [candidateID, setCandidateID] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    className: "",
    message: "",
  });
  const [candidates, setCandidates] = useState([]);

  let navigate = useNavigate();
  const fetchCandidates = async () => {
    try {
      const candidates = await contract.methods.getAllCandidates().call();
      return candidates;
    } catch (error) {
      console.error("Error fetching candidates:", error);
      return [];
    }
  };
  let voter = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);
    const validate = await contract.methods
      .isVoter()
      .call({ from: accounts[0] });
    return validate;
  };
  let admin = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);
    const validate = await contract.methods.isAdmin(accounts[0]).call();
    return validate;
  };
  useEffect(() => {
    const init = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
        const fetchedCandidates = await fetchCandidates();
        setCandidates(fetchedCandidates);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };
    admin()?.then((value) => {
      if (value) {
        navigate("/admin");
      } else {
        voter()?.then((value) => {
          if (!value) {
            navigate("/registervoter");
          }
        });
      }
    });

    init();
    window.ethereum?.on("accountsChanged", (accounts) => {
      admin()?.then((value) => {
        if (value) {
          navigate("/admin");
        } else {
          voter()?.then((value) => {
            if (!value) {
              navigate("/registervoter");
            }
          });
        }
      });
      setCurrentAccount(accounts[0]);
    });

    return () => {
      window.ethereum?.removeListener("accountsChanged", () => {});
    };
  }, []);

  return (
    <div className="container text-white ">
      <h1 className="text-center py-3">Decentralized Voting System</h1>
      <h3>
        Your Account Number:{" "}
        <span className="text-success">{currentAccount}</span>
      </h3>
      <CandidateDetails candidates={candidates} />

      <div className="row g-3 align-items-center">
        <div className="col-auto">
          <div className="form-group">
            <label htmlFor="candidateIdVote">Vote for Candidate (ID):</label>
          </div>
        </div>
        <div className="col-auto">
          <input
            type="number"
            id="candidateIdVote"
            placeholder="Enter candidate ID"
            className="form-control"
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
            className="btn btn-success"
            onClick={async () => {
              try {
                await contract.methods
                  .vote(candidateID)
                  .send({ from: currentAccount });
                const updatedCandidates = await fetchCandidates();
                setCandidates(updatedCandidates);
                setAlert({
                  show: true,
                  className: "alert-success",
                  message: "Vote cast successfully!",
                }); // Success message
              } catch (error) {
                let errorMessage = JSON.stringify(error, null, 2);
                errorMessage = JSON.parse(errorMessage);
                console.log(errorMessage);
                if (
                  errorMessage?.innerError?.message.includes(
                    "You have already voted!"
                  )
                ) {
                  setAlert({
                    show: true,

                    className: "alert-danger",
                    message: "You have already voted for this candidate.",
                  });
                } else if (
                  errorMessage?.innerError?.message.includes(
                    "You are not authorized to vote!"
                  )
                ) {
                  setAlert({
                    show: true,
                    className: "alert-danger",
                    message: "You are not authorized to vote!",
                  });
                } else if (
                  errorMessage?.innerError?.message.includes(
                    "You are not registered as Voter"
                  )
                ) {
                  setAlert({
                    show: true,
                    className: "alert-danger",
                    message: "You are not registered as Voter!",
                  });
                } else {
                  setAlert({
                    show: true,

                    className: "alert-danger",
                    message:
                      "An error occurred while voting. Please try again.",
                  });
                }
              }
              setCandidateID("");
            }}
          >
            Vote
          </button>
        </div>
        {alert.show && (
          <div className={"alert " + alert.className}>{alert.message}</div>
        )}
      </div>
    </div>
  );
}

export default Home;
