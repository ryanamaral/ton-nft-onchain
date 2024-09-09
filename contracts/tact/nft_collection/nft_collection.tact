// based on: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/nft_collection/nft_collection.tact
import "@stdlib/ownable";
import "./structs";
import "./messages";
import "./../nft_item/nft_item";


contract NftCollection with Ownable {

    const minTonsForStorage: Int = ton("0.1");
    const gasConsumption: Int = ton("0.1"); // gas consuption for different operations may differ, so it's better to separate such consts

    owner: Address;
    next_item_index: Int as uint32 = 0;
    collection_content: Cell;
    royalty_params: RoyaltyParams;
    nft_addresses: map<Int, Address>;

    init(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams){
        self.owner = owner_address;
        self.collection_content = collection_content; 
        self.royalty_params = royalty_params;
    }

    // [Collection Contract] -> Transfer -> OwnershipAssigned -> Excesses
    receive(msg: Mint){
        self.requireOwner();
        require(self.next_item_index >= 0, "non-sequential NFTs");

        let ctx: Context = context(); // get sender Info
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);

        let init: StateInit = initOf NftItem(self.next_item_index, myAddress(), self.owner, msg.nft_content);
        let nft_item_address: Address = contractAddress(init);

        // https://docs.tact-lang.org/book/send
        send(
            SendParameters{
                to: nft_item_address,
                value: msgValue,
                bounce: false,
                mode: SendIgnoreErrors,
                code: init.code, // initial code of the contract (the compiled bytecode)
                data: init.data, // initial data of the contract (arguments of init() function of the contract)
                body: Transfer {
                    query_id: msg.query_id,
                    new_owner: ctx.sender,
                    response_destination: self.owner,
                    custom_payload: emptyCell(),
                    forward_amount: 0,
                    forward_payload: emptySlice()
                }.toCell() // message body as a Cell
            }
        ); // Fields [code] and [data] are what's called an <init> package, which is used in deployments of new contracts.

        self.nft_addresses.set(self.next_item_index, nft_item_address);
        self.next_item_index = self.next_item_index + 1;
    }

    // ===== Private Methods ===== //

    receive(msg: GetRoyaltyParams) {   
        let ctx: Context = context(); // get sender Info
        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: 64, 
            bounce: false,
            body: ReportRoyaltyParams {
                query_id: msg.query_id,
                numerator:  self.royalty_params.numerator,
                denominator: self.royalty_params.denominator,
                destination: self.owner
            }.toCell()
        });        
    }

    // ===== Public Methods ===== //

    get fun get_collection_data(): CollectionData {
        return CollectionData{
            next_item_index: self.next_item_index,
            collection_content: self.collection_content,
            owner_address: self.owner
        };
    }

    get fun get_nft_address_by_index(item_index: Int): Address?{
        return self.nft_addresses.get(item_index);
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royalty_params;
    }

    get fun get_nft_content(index: Int, individual_content: Cell): Cell {
        return individual_content;
    }
}