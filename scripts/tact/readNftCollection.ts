import { beginCell, contractAddress, toNano, Cell, Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { NftItem } from '../../wrappers/TactNftItem';
import { NftCollection } from '../../wrappers/TactNftCollection';
import { printCollectionContent } from '../common/MetadataCollection';


/**
 * Main function to run the script.
 * @param provider The network provider to use.
 * @param args The command-line arguments.
 */
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const nftCollectionAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));
    const nftCollection = provider.open(NftCollection.fromAddress(nftCollectionAddress));

    const {
        next_item_index: nextItemId,
        collection_content: content,
        owner_address: ownerAddress
    } = await nftCollection.getGetCollectionData(); /* generated wrapper: tact_NftCollection.ts */

    console.log("Next IndexID: " + nextItemId);
    printCollectionContent(content.asSlice());
}
