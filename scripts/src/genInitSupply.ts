import { EncryptionTypes, FhenixClient } from 'fhenixjs';
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('https://api.helium.fhenix.zone')
//@ts-ignore
const client = new FhenixClient({ provider });

async function gen(supplywei: number) {
    const encrypted = await client.encrypt(5, EncryptionTypes.uint8);
    console.log(encrypted)
    return encrypted
}

gen(1)

