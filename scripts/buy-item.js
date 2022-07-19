const { ether, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 2

async function buyItem() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
    const price = listing.price.toString()
    //buying the nft
    const tx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
        value: price,
    })
    await tx.wait(1)
    console.log("Bought NFT!")
    if (network.config.chainId == 31337) {
        moveBlocks(2, (sleepAmount = 1000)) //1s
    }
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
