import { Address, Dictionary, Slice } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint';
import { NftItem } from '../../wrappers/FuncNftItem';
import { printNftContent } from '../common/MetadataNftItem';


/**
 * Main function to run the script.
 * @param provider The network provider to use.
 * @param args The command-line arguments.
 */
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const nftAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('NFT address'));
    const nftItem = provider.open(NftItem.createFromAddress(nftAddress));

    const { content: content } = await nftItem.getNftData();
    printNftContent(content.asSlice());
}
