import React, { useState, useEffect } from "react";
import contract from "../hooks/web3";
import { useNavigate } from "react-router-dom";
function VoterRegistration() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [name, setName] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [voterID, setVoterID] = useState("");
  const [errors, setErrors] = useState({ name: "", aadhar: "", voterID: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const navigate=useNavigate();
  // Validate Aadhaar number (must be 12 digits)
  const validateAadhar = (aadhar) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaarRegex.test(aadhar)) {
      return "Aadhaar number must be 12 digits.";
    }
    return "";
  };

  // Validate Voter ID (must be alphanumeric, typically 10 characters)
  const validateVoterID = (voterID) => {
    const voterIDRegex = /^[A-Z0-9]{10}$/;
    if (!voterIDRegex.test(voterID)) {
      return "Voter ID must be 10 alphanumeric characters.";
    }
    return "";
  };

  const validateForm = () => {
    let valid = true;
    const nameError = name === "" ? "Name is required." : "";
    const aadharError = validateAadhar(aadhar);
    const voterIDError = validateVoterID(voterID);

    setErrors({ name: nameError, aadhar: aadharError, voterID: voterIDError });

    if (nameError || aadharError || voterIDError) {
      valid = false;
    }

    return valid;
  };

  const registerVoter = async () => {
    if (validateForm()) {
      try {
        const gasEstimate = await contract.methods
          .addVoter(name, aadhar, voterID)
          .estimateGas({ from: currentAccount });
        await contract.methods
          .addVoter(name, aadhar, voterID)
          .send({ from: currentAccount, gas: gasEstimate });
        setName("");
        setAadhar("");
        setVoterID("");
        setErrors({ name: "", aadhar: "", voterID: "" });
        setSuccessMessage("You successfully registered as voter Please wait for authorization.");
        setTimeout(()=>{
            navigate("/")
        },2000)
      } catch (error) {
        console.error("Error registering voter:", error);
        setSuccessMessage("Error registering voter.");
      }
    }
  };

  useEffect(() => {
    const setAccount = async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    };
    setAccount();
    window.ethereum?.on("accountsChanged", (accounts) => {
      setCurrentAccount(accounts[0]);
    });

    return () => {
      window.ethereum?.removeListener("accountsChanged", () => {});
    };
  }, []);

  return (
    <div className="container text-white py-3">
      <h1 className="text-center mb-3">Voter Registration</h1>
      <form className="row g-3">
        <div className="col-12">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <small className="text-danger">{errors.name}</small>}
        </div>

        <div className="col-12">
          <label htmlFor="aadhar" className="form-label">
            Aadhaar Number
          </label>
          <input
            type="text"
            className="form-control"
            id="aadhar"
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            required
          />
          {errors.aadhar && (
            <small className="text-danger">{errors.aadhar}</small>
          )}
        </div>

        <div className="col-12">
          <label htmlFor="voterID" className="form-label">
            Voter ID Number
          </label>
          <input
            type="text"
            className="form-control"
            id="voterID"
            value={voterID}
            onChange={(e) => setVoterID(e.target.value)}
            required
          />
          {errors.voterID && (
            <small className="text-danger">{errors.voterID}</small>
          )}
        </div>

        <div className="col-12 text-center">
          <button
            type="button"
            className="btn btn-primary w-25 fw-bolder"
            onClick={registerVoter}
          >
            Register Voter
          </button>
        </div>

        {successMessage && (
          <div className="col-12">
            <div
              className={`alert alert-${
                successMessage.includes("Error") ? "danger" : "success"
              }`}
              role="alert"
            >
              {successMessage}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default VoterRegistration;
