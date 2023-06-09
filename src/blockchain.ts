import { hash, hashValidate } from './helpers'

export interface Block {
  header: {
    nonce: number
    hashBlock: string
  }
  payload: {
    sequence: number
    timestamp: number
    data: any
    hashBefore: string
  }
}

export class Blockchain {
  #chain: Block[] = []
  private prefixPow = '0'

  constructor(private readonly dificulty: number = 4) {
    this.#chain.push(this.createGenesisBlock())
  }

  private createGenesisBlock(): Block {
    const payload: Block['payload'] = {
      sequence: 0,
      timestamp: +new Date(),
      data: 'Initial Block',
      hashBefore: ''
    }

    return {
      header: {
        nonce: 0,
        hashBlock: hash(JSON.stringify(payload))
      },
      payload
    }
  }

  get chain() {
    return this.#chain
  }

  private get lastBlock(): Block {
    return this.#chain.at(-1) as Block
  }

  private hashLastBlock() {
    return this.lastBlock.header.hashBlock
  }

  createBlock(data: any): Block['payload'] {
    const newBlock: Block['payload'] = {
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp: +new Date(),
      data,
      hashBefore: this.hashLastBlock()
    }

    console.log(`Block #${newBlock.sequence} criado: ${JSON.stringify(newBlock)}`)
    return newBlock
  }

  mineBlock(block: Block['payload']) {
    let nonce = 0
    const start = +new Date()

    while (true) {
      const hashBlock = hash(JSON.stringify(block))
      const hashPow = hash(hashBlock + nonce)

      if (hashValidate({ hash: hashPow, dificulty: this.dificulty, prefix: this.prefixPow })) {
        const end = +new Date()
        const hashReduce = hashBlock.slice(0, 12)
        const mineTime = (end - start) / 1000

        console.log(`Block #${block.sequence} minerado em ${mineTime}s. Hash ${hashReduce} (${nonce} tentativas)`)

        return {
          mineredBlock: {
            payload: { ...block },
            header: {
              nonce,
              hashBlock
            }
          }
        }
      }
      nonce++
    }
  }

  verifyBlock(block: Block): boolean {
    if (block.payload.hashBefore !== this.hashLastBlock()) {
      console.error(
        `Block #${
          block.payload.sequence
        } inválido: O hash anterior é ${this.hashLastBlock()} e não ${block.payload.hashBefore.slice(0, 12)}`
      )
      return false
    }
    const hashTeste = hash(hash(JSON.stringify(block.payload)) + block.header.nonce)

    if (!hashValidate({ hash: hashTeste, dificulty: this.dificulty, prefix: this.prefixPow })) {
      console.error(
        `Block #${block.payload.sequence} inválido: Nonce ${block.header.nonce} é invalido e não pode ser verificado`
      )
      return false
    }

    return true
  }

  sendBlock(block: Block): Block[] {
    if (this.verifyBlock(block)) {
      this.#chain.push(block)
      console.log(`Block #${block.payload.sequence} foi adicionado a blockchain: ${JSON.stringify(block, null, 2)}`)
    }

    return this.#chain
  }
}
