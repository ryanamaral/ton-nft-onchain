import { beginCell, contractAddress, toNano, Cell, Slice, Address, Dictionary } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { toSha256 } from './OnChainEncoder';
import { BufferSerializer, BufferEnvelope } from './BufferSerializer';


export function parseDictionary(data: Slice, keys: string[]) {
    const prefix = data.preloadUint(8)
    if (prefix === 0) {
        console.log(`⏳ Parsing dictionary...`);

        data.skip(8)
        const metadataDict = data.loadDict(Dictionary.Keys.BigUint(256), BufferSerializer);

        // Iterate over the keys and retrieve values from the dictionary
        for (const key of keys) {
            // Hash the key using SHA-256
            const keyHash = toSha256(key);
            console.log(`🔑 Key: ${key}, KeyHash: ${keyHash.toString()}`);

            // Retrieve the value from the dictionary
            const dictValue = metadataDict.get(keyHash);

            if (dictValue) {
                if (key !== 'image_data') {
                    console.log(`✅ ${key}: ${dictValue.buffer.toString('utf-8')}`);
                } else {
                    console.log(`✅ ${key}: ${dictValue.buffer.byteLength} bytes`);
                }
            } else {
                console.log(`❌ Key '${key}' not found in the dictionary.`);
            }
        }
    } else {
        console.error(`Unsupported prefix: ${prefix}`);
        process.exit(1);
    }
}
