import { beginCell, contractAddress, toNano, Cell, Slice, Address, Dictionary } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { loadJsonFile, loadImageBuffer } from './LoadFile';
import { BufferSerializer, BufferEnvelope } from './BufferSerializer';
import { toDictionaryCell, toSha256 } from './OnChainEncoder';
import { parseDictionary } from './ParseDictionary';
import path from 'path';


export function buildNftContentCellFromJSON(jsonFileName: string): Cell {
    const json = loadJsonFile(path.join(__dirname, '../../resources', jsonFileName));
    // initialize an empty dictionary with key type as BigUint(256) and custom serializer
    const metadataDict = Dictionary.empty(Dictionary.Keys.BigUint(256), BufferSerializer);
    // convert NFT content to metadata record
    const metadata: Record<string, BufferEnvelope> = {
        name: { buffer: Buffer.from(json.name) },
        description: { buffer: Buffer.from(json.description) },
        image_data: { buffer: loadImageBuffer(path.join(__dirname, '../../resources', json.image_path)) },
        attributes: { buffer: Buffer.from(JSON.stringify(json.attributes)) },
    };
    // hash keys and set values in the dictionary
    metadataDict.set(toSha256("name"), metadata.name);
    metadataDict.set(toSha256("description"), metadata.description);
    metadataDict.set(toSha256("image_data"), metadata.image_data);
    metadataDict.set(toSha256("attributes"), metadata.attributes);
    // create a Cell to store the metadata dictionary
    return toDictionaryCell(metadataDict);
}

export function printNftContent(data: Slice) {
    const keys = ['name', 'description', 'attributes', 'image_data', 'image'];
    parseDictionary(data, keys);
}
