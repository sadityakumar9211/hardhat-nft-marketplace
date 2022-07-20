//mints the nft

const { ethers } = require("hardhat")
const {moveBlocks} = require("../utils/move-blocks")
const {network} = require("hardhat")

const PRICE = ethers.utils.parseEther("0.1")

async function mint() {


    //the contracts are already deployed.
    //this script just call some of the functions of the already deployed contracts
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    
    //Minting the nft
    console.log("Minting...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId

    console.log(`Minted tokenId: ${tokenId}`)
    console.log(`NFT Address ${basicNft.address}`)
    
    //mining  a block to make sure the nft is listed and is confirmed.
    if(network.config.chainId == 31337){
        await moveBlocks(2, (sleepAmount = 1000)) //1s
    }

}   

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
