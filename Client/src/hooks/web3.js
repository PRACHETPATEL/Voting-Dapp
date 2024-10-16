import Web3 from "web3";
import  {contractAddress,contractABI} from '../utils/contractdetails'
const web3 = new Web3(window.ethereum || "http://localhost:7545");
const contract = new web3.eth.Contract(contractABI, contractAddress);
export default contract