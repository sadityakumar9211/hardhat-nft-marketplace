const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

//stores the images to IPFS
async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath) //finding the absolute path of the images
    const files = fs.readdirSync(fullImagesPath) //reading the images
    let responses = []
    console.log("Uploading to IPFS...")
    for (let file of files) {
        //making readable stream for these files. As these are images so we can't just push them.
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${file}`)
        try {
            //pinata stuff --> uploading thse readableStreams of Images.
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(response)
            console.log("Successfully uploaded to IPFS!")
        } catch (e) {
            console.log(e)
        }
    }
    return { responses, files }
}


async function storeTokenUriMetadata(metadata){
    try{
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    }catch(e){
        console.log(e)
    }
    return null
}


module.exports = { storeImages, storeTokenUriMetadata }
