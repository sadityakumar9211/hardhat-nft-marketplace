const { ethers, network } = require("hardhat")
const fs = require("fs")

const frontEndContractsFile =
    "../nextjs-nft-marketplace-moralis/constants/networkMapping.json"
const frontEndAbiLocation = "../nextjs-nft-marketplace-moralis/constants/"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END == "true") {
        console.log("Updating frontend...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const chainId = network.config.chainId
    const contractAddress = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8")
    )
    if (chainId in contractAddress) {
        if (
            !contractAddress[chainId]["NftMarketplace"].includes(
                nftMarketplace.address
            )
        ) {
            contractAddress[chainId]["NftMarketplace"].push(
                nftMarketplace.address
            )
        }
    } else {
        contractAddress[chainId] = { NftMarketplace: [nftMarketplace.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddress))
}

module.exports.tags = ["all", "frontend"]
