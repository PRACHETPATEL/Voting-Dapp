const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
    try {
        await deployer.deploy(Voting, [["Prachet","BJP"], ["Bob","INC"], ["Alice","AAP"]]);
        console.log("Contract deployed!");
    } catch (error) {
        console.error("Deployment failed:", error);
    }
};
