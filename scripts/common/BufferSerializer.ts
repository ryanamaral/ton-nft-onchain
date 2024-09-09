import { Builder, Dictionary, Slice } from "@ton/core";
import { encodeBufferOnChain, decodeBufferOnChain } from './OnChainEncoder';
import { makeSnakeCell, flattenSnakeCell } from './SnakeCell';


export interface BufferEnvelope {
  buffer: Buffer;
}

export const BufferSerializer = {
    serialize(envelope: BufferEnvelope, builder: Builder) {
        const data = encodeBufferOnChain(envelope.buffer)
        builder.storeRef(makeSnakeCell(data));
    },
    parse(src: Slice): BufferEnvelope {
        const ref = src.loadRef().asSlice();
        const data = decodeBufferOnChain(flattenSnakeCell(ref.asCell()))
        return { buffer: data };
    },
};
