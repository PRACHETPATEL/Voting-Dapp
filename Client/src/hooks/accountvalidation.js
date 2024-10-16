import contract from "./web3";
let isVoter = async () => {
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    const validate = await contract.methods
        .isVoter()
        .call({ from: accounts[0] });
    return validate;
};
let isAdmin = async () => {
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
   
    const validate = await contract.methods.isAdmin(accounts[0]).call();
    return validate;
};
export {isVoter,isAdmin}