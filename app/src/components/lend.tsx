import React, { useState, useRef, useEffect } from 'react'
import LendModal from './modals/lend'
import ConnectModal from './modals/connect'

import { FHELend, RPC, UNDERLYING_NAME, UNDERLYING_SYMBOL, UNDERLYING_ADDRESS } from '../utils/const'
import FHELend_ABI from '../utils/ABI.json'

import { useAccount } from 'wagmi'
import { ethers } from 'ethers'

const Lend = () => {

    const LendModalRef = useRef<HTMLDivElement>(null)
    const [isLendModalOpen, setLendModalOpen] = useState(false)
    const handleLendModal = () => { setLendModalOpen(prevState => !prevState) }

    const ConnectModalRef = useRef<HTMLDivElement>(null)
    const [isConnectModalOpen, setConnectModalOpen] = useState(false)
    const handleConnectModal = () => { setConnectModalOpen(prevState => !prevState) }

    const d = { name: UNDERLYING_NAME, symbol: UNDERLYING_SYMBOL, address: UNDERLYING_ADDRESS, decimals: 18 }

    const provider = new ethers.JsonRpcProvider(RPC)
    const FHELend_contract = new ethers.Contract(FHELend, FHELend_ABI, provider)

    const [loadingAPY, setLoadingAPY] = useState(false)
    const [APY, setAPY] = useState(0)

    async function getLendingAPY() {
        const apy = await FHELend_contract.getLendingAPY()
        console.log(Number(ethers.formatEther(apy)) * 100);
        setAPY(Number(ethers.formatEther(apy)) * 100)
        setLoadingAPY(false)
    }

    useEffect(() => {
        if (APY === 0) {
            setLoadingAPY(true)
            getLendingAPY()
        }
    }, [APY])

    const { isConnected } = useAccount()

    return (
        <>
            <tr className="w-full font-mono">
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        <span className='flex justify-center mx-auto'>FUSD</span>
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        <span className='flex justify-center mx-auto'>WETH</span>
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        {loadingAPY ? <>
                            <div className='flex justify-center mx-auto h-5 w-20 animate-loader bg-bg' />
                        </> : <>
                            <span className='flex justify-center mx-auto text-green'>{APY.toFixed(2)}%</span>
                        </>}
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm">
                        <div className='h-full w-full p-1.5'>
                            {isConnected ? <>
                                <button onClick={() => handleLendModal()} className='w-full h-full flex justify-center items-center bg-w text-bg rounded-sm font-[500] uppercase'>
                                    Lend
                                </button>
                            </> : <>
                                <button onClick={() => handleConnectModal()} className='w-full h-full flex justify-center items-center bg-w text-bg rounded-sm font-[500] uppercase'>
                                    Lend
                                </button>
                            </>}
                        </div>
                    </div>
                </td>
            </tr>
            <>
                {isLendModalOpen && <><LendModal deposit={d} apy={APY} showModal={isLendModalOpen} closeModal={handleLendModal} ref={LendModalRef} /></>}
                {isConnectModalOpen && <><ConnectModal showModal={isConnectModalOpen} closeModal={handleConnectModal} ref={ConnectModalRef} /></>}
            </>
        </>
    )
}

export default Lend
