import React, { forwardRef, useState } from 'react'

import { FHELend, UNDERLYING_SYMBOL, UNDERLYING_ADDRESS, YIELD_SHARE_ADDRESS, YIELD_SHARE_SYMBOL } from '../../utils/const'
import { abi } from '../../utils/abi'

import { ethers } from 'ethers'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { minERC20ABI } from '../../utils/minERC20'

// import {Process} from './process'

type Token = {
    name: string,
    symbol: string,
    address: string,
    decimals: number
}

interface LendModalProps {
    deposit: Token
    apy: number
    showModal: boolean
    closeModal: () => void
}

const LendModal = forwardRef<HTMLDivElement, LendModalProps>(({ deposit, apy, showModal, closeModal }, ref) => {

    const { writeContract } = useWriteContract()

    const [display, setDisplay] = useState('deposit')
    const { isConnected, address } = useAccount()

    const [inputValue, setInputValue] = useState('')

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const regex = new RegExp(`^\\d*\\.?\\d{0,${18}}$`)
        if (regex.test(value)) {
            setInputValue(value)
        } else return
    }

    function setMax(amount_wei: any) {
        setInputValue(ethers.formatUnits(amount_wei, 18))
    }

    //@ts-ignore
    const { data: balanceYieldShare, isLoading: loadingYieldShare } = useReadContract({ address: YIELD_SHARE_ADDRESS, abi: minERC20ABI, functionName: 'balanceOf', args: [address], enabled: isConnected && !!address })
    //@ts-ignore
    const { data: balanceUnderlying, isLoading: loadingUnderlying } = useReadContract({ address: UNDERLYING_ADDRESS, abi: minERC20ABI, functionName: 'balanceOf', args: [address], enabled: isConnected && !!address })


    return (
        <>
            <div ref={ref} className={`h-screen fixed inset-0 z-50 ${showModal ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div className={`h-screen fixed inset-0 bg-bg transition-opacity duration-300 ${showModal ? 'opacity-70' : 'opacity-0'}`} onClick={closeModal} />
                <div className={`h-fit absolute lg:h-auto lg:inset-0 left-0 right-0 bottom-0 lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-w-lg bg-bg border-t-[0.25px] border-ba lg:border-[0.75px] lg:rounded-sm shadow-lg overflow-hidden transition-all duration-1000 ease-out ${showModal ? 'translate-y-0 opacity-100 ' : 'translate-y-full lg:translate-y-0 opacity-0'}`}>
                    <div className='flex justify-between mx-auto items-center p-3.5 border-b-[0.25px] border-ba'>
                        <h3 className='text-lg mt-0.5 font-normal'>Lend {deposit.symbol} for <span className='text-green mx-0.5 font-mono'>{apy.toFixed(2)}%</span> APY</h3>
                        <button onClick={() => closeModal()} type="button" aria-expanded="false" id="react-aria4544150664-:r1:" aria-label="Menu" className="items-center flex justify-center select-none bg-ba hover:opacity-75 rounded-sm whitespace-nowrap font-bold focus:outline-none focus-visible:outline-main focus-visible:outline-offset-0 text-sm focus-visible:text-white transition duration-200 ease-in-out" data-rac="">
                            <svg className="w-[30px] h-[30px] p-[1px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className='w-full flex items-center border-b-[0.75px] border-ba py-[1px]'>
                        <button onClick={() => setDisplay('deposit')} className={`text-sm uppercase w-1/2 font-normal py-1 border-e-[0.75px] border-ba ${display == 'deposit' ? 'bg-w text-bg font-[500]' : 'hover:opacity-75'}`}>Deposit</button>
                        <button onClick={() => setDisplay('withdraw')} className={`text-sm uppercase w-1/2 font-normal py-1 ${display == 'withdraw' ? 'bg-w text-bg font-[500]' : 'hover:opacity-75'}`}>Withdraw</button>
                    </div>
                    {display === 'deposit' && <>
                        <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba'>
                            <div className='h-20 bg-ba'>
                                <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                    <div className='w-full mx-2.5 justify-between flex items-center'>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => handleInput(e)}
                                            className="w-3/4 bg-transparent font-mono justify-end text-end text-white outline-none overflow-x-hidden"
                                            placeholder="0.0"
                                            pattern="^[0-9]*[.,]?[0-9]*$"
                                        />
                                        <span className='flex justify-start mx-2.5 font-mono'>{UNDERLYING_SYMBOL}</span>
                                        <button onClick={() => setMax(balanceUnderlying)} className='bg-bg p-1.5 hover:opacity-75 text-xs'>MAX</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba '>
                            <button onClick={() => writeContract({ abi, address: FHELend, functionName: 'lend', args: [ethers.parseUnits(inputValue, 18).toString()] })} className='flex justify-center mx-auto bg-w py-1.5 text-bg font-[500] uppercase w-full'>
                                Lend {deposit.symbol}
                            </button>
                        </div>
                    </>}
                    {display === 'withdraw' && <>
                        <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba'>
                            <div className='h-20 bg-ba'>
                                <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                    <div className='w-full mx-2.5 justify-between flex items-center'>
                                        <span>Your yield share <span className='text-xs opacity-75'>(value increasing)</span></span>
                                        {/* @ts-ignore */}
                                        <span className='font-mono pl-1.5'>{!loadingYieldShare ? <span className='mx-2'>{Number(ethers.formatUnits(balanceYieldShare, 18)).toFixed(2)}</span> : <span className='bg-bg w-10 h-5 animate-loader' />}{YIELD_SHARE_SYMBOL}</span>
                                    </div>
                                </div>
                                {/* <div className='h-20 flex items-center border-[0.5px] border-bg'>
                                    <div className='w-full mx-2.5 justify-between flex items-center'>
                                        <span>Converted in {UNDERLYING_SYMBOL}</span>
                                        <span className='font-mono pl-1.5'>{!loadingYieldShare ? <span className='mx-2'>{Number(ethers.formatUnits(balanceYieldShare, 18)).toFixed(2)}</span> : <span className='bg-bg w-10 h-5 animate-loader'></span>}{YIELD_SHARE_SYMBOL}</span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className='block justify-center mx-auto p-3.5 border-b-[0.25px] border-ba'>
                            <button onClick={() => writeContract({ abi, address: FHELend, functionName: 'withdraw', args: [balanceYieldShare] })} className='flex justify-center mx-auto bg-w py-1.5 text-bg font-[500] uppercase w-full'>
                                Withdraw {deposit.symbol}
                            </button>
                        </div>
                    </>}
                </div>
            </div>
        </>
    )
})

export default LendModal