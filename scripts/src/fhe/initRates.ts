import { EncryptionTypes, FhenixClient } from 'fhenixjs';
import { ethers } from 'ethers';

import dotenv from 'dotenv';
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY
const FHElend_CONTRACT = process.env.FHElend_CONTRACT;
import ABI from './utils/ABI.json'

// const provider = new ethers.JsonRpcProvider('http://127.0.0.1:42069')
const provider = new ethers.JsonRpcProvider('https://api.helium.fhenix.zone')
//@ts-ignore
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
//@ts-ignore
const client = new FhenixClient({ provider })
//@ts-ignore
const contract = new ethers.Contract(FHElend_CONTRACT, ABI, wallet);

function uint8ArrayToHex(arr: Uint8Array): string {
    return '0x' + Array.from(arr, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function init(base: number, slope: number) {

    const encryptedbase = await client.encrypt(base, EncryptionTypes.uint32)
    const encryptedslope = await client.encrypt(slope, EncryptionTypes.uint32)

    const encryptedbaseHEX = uint8ArrayToHex(encryptedbase.data)
    const encryptedslopeHEX = uint8ArrayToHex(encryptedslope.data)

    const tx = await contract.initializeEncryptedRates(encryptedbaseHEX, encryptedslopeHEX)
    console.log(tx.hash)

    const receipt = await tx.wait()
    console.log(receipt.hash)

}

init(2, 20)

