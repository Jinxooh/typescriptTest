import * as CryptoJs from 'crypto-js';
class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  static calculateBlockHash = (
    index: number, previousHash: string, timestamp: number, data: string
  ): string => CryptoJs.SHA256(index + previousHash + timestamp + data).toString();

  static validate = (block: Block): boolean => typeof block.index === 'number' &&
    typeof block.hash === 'string' &&
    typeof block.previousHash === 'string' &&
    typeof block.data === 'string' &&
    typeof block.timestamp === 'number';

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number,
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "11231231123", "", "Hello", 123456);

let blockChain: Block[] = [genesisBlock];

const getBolckChain = (): Block[] => blockChain;
const getLatestBlock = (): Block => blockChain[blockChain.length - 1];
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

// Block.calculateBlockHash()
const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimeStamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, newTimeStamp, data);

  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimeStamp,
  )

  addBlock(newBlock);

  return newBlock;
}

const getHashForBlock = (block: Block): string => Block.calculateBlockHash(block.index, block.previousHash, block.timestamp, block.data);

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validate(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
}

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockChain.push(candidateBlock);
  }
}

createNewBlock('second block');
createNewBlock('3 block');
createNewBlock('4 block');
createNewBlock('5 block');

console.log(blockChain);

export {};