import { Blockchain } from './blockchain'

const dificulty = Number(process.argv[2]) || 4
const blockchain = new Blockchain(dificulty)

const numBlocks = Number(process.argv[3]) || 10
let chain = blockchain.chain

for (let i = 1; i <= numBlocks; i++) {
  const block = blockchain.createBlock(`Block ${i}`)
  const mineInfo = blockchain.mineBlock(block)
  chain = blockchain.sendBlock(mineInfo.mineredBlock)
}

console.log('--- BLOCKCHAIN ---')
console.log(chain)
