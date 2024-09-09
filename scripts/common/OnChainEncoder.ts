import { Dictionary, DictionaryKeyTypes, Cell, beginCell } from '@ton/core';
import { sha256_sync } from '@ton/crypto';

// On-chain content layout:
//
// The first byte is 0x00 and the rest is key/value dictionary. 
// Key is sha256 hash of string. 
// Value is data encoded as described in "Data serialization" paragraph.
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

export const ON_CHAIN_PREFIX = 0x00;

export function toDictionaryCell<K extends DictionaryKeyTypes, V>(dictionary: Dictionary<K, V>): Cell {
    return beginCell()
        .storeUint(ON_CHAIN_PREFIX, 8)  // Store the on-chain prefix
        .storeDict(dictionary)         // Store the dictionary
        .endCell();
}

export function encodeBufferOnChain(buffer: Buffer): Buffer {
  const prefix = Buffer.from([ON_CHAIN_PREFIX]);
  return Buffer.concat([prefix, buffer]);
}

export function decodeBufferOnChain(buffer: Buffer): Buffer {
  let prefix = buffer[0];
  if (prefix !== ON_CHAIN_PREFIX) {
    throw new Error(`Unsupported prefix: ${prefix}`);
  }
  return buffer.subarray(1);
}

export function toSha256(s: string): bigint {
    return BigInt('0x' + sha256_sync(s).toString('hex'));
}
