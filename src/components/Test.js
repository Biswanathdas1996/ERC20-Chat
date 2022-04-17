import ABI from "../ABI-connect/MessangerABI/ABI.json";
import ADDRESS from "../ABI-connect/MessangerABI/Address.json";
import Connect from "web3-access";

export const connect = Connect(ABI, ADDRESS);
