import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/tact/nft_collection/nft_collection.tact',
    options: {
       debug: false
    }
};
