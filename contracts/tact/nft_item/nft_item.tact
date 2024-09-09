// based on: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/nft_item/nft_item.tact
import "./structs";
import "./messages";


contract NftItem {

    const minTonsForStorage: Int = ton("0.2");
    const gasConsumption: Int = ton("0.2");

    item_index: Int as uint64;
    collection_address: Address;
    owner: Address;
    individual_content: Cell;
    is_initialized: Bool;

    init(item_index: Int, collection_address: Address, owner: Address, individual_content: Cell){
        self.item_index = item_index;
        self.collection_address = collection_address;
        self.owner = owner;
        self.individual_content = individual_content;
        self.is_initialized = false;
    }

    receive(msg: Transfer){
        let ctx: Context = context();
        let msgValue: Int = ctx.value; // Check the gasCost for storage
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);

        // Only Owner of the this NFT Item can transfer it.
        //require(ctx.sender == self.owner, "not owner");

        if (self.is_initialized == false) {  // [Transfer] aka the "Minting" of the NFT
            self.is_initialized = true;
            self.owner = msg.new_owner;

            send(SendParameters{
                to: msg.response_destination,
                value: 0,
                mode:  SendIgnoreErrors + SendRemainingValue,
                body: Excesses { query_id: msg.query_id }.toCell() //0xd53276db
            });
        } else {
            self.owner = msg.new_owner; // change current owner to the new_owner

            if (msg.forward_amount > 0) {
                send(SendParameters{
                    to: msg.new_owner,
                    value: msg.forward_amount,
                    mode: SendIgnoreErrors, 
                    bounce: false,
                    body: OwnershipAssigned{
                        query_id: msg.query_id,
                        prev_owner: ctx.sender,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }); 
            }

            msgValue = msgValue - ctx.readForwardFee();
            send(SendParameters{
                to: msg.response_destination,
                value: msgValue - msg.forward_amount,
                mode: SendPayGasSeparately,
                body: Excesses { query_id: msg.query_id }.toCell() // 0xd53276db
            });
        }
    }
    
    receive(msg: GetStaticData){ 
        let ctx: Context = context();
        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: 64,  // (return msg amount except gas fees) 
            bounce: true,
            body: ReportStaticData{
                query_id: msg.query_id,
                index_id: self.item_index,
                collection: self.collection_address
            }.toCell()
        });
    }

    // ===== Public Methods ===== //

    get fun get_nft_data(): GetNftData {
        return GetNftData {
            is_initialized: self.is_initialized,
            index: self.item_index,
            collection_address: self.collection_address,
            owner_address: self.owner,
            individual_content: self.individual_content
        };
    }
}
