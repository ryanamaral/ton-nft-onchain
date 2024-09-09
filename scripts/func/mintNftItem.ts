import { Address, toNano, Cell, Dictionary } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { NftCollection } from '../../wrappers/FuncNftCollection';
import { NftItem } from '../../wrappers/FuncNftItem';
import { buildNftContentCellFromJSON } from '../common/MetadataNftItem';


/**
 * Main function to run the script.
 * @param provider The network provider to use.
 * @param args The command-line arguments.
 */
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const collectionAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));

    // Initialize item content from JSON
    const nftContentCell = buildNftContentCellFromJSON('nft_item_0.json');

    // Mint NFT with initialized content
    const nftCollection = provider.open(NftCollection.createFromAddress(collectionAddress));

    const { nextItemId: nextItemId } = await nftCollection.getCollectionData();
    console.log("Next IndexID: " + nextItemId);

    await nftCollection.sendMintNft(provider.sender(), {
        value: toNano("0.11"), //fixme: calc dynamically the right amount
        queryId: 0,
        amount: toNano("0.05"), //min: 0.05 TON
        itemIndex: Number(nextItemId),
        itemOwnerAddress: provider.sender().address!,
        itemContent: nftContentCell
    });

    await provider.waitForDeploy(nftCollection.address);
    console.log(`NFT Item deployed 🚀 https://testnet.tonviewer.com/${collectionAddress}`);
}
