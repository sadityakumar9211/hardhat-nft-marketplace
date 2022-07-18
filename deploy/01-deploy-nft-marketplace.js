const { network } = require("hardhat")
const { developmentChains} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------")
    const NftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("----------------------------------------")
    log(`NftMarketplace contract deployed at: ${NftMarketplace.address}`)

    //verifying the contract
    //verifying the contract on rinkeby.etherscan.io
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("verifying...")
        await verify(NftMarketplace.address, [])
        log("Contract Verified on Etherscan...")
    }
}

module.exports.tags = ["all", "NftMarketplace", "main"]
