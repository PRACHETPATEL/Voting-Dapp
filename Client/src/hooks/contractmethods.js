import contract from "./web3";
const fetchCandidates = async () => {
    try {
        const candidates = await contract.methods.getAllCandidates().call();
        return candidates;
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return [];
    }
};
const fetchVoters = async () => {
    try {
      const voters = await contract.methods.getAllVoters().call();
      return voters;
    } catch (error) {
      console.error("Error fetching candidates:", error);
      return [];
    }
  };
export {fetchCandidates,fetchVoters}