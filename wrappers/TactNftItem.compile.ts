import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/tact/nft_item/nft_item.tact',
    options: {
       debug: false
    }
};
