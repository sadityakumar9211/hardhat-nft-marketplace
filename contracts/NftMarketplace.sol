// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);

contract NftMarketplace {
    //Type Declarations
    struct Listing {
        uint256 price;
        address seller;
    }

    //storage variables
    //NFT contract address ->  NFT TokenId -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    //events
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    ///////////////////////
    //     Modifiers     //
    //////////////////////
    modifier notListed(address nftAddress, uint256 tokenId, address owner) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if(listing.price > 0){
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    ///////////////////////
    //  Main Functions  //
    //////////////////////

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external notListed (nftAddress, tokenId, msg.sender){
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }

        //1. Send the NFT to the contract. Transfer -> Contract "holds" the NFT.  --> Very Intrusive
        //2. Owner can still hold their NFT, and give the marketplace approval to sell the NFT for them.

        //IERC721 is just a interface for ERC721 tokens.
        IERC721 nft = IERC721(nftAddress);

        if (nft.getApproved(tokenId) != address(this)) {
            //this function returns the address of the approved accounts.
            revert NftMarketplace__NotApprovedForMarketplace();

            /*
             basically we store the tokenId to address mapping 
             // Mapping from token ID to approved address
             mapping(uint256 => address) private _tokenApprovals;
            */
        }
        //whenever updating a mapping, we must emit an event --> helpful in updating the frontend.
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }
}

/*
1. Create a decentralized NFT Marketplace
    1. `listItem`: List NFTs on the marketplace
    2. `buyItem`: Buy the NFTs
    3. `cancelItem`: Cancel a listing
    4. `updateListing`: Update Price
    5. `withdrawProceeds`: Withdraw payment for my bought NFTs
*/
