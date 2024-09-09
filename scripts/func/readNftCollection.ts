import { Address, Dictionary, Slice } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint';
import { NftItem } from '../../wrappers/FuncNftItem';
import { NftCollection, RoyaltyParams } from '../../wrappers/FuncNftCollection';
import { printCollectionContent } from '../common/MetadataCollection';


/**
 * Main function to run the script.
 * @param provider The network provider to use.
 * @param args The command-line arguments.
 */
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const nftCollectionAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));
    const nftCollection = provider.open(NftCollection.createFromAddress(nftCollectionAddress));

    const {
        nextItemId: nextItemId,
        ownerAddress: ownerAddress,
        collectionContent: content
    } = await nftCollection.getCollectionData();

    console.log("Next IndexID: " + nextItemId);
    printCollectionContent(content.asSlice());
}
