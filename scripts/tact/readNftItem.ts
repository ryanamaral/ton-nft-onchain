import { Address, Dictionary, Slice } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint';
import { NftItem } from '../../wrappers/TactNftItem';
import { printNftContent } from '../common/MetadataNftItem';


/**
 * Main function to run the script.
 * @param provider The network provider to use.
 * @param args The command-line arguments.
 */
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const nftAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('NFT address'));
    const nftItem = provider.open(NftItem.fromAddress(nftAddress));

    // $$type: "GetNftData"
    const {
        index: itemId,
        is_initialized: isInitialized,
        individual_content: content,
    } = await nftItem.getGetNftData();

    console.log("IndexID: " + itemId);
    console.log(`isInitialized: ${isInitialized}`);
    printNftContent(content.asSlice());
}
