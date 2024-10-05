import React, { useState, useRef, useEffect } from 'react'
import BorrowModal from './modals/borrow'
import ConnectModal from './modals/connect'

import { FHELend, RPC, UNDERLYING_NAME, COLLATERAL_NAME, UNDERLYING_SYMBOL, COLLATERAL_SYMBOL, UNDERLYING_ADDRESS, COLLATERAL_ADDRESS, DEBT_SHARE_ADDRESS } from '../utils/const'
import FHELend_ABI from '../utils/ABI.json'

import { ethers } from 'ethers'
import { useAccount } from 'wagmi'

const Borrow = () => {

    const { isConnected } = useAccount()

    const BorrowModalRef = useRef<HTMLDivElement>(null)
    const [isBorrowModalOpen, setBorrowModalOpen] = useState(false)
    const handleBorrowModal = () => { setBorrowModalOpen(prevState => !prevState) }

    const ConnectModalRef = useRef<HTMLDivElement>(null)
    const [isConnectModalOpen, setConnectModalOpen] = useState(false)
    const handleConnectModal = () => { setConnectModalOpen(prevState => !prevState) }

    //const [posId, setPosId] = useState(null)

    const d = { name: UNDERLYING_NAME, symbol: UNDERLYING_SYMBOL, address: UNDERLYING_ADDRESS, decimals: 18 }
    const c = { name: COLLATERAL_NAME, symbol: COLLATERAL_SYMBOL, address: COLLATERAL_ADDRESS, decimals: 18 }

    const [loadingAPY, setLoadingAPY] = useState(false)
    const [APY, setAPY] = useState(0)

    const provider = new ethers.JsonRpcProvider(RPC)
    const FHELend_contract = new ethers.Contract(FHELend, FHELend_ABI, provider)

    async function getBorrowingAPY() {
        const apy = await FHELend_contract.getBorrowingAPY()
        console.log(Number(ethers.formatEther(apy)) * 100);
        setAPY(Number(ethers.formatEther(apy)) * 100)
        setLoadingAPY(false)
    }

    useEffect(() => {
        if (APY === 0) {
            setLoadingAPY(true)
            getBorrowingAPY()
        }
    }, [APY])

    return (
        <>
            <tr className="w-full font-mono">
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        <span className='flex justify-center mx-auto'>WETH</span>
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        <span className='flex justify-center mx-auto'>FUSD</span>
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm items-center flex">
                        {loadingAPY ? <>
                            <div className='flex justify-center mx-auto h-5 w-20 animate-loader bg-bg' />
                        </> : <>
                            <span className='flex justify-center mx-auto text-red'>{APY}%</span>
                        </>}
                    </div>
                </td>
                <td className="w-1/4">
                    <div className="h-12 bg-black rounded-sm">
                        <div className='h-full w-full p-1.5'>
                            {isConnected ? <>
                                <button onClick={() => handleBorrowModal()} className='w-full h-full flex justify-center items-center bg-w text-bg rounded-sm font-[500] uppercase'>
                                    Borrow
                                </button>
                            </> : <>
                                <button onClick={() => handleConnectModal()} className='w-full h-full flex justify-center items-center bg-w text-bg rounded-sm font-[500] uppercase'>
                                    Borrow
                                </button>
                            </>}
                        </div>
                    </div>
                </td>
            </tr>
            <>
                {isBorrowModalOpen && <><BorrowModal collateral={c} deposit={d} apy={APY} showModal={isBorrowModalOpen} closeModal={handleBorrowModal} ref={BorrowModalRef} /></>}
                {isConnectModalOpen && <><ConnectModal showModal={isConnectModalOpen} closeModal={handleConnectModal} ref={ConnectModalRef} /></>}
            </>
        </>
    )
}

export default Borrow
