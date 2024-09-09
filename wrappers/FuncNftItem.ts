import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider } from '@ton/core';


export class NftItem implements Contract {

    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new NftItem(address);
    }

    async getNftData(provider: ContractProvider) {
        const result = (await provider.get('get_nft_data', [])).stack;
        return {
            init: result.readNumber(),
            index: result.readNumber(),
            collection_address: result.readAddress(),
            owner_address: result.readAddress(),
            content: result.readCell(),
        };
    }
}
