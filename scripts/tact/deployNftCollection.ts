import { beginCell, contractAddress, toNano, Cell, Address, Dictionary } from '@ton/core';
import { NetworkProvider, compile } from '@ton/blueprint';
import { NftCollection } from '../../wrappers/TactNftCollection';
import { NftItem } from '../../wrappers/TactNftItem';
import { buildCollectionContentCellFromJSON } from '../common/MetadataCollection';
import { buildNftContentCellFromJSON } from '../common/MetadataNftItem';
import { loadJsonFile } from '../common/LoadFile';
import path from 'path';


export async function run(provider: NetworkProvider) {
    let owner = provider.sender().address!;

    // Initialize NFT collection from JSON
    const filename = 'nft_collection.json';
    const collectionContentCell: Cell = buildCollectionContentCellFromJSON(filename);
    const json = loadJsonFile(path.join(__dirname, '../../resources', filename));

    const nftCollection = provider.open(
        await NftCollection.fromInit(
            owner,
            collectionContentCell,
            {
                $$type: "RoyaltyParams", // RoyaltyParams is a struct defined in the contract
                numerator: json.royalty_params.royalty_factor,
                denominator: json.royalty_params.royalty_base,
                destination: Address.parse(json.royalty_params.royalty_address),
            }
        )
    );

    // Initialize NFT item content from JSON
    const nftContentCell = buildNftContentCellFromJSON('nft_item_0.json');

    await nftCollection.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        {
            $$type: 'Mint',
            query_id: 0n,
            nft_content: nftContentCell
        }
    );
    await provider.waitForDeploy(nftCollection.address);

    console.log(`Owner Address: ${provider.sender().address as Address}`);
    console.log(`Collection Address: ${nftCollection.address}`);
    console.log(`NFT Collection deployed 🚀 https://testnet.tonviewer.com/${nftCollection.address}`);
}
