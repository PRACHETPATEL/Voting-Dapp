const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
    try {
        await deployer.deploy(Voting, [["Narendra Modi","BJP"], ["Rahul Gandhi","INC"], ["Arvind Kegriwal","AAP"]]);
        console.log("Contract deployed!");
    } catch (error) {
        console.error("Deployment failed:", error);
    }
};
