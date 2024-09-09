import { Address, Cell, toNano } from '@ton/core';
import { NetworkProvider, compile } from '@ton/blueprint';
import { NftCollection, RoyaltyParams } from '../../wrappers/FuncNftCollection';
import { buildCollectionContentCellFromJSON } from '../common/MetadataCollection';
import { loadJsonFile } from '../common/LoadFile';
import path from 'path';


function parseRoyaltyParamsFromJSON(jsonFileName: string): RoyaltyParams {
    const json = loadJsonFile(path.join(__dirname, '../../resources', jsonFileName));
    return {
        royaltyFactor: json.royalty_params.royalty_factor,
        royaltyBase: json.royalty_params.royalty_base,
        royaltyAddress: Address.parse(json.royalty_params.royalty_address)
    };
}

/**
 * Main function to run the script.
 * @param provider The network provider to use.
 * @param args The command-line arguments.
 */
export async function run(provider: NetworkProvider, args: string[]) {

    // Initialize NFT collection from JSON
    const filename = 'nft_collection.json';
    const collectionContentCell: Cell = buildCollectionContentCellFromJSON(filename);
    const royaltyParams: RoyaltyParams = parseRoyaltyParamsFromJSON(filename);

    const nftCollection = provider.open(
        NftCollection.createFromConfig({
            ownerAddress: provider.sender().address!!,
            nextItemIndex: 0,
            collectionContent: collectionContentCell,
            nftItemCode: await compile("FuncNftItem"),
            royaltyParams: royaltyParams
        }, await compile("FuncNftCollection")));

    await nftCollection.sendDeploy(
        provider.sender(),
        toNano('0.015')
    );

    await provider.waitForDeploy(nftCollection.address);

    console.log(`Owner Address: ${provider.sender().address as Address}`);
    console.log(`Collection Address: ${nftCollection.address}`);
    console.log(`NFT Collection deployed 🚀 https://testnet.tonviewer.com/${nftCollection.address}`);
}
