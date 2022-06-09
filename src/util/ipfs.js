import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");

export const uploadFileToIpfs = async (file) => {
  const results = await client.add(file);
  return results;
};

export const getIpfsUrI = (fingerprint) => {
  return `https://ipfs.infura.io/ipfs/${fingerprint}`;
};
