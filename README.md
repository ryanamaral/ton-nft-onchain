# TON NFT OnChain (FunC/Tact)

Deploy NFTs with **OnChain** _Image Binary_ & _Metadata_ on the TON Blockchain using either `FunC` or `Tact` contracts available in this repository. 
Storing both the image and metadata directly on-chain ensures enhanced decentralization, security, and immutability.

The repository includes contracts based on `FunC` and `Tact`, two of TON Blockchain's smart contract programming languages.

The code is inspired by the article "[NFTs with On-chain Metadata on TON: Tutorial](https://medium.com/miki-dev/nfts-with-on-chain-metadata-on-ton-tutorial-55ac0cbb17d5)" by Vladislav Lenskii and is built upon off-chain contracts from the following sources:
* [FunC contracts](https://github.com/ton-blockchain/token-contract)
* [Tact contracts](https://github.com/getgems-community-tact/nft-template-in-tact)

This project utilizes [Blueprint](https://github.com/ton-org/blueprint), a development environment for TON blockchain smart contracts.


## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.


## How to use

### Install

`npm install`

### Build

`npx blueprint build`

### Test

`npx blueprint test`

### Deploy

`npx blueprint run`


## License
MIT License
