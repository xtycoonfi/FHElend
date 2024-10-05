'use client'
import React, { useState, useRef } from 'react';

import ConnectModal from './modals/connect';

import { config } from '../utils/config';
import { useAccount } from 'wagmi';
import { disconnect } from '@wagmi/core'

const Connector = () => {

    const { isConnected, address } = useAccount()

    const ConnectModalRef = useRef<HTMLDivElement>(null)
    const [isConnectModalOpen, setConnectModalOpen] = useState(false)
    const handleConnectModal = () => { setConnectModalOpen(prevState => !prevState) }

    const formatAddr = (address: `0x${string}` | undefined) => {
        const formatAddr = `${address?.slice(0, 6)}...${address?.slice(-2)}`
        return formatAddr
    }

    return <>
        {isConnected ? <>
            <button onClick={async () => await disconnect(config)} className='bg-w font-[500] text-bg rounded-sm px-2.5 text-sm hover:opacity-75 flex items-center'>
                <span>{formatAddr(address)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="ml-1 w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
            </button>
        </> : <>
            <button onClick={() => handleConnectModal()} className='bg-w font-[500] text-bg rounded-sm px-2.5 text-sm hover:opacity-75 flex items-center'>
                <span>Connect</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1 w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
            </button>
        </>}
        <>
            {isConnectModalOpen && <><ConnectModal showModal={isConnectModalOpen} closeModal={handleConnectModal} ref={ConnectModalRef} /></>}
        </>
    </>
}

export default Connector
