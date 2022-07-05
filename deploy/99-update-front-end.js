const { ethers, network } = require("hardhat");
const fs = require("fs");

const frontEndContractFile =
  "../nextjs-nft-marketplace-moralis/constants/networkMapping.json";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("updating front end...");
    await updateContractAddress();
  }
};

async function updateContractAddress() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const chainId = network.config.chainId;
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractFile, "utf8")
  );
  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["NftMarketplace"].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address);
    }
  } else {
    contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] };
  }
  fs.writeFileSync(frontEndContractFile, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
