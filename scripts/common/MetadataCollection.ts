import { beginCell, contractAddress, toNano, Cell, Slice, Address, Dictionary } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { loadJsonFile, loadImageBuffer } from './LoadFile';
import { BufferSerializer, BufferEnvelope } from './BufferSerializer';
import { toDictionaryCell, toSha256 } from './OnChainEncoder';
import { parseDictionary } from './ParseDictionary';
import path from 'path';


export function buildCollectionContentCellFromJSON(jsonFileName: string): Cell {
    const json = loadJsonFile(path.join(__dirname, '../../resources', jsonFileName));
    // initialize an empty dictionary with key type as BigUint(256) and custom serializer
    const metadataDict = Dictionary.empty(Dictionary.Keys.BigUint(256), BufferSerializer);
    // convert NFT content to metadata record
    const metadata: Record<string, BufferEnvelope> = {
        name: { buffer: Buffer.from(json.name) },
        description: { buffer: Buffer.from(json.description) },
        image: { buffer: Buffer.from(json.image) },
        cover_image: { buffer: Buffer.from(json.cover_image) },
    };
    // hash keys and set values in the dictionary
    metadataDict.set(toSha256("name"), metadata.name);
    metadataDict.set(toSha256("description"), metadata.description);
    metadataDict.set(toSha256("image"), metadata.image);
    metadataDict.set(toSha256("cover_image"), metadata.cover_image);
    // create a Cell to store the metadata dictionary
    return toDictionaryCell(metadataDict);
}

export function printCollectionContent(data: Slice) {
    const keys = ['name', 'description', 'image', 'cover_image'];
    parseDictionary(data, keys);
}
