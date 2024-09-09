import { beginCell, contractAddress, toNano, Cell, Address, Dictionary } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import "@ton/test-utils";
import { NftCollection } from "../wrappers/TactNftCollection";
import { NftItem } from "../wrappers/TactNftItem";
import { loadJsonFile } from '../scripts/common/LoadFile';
import { BufferSerializer, BufferEnvelope } from '../scripts/common/BufferSerializer';
import { toDictionaryCell, toSha256 } from '../scripts/common/OnChainEncoder';

//
// run: $ npm test TactNftCollection
//
describe("contract", () => {

    const collectionDict = Dictionary.empty(Dictionary.Keys.BigUint(256), BufferSerializer);
    collectionDict.set(toSha256("name"), { buffer: Buffer.from("OnChain NFT Collection") });
    collectionDict.set(toSha256("description"), { buffer: Buffer.from("Collection of NFTs 100% on-chain.") });
    const collectionContentCell = toDictionaryCell(collectionDict);

    const nftDict = Dictionary.empty(Dictionary.Keys.BigUint(256), BufferSerializer);
    nftDict.set(toSha256("name"), { buffer: Buffer.from("#000") });
    nftDict.set(toSha256("description"), { buffer: Buffer.from("OnChain NFT.") });
    const nftContentCell = toDictionaryCell(nftDict);

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let collection: SandboxContract<NftCollection>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");

        collection = blockchain.openContract(
            await NftCollection.fromInit(deployer.address, collectionContentCell, {
                $$type: "RoyaltyParams",
                numerator: 350n, // 350n = 35%
                denominator: 1000n,
                destination: deployer.address,
            })
        );

        const deploy_result = await collection.send(
            deployer.getSender(),
            {
                value: toNano('0.2'),
            },
            {
                $$type: 'Mint',
                query_id: 0n,
                nft_content: nftContentCell
            }
        );

        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            deploy: true,
            success: true,
        });
    });

    it("Test", async () => {
        console.log("Next IndexID: " + (await collection.getGetCollectionData()).next_item_index);
        console.log("Collection Address: " + collection.address);
    });

    it("should deploy correctly", async () => {
        const deploy_result = await collection.send(
            deployer.getSender(),
            {
                value: toNano('0.2'),
            },
            {
                $$type: 'Mint',
                query_id: 0n,
                nft_content: nftContentCell
            }
        );
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            success: true,
        });

        console.log("Next IndexID: " + (await collection.getGetCollectionData()).next_item_index);
    });
});
