import { beginCell, contractAddress, toNano, Cell, Address, Dictionary } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { NftCollection } from '../../wrappers/TactNftCollection';
import { NftItem } from '../../wrappers/TactNftItem';
import { buildNftContentCellFromJSON } from '../common/MetadataNftItem';


/**
 * Main function to run the script.
 * @param provider The network provider to use.
 * @param args The command-line arguments.
 */
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const nftCollectionAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));
    const nftCollection = provider.open(NftCollection.fromAddress(nftCollectionAddress));

    // Initialize NFT item content from JSON
    const nftContentCell = buildNftContentCellFromJSON('nft_item_1.json');

    const { next_item_index: nextItemIndex } = await nftCollection.getGetCollectionData();
    console.log("Next IndexID: " + nextItemIndex);

    await nftCollection.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        {
            $$type: 'Mint',
            query_id: nextItemIndex,
            nft_content: nftContentCell
        }
    );
    console.log(`NFT Item deployed 🚀 https://testnet.tonviewer.com/${nftCollection.address}`);
}
