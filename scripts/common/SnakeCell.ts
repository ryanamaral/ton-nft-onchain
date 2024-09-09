import { beginCell, BitBuilder, BitReader, Cell, Dictionary, Slice } from "@ton/core";

const MAX_CELL_SIZE = 127; // 127 bytes (exactly 1023 bits)

export function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, MAX_CELL_SIZE);
  if (chunks.length === 0) {
    return beginCell().endCell();
  }
  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell();
  }
  let curCell = beginCell();

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];
    curCell.storeBuffer(chunk);
    if (i - 1 >= 0) {
      const nextCell = beginCell();
      nextCell.storeRef(curCell);
      curCell = nextCell;
    }
  }
  return curCell.endCell();
}

export function bufferToChunks(buff: Buffer, chunkSize: number): Buffer[] {
  let chunks: Buffer[] = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.subarray(0, chunkSize));
    buff = buff.subarray(chunkSize);
  }
  return chunks;
}

export function flattenSnakeCell(cell: Cell): Buffer {
  let c: Cell | null = cell;
  const buffers: Buffer[] = []; // Array to store each chunk of data

  // Traverse the entire chain of cells
  while (c) {
    const cs = c.beginParse();
    
    if (cs.remainingBits === 0) {
      break; // If no bits are left to parse, break the loop
    }

    // Load the bits from the current cell as a buffer
    const data = cs.loadBuffer(Math.ceil(cs.remainingBits / 8));
    buffers.push(data); // Add the chunk to our buffer array

    // Move to the next cell in the chain
    c = c.refs && c.refs[0] ? c.refs[0] : null;
  }

  // Combine all the buffers into a single buffer
  return Buffer.concat(buffers);
}
