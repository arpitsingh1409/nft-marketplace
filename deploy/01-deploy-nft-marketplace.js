const { network } = require("hardhat");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let args = [];

  const nftMarketplace = await deploy("NftMarketplace", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(nftMarketplace.address, args);
  }

  log("---------------------------------");
};

module.exports.tags = ["all", "nftmarketplace"];
